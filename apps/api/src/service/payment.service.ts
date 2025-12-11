import mongoose from 'mongoose';
import { Payment, IPayment } from '../models/payment.model';
import { Transaction } from '../models/transaction.model';
import Booking from '../models/booking.model';
import {
  AppError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../middlewares/error.middlewere';
import logger from '../utils/logger';
import { PaystackService } from './paystack.service';
import { NotificationService } from './notification.service';

export interface PaymentInput {
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
  metadata?: Record<string, unknown>;
  email: string;
  bookingId?: string;
}

export class PaymentService {
  private paystack: PaystackService;
  private notificationService: NotificationService;

  constructor() {
    this.paystack = new PaystackService();
    this.notificationService = new NotificationService();
  }

  async createPayment(userId: string, input: PaymentInput & { email: string }) {
    try {
      const { amount, currency, paymentMethod, description, metadata, bookingId } = input;
      if (!userId) throw new BadRequestError('User not authenticated');
      if (!amount || !currency || !paymentMethod || !input.email) {
        throw new BadRequestError('Missing required fields');
      }

      // Build callback URL for Paystack redirect (points to backend API)
      const backendUrl = process.env.BASE_URL || process.env.API_URL || 'http://localhost:7000';
      const callbackUrl = `${backendUrl}/api/payment/callback`;

      const paystackResponse = await this.paystack.initializeTransaction({
        email: input.email,
        amount,
        callback_url: callbackUrl,
      });

      const { reference, authorization_url } = paystackResponse;

      // Use MongoDB session for atomic transaction (skip in test mode if transactions not supported)
      let useTransaction = true;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();
      } catch (error: unknown) {
        // If transactions not supported (e.g., standalone MongoDB in tests), skip transaction
        const errorMessage = error instanceof Error ? error.message : '';
        if (errorMessage.includes('replica set') || errorMessage.includes('mongos')) {
          useTransaction = false;
          logger.warn('MongoDB transactions not supported, creating without transaction');
        } else {
          session.endSession();
          throw error;
        }
      }

      try {
        const payment = new Payment({
          userId,
          bookingId: bookingId ? bookingId : undefined,
          user_email: input.email,
          amount,
          currency,
          paymentMethod,
          description,
          metadata,
          status: 'pending',
          reference,
        });

        const transactionData = {
          paymentId: payment._id,
          userId: userId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          reference: payment.reference,
          description: payment.description,
          metadata: payment.metadata,
        };

        let transaction;
        if (useTransaction) {
          try {
            await payment.save({ session });
            const created = await Transaction.create([transactionData], { session });
            transaction = created[0];
            await session.commitTransaction();
          } catch (txError: unknown) {
            // If transaction fails due to replica set issue, retry without transaction
            const txErrorMessage = txError instanceof Error ? txError.message : '';
            if (txErrorMessage.includes('replica set') || txErrorMessage.includes('mongos')) {
              try {
                await session.abortTransaction();
              } catch {
                // Ignore abort errors
              }
              session.endSession();
              useTransaction = false;
              logger.warn(
                'MongoDB transactions not supported during save, retrying without transaction'
              );
              await payment.save();
              transaction = await Transaction.create(transactionData);
            } else {
              throw txError;
            }
          }
        } else {
          await payment.save();
          transaction = await Transaction.create(transactionData);
        }

        logger.info(
          `Payment and Transaction created atomically: Payment ${payment._id}, Transaction ${transaction._id}`
        );

        // Notify user about payment creation
        try {
          await this.notificationService.createNotification({
            userId: userId,
            type: 'payment_created',
            title: 'Payment Initiated',
            message: `Payment of ${currency} ${amount} has been initiated. Please complete payment.`,
            relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
            metadata: { amount, currency, bookingId: bookingId || null },
          });
        } catch (error) {
          logger.error('Failed to create notification for payment creation:', error);
        }

        return { payment, authorization_url };
      } catch (error: unknown) {
        if (useTransaction) {
          try {
            await session.abortTransaction();
          } catch {
            // Ignore abort errors
          }
        }
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger.error('Payment creation failed, transaction rolled back:', {
          message: errorObj.message,
          name: errorObj.name,
          stack: errorObj.stack,
        });
        // Re-throw known errors, otherwise wrap in BadRequestError
        if (
          error instanceof AppError ||
          errorObj.name === 'BadRequestError' ||
          errorObj.name === 'NotFoundError' ||
          errorObj.name === 'ForbiddenError' ||
          errorObj.name === 'UnauthorizedError'
        ) {
          throw error;
        }
        // If it's a validation error or other known error types, preserve the original error message
        if (errorObj.name === 'ValidationError' || errorObj.name === 'CastError') {
          throw new BadRequestError(errorObj.message || 'Failed to create payment');
        }
        // Handle MongoDB transaction errors gracefully
        if (errorObj.message.includes('replica set') || errorObj.message.includes('mongos')) {
          // Retry without transaction
          try {
            const payment = await Payment.create({
              userId,
              bookingId: bookingId ? bookingId : undefined,
              user_email: input.email,
              amount,
              currency,
              paymentMethod,
              description,
              metadata,
              status: 'pending',
              reference,
            });

            const transaction = await Transaction.create({
              paymentId: payment._id,
              userId: userId,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              reference: payment.reference,
              description: payment.description,
              metadata: payment.metadata,
            });

            logger.info(
              `Payment and Transaction created without transaction: Payment ${payment._id}, Transaction ${transaction._id}`
            );
            return { payment, authorization_url };
          } catch (retryError: unknown) {
            const retryErrorMessage =
              retryError instanceof Error ? retryError.message : 'Failed to create payment';
            throw new BadRequestError(retryErrorMessage);
          }
        }
        throw new BadRequestError('Failed to create payment');
      } finally {
        if (useTransaction) {
          session.endSession();
        }
      }
    } catch (error: unknown) {
      logger.error('Error creating payment:', error);
      // Re-throw known errors, otherwise wrap in BadRequestError
      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (
        error instanceof AppError ||
        errorObj.name === 'BadRequestError' ||
        errorObj.name === 'NotFoundError' ||
        errorObj.name === 'ForbiddenError' ||
        errorObj.name === 'UnauthorizedError'
      ) {
        throw error;
      }
      throw new BadRequestError('Failed to create payment');
    }
  }

  async processPayment(paymentId: string, userId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    // Check if payment belongs to user
    if (payment.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to access this payment');
    }

    const result = await this.paystack.verifyTransaction(payment.reference!);
    payment.status = result.data.status === 'success' ? 'completed' : 'failed';
    await payment.save();

    // Update booking payment status and booking status if bookingId exists in metadata
    if (payment.metadata?.bookingId && payment.status === 'completed') {
      try {
        const bookingId = payment.metadata.bookingId as string;
        await Booking.findByIdAndUpdate(
          bookingId,
          { paymentStatus: 'paid', status: 'confirmed' },
          { new: true }
        );
        logger.info(
          `Booking ${bookingId} payment status updated to paid and status updated to confirmed`
        );
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to update booking status:', errorMessage);
      }
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { paymentId: payment._id },
      { status: payment.status, updatedAt: new Date() },
      { new: true }
    );
    if (updatedTransaction) {
      logger.info(`Transaction ${updatedTransaction._id} status updated to ${payment.status}`);
    }

    // Update booking paymentStatus if payment is linked to a booking
    let booking = null;
    if (payment.bookingId && payment.status === 'completed') {
      booking = await Booking.findByIdAndUpdate(
        payment.bookingId,
        { paymentStatus: 'paid' },
        { new: true }
      );
      logger.info(`Booking ${payment.bookingId} payment status updated to paid`);
    }

    // Notify user about payment status
    try {
      if (payment.status === 'completed') {
        await this.notificationService.createNotification({
          userId: payment.userId.toString(),
          type: 'payment_completed',
          title: 'Payment Successful',
          message: `Your payment of ${payment.currency} ${payment.amount} was successful!`,
          relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
          metadata: { amount: payment.amount, currency: payment.currency },
        });

        // Notify agent if payment is linked to booking
        if (booking && booking.agent && payment.bookingId) {
          await this.notificationService.createNotification({
            userId: booking.agent.toString(),
            type: 'payment_completed',
            title: 'Payment Received',
            message: `Payment received for booking ${payment.bookingId}`,
            relatedId: payment.bookingId.toString(),
            metadata: { amount: payment.amount, currency: payment.currency },
          });
        }
      } else if (payment.status === 'failed') {
        await this.notificationService.createNotification({
          userId: payment.userId.toString(),
          type: 'payment_failed',
          title: 'Payment Failed',
          message: `Your payment of ${payment.currency} ${payment.amount} failed. Please try again.`,
          relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
          metadata: { amount: payment.amount, currency: payment.currency },
        });
      }
    } catch (error) {
      logger.error('Failed to create notification for payment status:', error);
    }

    logger.info(`Payment ${paymentId} processed, status: ${payment.status}`);
    return payment;
  }

  async verifyPaymentByReference(reference: string): Promise<IPayment> {
    const payment = await Payment.findOne({ reference });
    if (!payment) throw new NotFoundError('Payment not found');

    const paymentId = String(payment._id);
    const userId = payment.userId.toString();
    return this.processPayment(paymentId, userId);
  }

  async refundPayment(paymentId: string, userId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    // Check if payment belongs to user
    if (payment.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to refund this payment');
    }

    if (payment.status !== 'completed')
      throw new AppError(400, 'Only completed payments can be refunded');

    const refundResponse = await this.paystack.refundTransaction(
      payment.reference!,
      payment.amount * 100
    );
    if (refundResponse.status !== 'success') throw new AppError(400, 'Refund failed');

    payment.status = 'refunded';
    await payment.save();

    await Transaction.findOneAndUpdate(
      { paymentId: payment._id },
      { status: 'refunded', updatedAt: new Date() }
    );

    // Update booking paymentStatus if payment is linked to a booking
    let booking = null;
    if (payment.bookingId) {
      booking = await Booking.findByIdAndUpdate(
        payment.bookingId,
        { paymentStatus: 'refunded' },
        { new: true }
      );
      logger.info(`Booking ${payment.bookingId} payment status updated to refunded`);
    }

    // Notify user and agent about refund
    try {
      await this.notificationService.createNotification({
        userId: payment.userId.toString(),
        type: 'payment_refunded',
        title: 'Payment Refunded',
        message: `Your payment of ${payment.currency} ${payment.amount} has been refunded`,
        relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
        metadata: { amount: payment.amount, currency: payment.currency },
      });

      // Notify agent if payment is linked to booking
      if (booking && booking.agent && payment.bookingId) {
        await this.notificationService.createNotification({
          userId: booking.agent.toString(),
          type: 'payment_refunded',
          title: 'Payment Refunded',
          message: `Payment refunded for booking ${payment.bookingId}`,
          relatedId: payment.bookingId.toString(),
          metadata: { amount: payment.amount, currency: payment.currency },
        });
      }
    } catch (error) {
      logger.error('Failed to create notification for payment refund:', error);
    }

    logger.info(`Payment refunded successfully: ${payment._id}`);
    return payment;
  }

  async getTransactions(
    userId: string,
    filters: {
      status?: string;
      startDate?: string;
      endDate?: string;
      minAmount?: number;
      maxAmount?: number;
      limit?: string | number;
      page?: string | number;
    }
  ): Promise<{
    payments: IPayment[];
    pagination: { total: number; page: number; pages: number; limit: number };
  }> {
    interface QueryType {
      userId: string;
      status?: string;
      createdAt?: { $gte?: Date; $lte?: Date };
      amount?: { $gte?: number; $lte?: number };
    }
    const query: QueryType = { userId: userId };

    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    if (filters.minAmount) query.amount = { ...query.amount, $gte: filters.minAmount };
    if (filters.maxAmount) query.amount = { ...query.amount, $lte: filters.maxAmount };

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(query),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async getTransactionById(id: string, userId: string): Promise<IPayment | null> {
    const payment = await Payment.findById(id);
    if (!payment) throw new NotFoundError('Payment not found');

    // Check if payment belongs to user
    if (payment.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to access this payment');
    }

    return payment;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    userId: string
  ): Promise<IPayment | null> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    // Check if payment belongs to user
    if (payment.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to update this payment');
    }

    payment.status = status;
    payment.updatedAt = new Date();
    await payment.save();

    logger.info(`Payment status updated: ${paymentId} -> ${status}`);
    return payment;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return this.paystack.verifyWebhookSignature(payload, signature);
  }

  async handleWebhookEvent(event: string, data: { reference?: string; [key: string]: unknown }) {
    if (event === 'charge.success') {
      const reference = data.reference;
      if (!reference) {
        logger.error('Webhook missing reference');
        return;
      }

      const payment = await Payment.findOne({ reference });
      if (!payment) {
        logger.warn(`Payment not found for reference: ${reference}`);
        return;
      }

      if (payment.status === 'pending') {
        payment.status = 'completed';
        await payment.save();

        await Transaction.findOneAndUpdate(
          { paymentId: payment._id },
          { status: 'completed', updatedAt: new Date() }
        );

        let booking = null;
        if (payment.bookingId) {
          booking = await Booking.findByIdAndUpdate(
            payment.bookingId,
            { paymentStatus: 'paid' },
            { new: true }
          );
          logger.info(`Booking ${payment.bookingId} payment status updated to paid`);
        }

        // Notify user and agent about payment completion
        try {
          await this.notificationService.createNotification({
            userId: payment.userId.toString(),
            type: 'payment_completed',
            title: 'Payment Successful',
            message: `Your payment of ${payment.currency} ${payment.amount} was successful!`,
            relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
            metadata: { amount: payment.amount, currency: payment.currency },
          });

          if (booking && booking.agent && payment.bookingId) {
            const bookingId = payment.bookingId.toString();
            await this.notificationService.createNotification({
              userId: booking.agent.toString(),
              type: 'payment_completed',
              title: 'Payment Received',
              message: `Payment received for booking ${bookingId}`,
              relatedId: bookingId,
              metadata: { amount: payment.amount, currency: payment.currency },
            });
          }
        } catch (error) {
          logger.error('Failed to create notification for webhook payment completion:', error);
        }

        logger.info(`Payment ${payment._id} status updated to completed via webhook`);
      }
    } else if (event === 'charge.failed') {
      const reference = data.reference;
      if (!reference) {
        logger.error('Webhook missing reference');
        return;
      }

      const payment = await Payment.findOne({ reference });
      if (!payment) {
        logger.warn(`Payment not found for reference: ${reference}`);
        return;
      }

      if (payment.status === 'pending') {
        payment.status = 'failed';
        await payment.save();

        await Transaction.findOneAndUpdate(
          { paymentId: payment._id },
          { status: 'failed', updatedAt: new Date() }
        );

        // Notify user about payment failure
        try {
          await this.notificationService.createNotification({
            userId: payment.userId.toString(),
            type: 'payment_failed',
            title: 'Payment Failed',
            message: `Your payment of ${payment.currency} ${payment.amount} failed. Please try again.`,
            relatedId: (payment._id as mongoose.Types.ObjectId).toString(),
            metadata: { amount: payment.amount, currency: payment.currency },
          });
        } catch (error) {
          logger.error('Failed to create notification for webhook payment failure:', error);
        }

        logger.info(`Payment ${payment._id} status updated to failed via webhook`);
      }
    }
  }
}
