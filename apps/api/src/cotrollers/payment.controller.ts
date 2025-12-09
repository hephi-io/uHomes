import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../service/payment.service';
import { ResponseHelper } from '../utils/response';
import { BadRequestError } from '../middlewares/error.middlewere';
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
      const userId = req.user!.id;
      const payment = await this.paymentService.processPayment(req.params.id, userId);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const payment = await this.paymentService.refundPayment(req.params.id, userId);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as string,
        minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
        maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
        limit: req.query.limit as string,
        page: req.query.page as string,
      };

      const result = await this.paymentService.getTransactions(userId, filters);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const payment = await this.paymentService.getTransactionById(req.params.id, userId);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(req.params.id, status, userId);
      return ResponseHelper.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      if (!signature) {
        throw new BadRequestError('Missing webhook signature');
      }

      const rawBody =
        req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
      const isValid = this.paymentService.verifyWebhookSignature(rawBody, signature);

      if (!isValid) {
        logger.warn('Invalid webhook signature received');
        throw new BadRequestError('Invalid webhook signature');
      }

      const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      logger.info(`Webhook event received: ${event.event}`);

      await this.paymentService.handleWebhookEvent(event.event, event.data);

      return res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      next(error);
    }
  }
}
