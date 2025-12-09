import mongoose from 'mongoose';
import { Transaction } from '../src/models/transaction.model';
import { Payment } from '../src/models/payment.model';
import { TransactionService } from '../src/service/transaction.service';
import { NotFoundError } from '../src/middlewares/error.middlewere';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let userId: string;
  let paymentId: string;

  beforeAll(async () => {
    transactionService = new TransactionService();
    userId = new mongoose.Types.ObjectId().toString();
  });

  beforeEach(async () => {
    const payment = await Payment.create({
      userId,
      amount: 1000,
      currency: 'NGN',
      paymentMethod: 'card',
      status: 'pending',
      reference: 'test_ref',
    });
    paymentId = payment._id.toString();
  });

  afterEach(async () => {
    await Transaction.deleteMany({});
    await Payment.deleteMany({});
  });

  describe('getAllTransactions', () => {
    it('should get all transactions for a user', async () => {
      await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref1',
      });

      await Transaction.create({
        paymentId,
        userId,
        amount: 2000,
        currency: 'NGN',
        status: 'pending',
        reference: 'ref2',
      });

      const otherUserId = new mongoose.Types.ObjectId().toString();
      const otherPayment = await Payment.create({
        userId: otherUserId,
        amount: 3000,
        currency: 'NGN',
        paymentMethod: 'card',
        status: 'pending',
        reference: 'other_ref',
      });

      await Transaction.create({
        paymentId: otherPayment._id,
        userId: otherUserId,
        amount: 3000,
        currency: 'NGN',
        status: 'completed',
        reference: 'other_ref',
      });

      const result = await transactionService.getAllTransactions(userId, {});

      expect(result.transactions.length).toBe(2);
      expect(result.transactions.every((t) => t.userId.toString() === userId)).toBe(true);
    });

    it('should filter transactions by status', async () => {
      await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref_completed',
      });

      await Transaction.create({
        paymentId,
        userId,
        amount: 2000,
        currency: 'NGN',
        status: 'pending',
        reference: 'ref_pending',
      });

      const result = await transactionService.getAllTransactions(userId, { status: 'completed' });

      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].status).toBe('completed');
    });

    it('should filter transactions by date range', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref_date',
        createdAt: new Date(),
      });

      const result = await transactionService.getAllTransactions(userId, {
        fromDate: yesterday.toISOString(),
        toDate: tomorrow.toISOString(),
      });

      expect(result.transactions.length).toBe(1);
    });

    it('should filter transactions by amount range', async () => {
      await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref_amount1',
      });

      await Transaction.create({
        paymentId,
        userId,
        amount: 5000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref_amount2',
      });

      const result = await transactionService.getAllTransactions(userId, {
        minAmount: 2000,
        maxAmount: 10000,
      });

      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].amount).toBe(5000);
    });

    it('should search transactions by reference or description', async () => {
      await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'unique_ref_123',
        description: 'Test payment',
      });

      await Transaction.create({
        paymentId,
        userId,
        amount: 2000,
        currency: 'NGN',
        status: 'completed',
        reference: 'other_ref',
        description: 'Another payment',
      });

      const result = await transactionService.getAllTransactions(userId, {
        search: 'unique',
      });

      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].reference).toBe('unique_ref_123');
    });

    it('should paginate transactions', async () => {
      for (let i = 0; i < 15; i++) {
        const payment = await Payment.create({
          userId,
          amount: 1000,
          currency: 'NGN',
          paymentMethod: 'card',
          status: 'pending',
          reference: `ref_pag_${i}`,
        });

        await Transaction.create({
          paymentId: payment._id,
          userId,
          amount: 1000,
          currency: 'NGN',
          status: 'completed',
          reference: `ref_pag_${i}`,
        });
      }

      const result = await transactionService.getAllTransactions(userId, {
        limit: '10',
        page: '1',
      });

      expect(result.transactions.length).toBe(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pages).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });

    it('should return empty array if no transactions found', async () => {
      const newUserId = new mongoose.Types.ObjectId().toString();
      const result = await transactionService.getAllTransactions(newUserId, {});

      expect(result.transactions.length).toBe(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getTransactionById', () => {
    it('should get transaction by id', async () => {
      const transaction = await Transaction.create({
        paymentId,
        userId,
        amount: 1000,
        currency: 'NGN',
        status: 'completed',
        reference: 'ref_get',
      });

      const result = await transactionService.getTransactionById(transaction._id.toString());

      expect(result._id.toString()).toBe(transaction._id.toString());
      expect(result.amount).toBe(1000);
      expect(result.status).toBe('completed');
    });

    it('should throw NotFoundError if transaction not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(transactionService.getTransactionById(fakeId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for invalid id format', async () => {
      await expect(transactionService.getTransactionById('invalid_id')).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
