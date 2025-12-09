import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../service/payment.service';
import { ResponseHelper } from '../utils/response';
import Booking from '../models/booking.model';
import logger from '../utils/logger';

export class PaymentController {
  paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { payment, authorization_url } = await this.paymentService.createPayment(
        userId,
        req.body
      );

      return ResponseHelper.created(res, { payment, authorization_url });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await this.paymentService.processPayment(req.params.id);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await this.paymentService.refundPayment(req.params.id);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as string,
        minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
        maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
      };

      const payments = await this.paymentService.getTransactions(filters);
      return ResponseHelper.success(res, payments);
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await this.paymentService.getTransactionById(req.params.id);
      if (!payment) return ResponseHelper.notFound(res, 'Payment not found');

      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(req.params.id, status);
      if (!payment) return ResponseHelper.notFound(res, 'Payment not found');

      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async paymentCallback(req: Request, res: Response, _next: NextFunction) {
    try {
      const { reference } = req.query;

      if (!reference || typeof reference !== 'string') {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/students/booking/checkout?error=invalid_reference`
        );
      }

      const payment = await this.paymentService.verifyPaymentByReference(reference);

      if (payment.status === 'completed' && payment.metadata?.bookingId) {
        // Fetch booking to pass to frontend
        const booking = await Booking.findById(payment.metadata.bookingId)
          .populate('propertyid', 'title location images')
          .populate('tenant', 'fullName email phoneNumber')
          .populate('agent', 'fullName email phoneNumber');

        if (!booking) {
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:3000'}/students/booking/checkout?error=booking_not_found`
          );
        }

        // Redirect to success page with booking data in URL params
        const bookingData = encodeURIComponent(
          JSON.stringify({
            _id: booking._id,
            amount: booking.amount,
            duration: booking.duration,
            moveInDate: booking.moveInDate,
            moveOutDate: booking.moveOutDate,
            paymentStatus: booking.paymentStatus,
            status: booking.status,
            propertyType: booking.propertyType,
            property: booking.propertyid,
            tenant: booking.tenant,
            agent: booking.agent,
          })
        );

        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/students/booking/checkout-success?booking=${bookingData}`
        );
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/students/booking/checkout?error=payment_failed`
        );
      }
    } catch (error) {
      logger.error('Payment callback error:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/students/booking/checkout?error=verification_failed`
      );
    }
  }
}
