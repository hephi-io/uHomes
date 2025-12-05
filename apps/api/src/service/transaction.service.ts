import { Transaction, ITransaction } from '../models/transaction.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export class TransactionService {
  async getAllTransactions(userId: string, filters: any = {}) {
    const query: any = { user_id: userId };

    if (filters.status) query.status = filters.status;
    if (filters.transaction_type) query.transaction_type = filters.transaction_type;
    if (filters.fromDate && filters.toDate) {
      query.created_at = {
        $gte: new Date(filters.fromDate),
        $lte: new Date(filters.toDate),
      };
    }
    if (filters.minAmount || filters.maxAmount) {
      query.amount = {};
      if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
      if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
    }
    if (filters.search) {
      query.$or = [
        { reference: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const limit = parseInt(filters.limit) || 10;
    const page = parseInt(filters.page) || 1;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(query),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async getTransactionById(transactionId: string): Promise<ITransaction> {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }
}
