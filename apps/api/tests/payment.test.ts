import mongoose from 'mongoose';
import { Payment } from '../src/models/payment.model';
import { Transaction } from '../src/models/transaction.model';
import Booking from '../src/models/booking.model';
import { PaymentService } from '../src/service/payment.service';
import { PaystackService } from '../src/service/paystack.service';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../src/middlewares/error.middlewere';

// Mock PaystackService
jest.mock('../src/service/paystack.service');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let userId: string;
  let mockPaystack: jest.Mocked<PaystackService>;

  beforeAll(async () => {
    paymentService = new PaymentService();
    userId = new mongoose.Types.ObjectId().toString();

    // Get the mocked instance
    mockPaystack = (paymentService as any).paystack as jest.Mocked<PaystackService>;
  });

  afterEach(async () => {
    await Payment.deleteMany({});
    await Transaction.deleteMany({});
    await Booking.deleteMany({});
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create payment and transaction successfully', async () => {
      mockPaystack.initializeTransaction.mockResolvedValue({
        reference: 'test_ref_123',
        authorization_url: 'https://paystack.com/pay/test_ref_123',
      });

      const paymentData = {
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        email: 'test@example.com',
        description: 'Test payment',
      };

      const result = await paymentService.createPayment(userId, paymentData);

      expect(result.payment).toBeDefined();
      expect(result.authorization_url).toBe('https://paystack.com/pay/test_ref_123');
      expect(result.payment.amount).toBe(1000);
      expect(result.payment.status).toBe('pending');
      expect(result.payment.userId.toString()).toBe(userId);

      // Check transaction was created
      const transaction = await Transaction.findOne({ paymentId: result.payment._id });
      expect(transaction).toBeDefined();
      expect(transaction?.amount).toBe(1000);
    });

    it('should create payment with bookingId and validate booking', async () => {
      const booking = await Booking.create({
        propertyid: new mongoose.Types.ObjectId(),
        agent: new mongoose.Types.ObjectId(),
        tenant: userId,
        propertyType: 'apartment',
        moveInDate: new Date(),
        duration: '6 months',
        gender: 'male',
        amount: 1000,
        status: 'pending',
        paymentStatus: 'pending',
      });

      mockPaystack.initializeTransaction.mockResolvedValue({
        reference: 'test_ref_456',
        authorization_url: 'https://paystack.com/pay/test_ref_456',
      });

      const paymentData = {
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        email: 'test@example.com',
        bookingId: booking._id.toString(),
      };

      const result = await paymentService.createPayment(userId, paymentData);

      expect(result.payment.bookingId?.toString()).toBe(booking._id.toString());
    });

    it('should throw error if booking does not belong to user', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const booking = await Booking.create({
        propertyid: new mongoose.Types.ObjectId(),
        agent: new mongoose.Types.ObjectId(),
        tenant: otherUserId,
        propertyType: 'apartment',
        moveInDate: new Date(),
        duration: '6 months',
        gender: 'male',
        amount: 1000,
        status: 'pending',
        paymentStatus: 'pending',
      });

      const paymentData = {
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        email: 'test@example.com',
        bookingId: booking._id.toString(),
      };

      await expect(paymentService.createPayment(userId, paymentData)).rejects.toThrow(
        ForbiddenError
      );
    });

    it('should throw error if required fields are missing', async () => {
      const paymentData = {
        amount: 1000,
        currency: '',
        paymentMethod: 'card',
        email: 'test@example.com',
      };

      await expect(paymentService.createPayment(userId, paymentData)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('processPayment', () => {
    it('should process payment and update status to completed', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'test_ref_789',
      });

      // Create transaction for the payment
      await Transaction.create({
        paymentId: payment._id,
        userId: userId,
        amount: 1000,
        currency: 'NGN',
        status: 'pending',
        reference: 'test_ref_789',
      });

      mockPaystack.verifyTransaction.mockResolvedValue({
        status: 'success',
        data: { reference: 'test_ref_789' },
      });

      const result = await paymentService.processPayment(payment._id.toString(), userId);

      expect(result.status).toBe('completed');

      const transaction = await Transaction.findOne({ paymentId: payment._id });
      expect(transaction?.status).toBe('completed');
    });

    it('should update booking paymentStatus when payment completes', async () => {
      const booking = await Booking.create({
        propertyid: new mongoose.Types.ObjectId(),
        agent: new mongoose.Types.ObjectId(),
        tenant: userId,
        propertyType: 'apartment',
        moveInDate: new Date(),
        duration: '6 months',
        gender: 'male',
        amount: 1000,
        status: 'pending',
        paymentStatus: 'pending',
      });

      const payment = await Payment.create({
        userId,
        bookingId: booking._id,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'test_ref_booking',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'pending',
        reference: 'test_ref_booking',
      });

      mockPaystack.verifyTransaction.mockResolvedValue({
        status: 'success',
        data: { reference: 'test_ref_booking' },
      });

      await paymentService.processPayment(payment._id.toString(), userId);

      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking?.paymentStatus).toBe('paid');
    });

    it('should throw error if payment does not belong to user', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const payment = await Payment.create({
        userId: otherUserId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'test_ref_other',
      });

      await expect(paymentService.processPayment(payment._id.toString(), userId)).rejects.toThrow(
        ForbiddenError
      );
    });

    it('should throw error if payment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(paymentService.processPayment(fakeId, userId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('refundPayment', () => {
    it('should refund payment successfully', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'test_ref_refund',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'test_ref_refund',
      });

      mockPaystack.refundTransaction.mockResolvedValue({
        status: 'success',
        data: { reference: 'test_ref_refund' },
      });

      const result = await paymentService.refundPayment(payment._id.toString(), userId);

      expect(result.status).toBe('refunded');

      const transaction = await Transaction.findOne({ paymentId: payment._id });
      expect(transaction?.status).toBe('refunded');
    });

    it('should update booking paymentStatus when payment is refunded', async () => {
      const booking = await Booking.create({
        propertyid: new mongoose.Types.ObjectId(),
        agent: new mongoose.Types.ObjectId(),
        tenant: userId,
        propertyType: 'apartment',
        moveInDate: new Date(),
        duration: '6 months',
        gender: 'male',
        amount: 1000,
        status: 'confirmed',
        paymentStatus: 'paid',
      });

      const payment = await Payment.create({
        userId,
        bookingId: booking._id,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'test_ref_refund_booking',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'test_ref_refund_booking',
      });

      mockPaystack.refundTransaction.mockResolvedValue({
        status: 'success',
        data: { reference: 'test_ref_refund_booking' },
      });

      await paymentService.refundPayment(payment._id.toString(), userId);

      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking?.paymentStatus).toBe('refunded');
    });

    it('should throw error if payment is not completed', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'test_ref_pending',
      });

      await expect(paymentService.refundPayment(payment._id.toString(), userId)).rejects.toThrow(
        'Only completed payments can be refunded'
      );
    });

    it('should throw error if payment does not belong to user', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const payment = await Payment.create({
        userId: otherUserId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'test_ref_other',
      });

      await expect(paymentService.refundPayment(payment._id.toString(), userId)).rejects.toThrow(
        ForbiddenError
      );
    });
  });

  describe('getTransactions', () => {
    it('should get payments filtered by userId', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();

      await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'ref1',
      });

      await Payment.create({
        userId,
        amount: 2000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'ref2',
      });

      await Payment.create({
        userId: otherUserId,
        amount: 3000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'ref3',
      });

      const result = await paymentService.getTransactions(userId, {});

      expect(result.payments.length).toBe(2);
      expect(result.payments.every((p) => p.userId.toString() === userId)).toBe(true);
    });

    it('should filter payments by status', async () => {
      await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'ref_completed',
      });

      await Payment.create({
        userId,
        amount: 2000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'ref_pending',
      });

      const result = await paymentService.getTransactions(userId, { status: 'completed' });

      expect(result.payments.length).toBe(1);
      expect(result.payments[0].status).toBe('completed');
    });

    it('should paginate payments', async () => {
      for (let i = 0; i < 15; i++) {
        await Payment.create({
          userId,
          amount: 1000,
          currency: 'NGN',
          paymentMethod: 'card',
          status: 'completed',
          reference: `ref_${i}`,
        });
      }

      const result = await paymentService.getTransactions(userId, { limit: '10', page: '1' });

      expect(result.payments.length).toBe(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pages).toBe(2);
    });
  });

  describe('getTransactionById', () => {
    it('should get payment by id', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'ref_get',
      });

      const result = await paymentService.getTransactionById(payment._id.toString(), userId);

      expect(result?._id.toString()).toBe(payment._id.toString());
    });

    it('should throw error if payment does not belong to user', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const payment = await Payment.create({
        userId: otherUserId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'ref_other',
      });

      await expect(
        paymentService.getTransactionById(payment._id.toString(), userId)
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw error if payment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(paymentService.getTransactionById(fakeId, userId)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('handleWebhookEvent', () => {
    it('should handle charge.success event and update payment status', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'webhook_ref',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'pending',
        reference: 'webhook_ref',
      });

      await paymentService.handleWebhookEvent('charge.success', {
        reference: 'webhook_ref',
      });

      const updatedPayment = await Payment.findById(payment._id);
      expect(updatedPayment?.status).toBe('completed');

      const updatedTransaction = await Transaction.findOne({ paymentId: payment._id });
      expect(updatedTransaction?.status).toBe('completed');
    });

    it('should handle charge.failed event and update payment status', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'webhook_failed',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'pending',
        reference: 'webhook_failed',
      });

      await paymentService.handleWebhookEvent('charge.failed', {
        reference: 'webhook_failed',
      });

      const updatedPayment = await Payment.findById(payment._id);
      expect(updatedPayment?.status).toBe('failed');

      const updatedTransaction = await Transaction.findOne({ paymentId: payment._id });
      expect(updatedTransaction?.status).toBe('failed');
    });

    it('should update booking paymentStatus on successful webhook', async () => {
      const booking = await Booking.create({
        propertyid: new mongoose.Types.ObjectId(),
        agent: new mongoose.Types.ObjectId(),
        tenant: userId,
        propertyType: 'apartment',
        moveInDate: new Date(),
        duration: '6 months',
        gender: 'male',
        amount: 1000,
        status: 'pending',
        paymentStatus: 'pending',
      });

      const payment = await Payment.create({
        userId,
        bookingId: booking._id,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'webhook_booking',
      });

      await Transaction.create({
        paymentId: payment._id,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'pending',
        reference: 'webhook_booking',
      });

      await paymentService.handleWebhookEvent('charge.success', {
        reference: 'webhook_booking',
      });

      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking?.paymentStatus).toBe('paid');
    });

    it('should not update payment if status is not pending', async () => {
      const payment = await Payment.create({
        userId,
        amount: 1000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'completed',
        reference: 'webhook_completed',
      });

      await paymentService.handleWebhookEvent('charge.success', {
        reference: 'webhook_completed',
      });

      const updatedPayment = await Payment.findById(payment._id);
      expect(updatedPayment?.status).toBe('completed');
    });
  });
});
