import { Payment, IPayment } from '../models/payment.model';
import { Transaction } from '../models/transaction.model';
import { AppError, BadRequestError, NotFoundError } from '../middlewares/error.middlewere';
import logger from '../utils/logger';
import { PaystackService } from './paystack.service';

export interface PaymentInput {
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
  metadata?: Record<string, any>;
  email: string;
}

export class PaymentService {
  private paystack: PaystackService;

  constructor() {
    this.paystack = new PaystackService();
  }

  async createPayment(userId: string, input: PaymentInput & { email: string }) {
    try {
      const { amount, currency, paymentMethod, description, metadata } = input;
      if (!userId) throw new BadRequestError('User not authenticated');
      if (!amount || !currency || !paymentMethod || !input.email) {
        throw new BadRequestError('Missing required fields');
      }

      const paystackResponse = await this.paystack.initializeTransaction({
        email: input.email,
        amount,
      });

      const { reference, authorization_url } = paystackResponse;

      const payment = new Payment({
        userId,
        user_email: input.email,
        amount,
        currency,
        paymentMethod,
        description,
        metadata,
        status: 'pending',
        reference,
      });

      await payment.save();

      try {
        const transaction = await Transaction.create({
          paymentId: payment._id,
          user_Id: userId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          reference: payment.reference,
          description: payment.description,
        });
        logger.info(`Transaction created: ${transaction._id}`);
      } catch (error: any) {
        logger.error('Transaction creation failed:', error.message || error);
        throw new BadRequestError('Failed to create transaction');
      }

      return { payment, authorization_url };
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw new BadRequestError('Failed to create payment');
    }
  }

  async processPayment(paymentId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    const result = await this.paystack.verifyTransaction(payment.reference!);
    payment.status = result.status === 'success' ? 'completed' : 'failed';
    await payment.save();

    await Transaction.findOneAndUpdate(
      { paymentId: payment._id },
      { status: payment.status, updatedAt: new Date() }
    );

    logger.info(`Payment ${paymentId} processed, status: ${payment.status}`);
    return payment;
  }

  async refundPayment(paymentId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');
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
    logger.info(`Payment refunded successfully: ${payment._id}`);
    return payment;
  }

  async getTransactions(filters: any): Promise<IPayment[]> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    if (filters.minAmount) query.amount = { ...query.amount, $gte: filters.minAmount };
    if (filters.maxAmount) query.amount = { ...query.amount, $lte: filters.maxAmount };

    return await Payment.find(query).sort({ createdAt: -1 });
  }

  async getTransactionById(id: string): Promise<IPayment | null> {
    const payment = await Payment.findById(id);
    if (!payment) throw new AppError(404, 'payment not found');

    return payment;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded'
  ): Promise<IPayment | null> {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (payment) logger.info(`Payment status updated: ${paymentId} -> ${status}`);
    return payment;
  }
}
