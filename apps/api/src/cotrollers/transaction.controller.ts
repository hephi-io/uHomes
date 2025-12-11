import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../service/transaction.service';
import { ResponseHelper } from '../utils/response';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  // Get all transactions for a user
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) return ResponseHelper.unauthorized(res, 'User not authenticated');

      const filters = req.query;
      const { transactions, pagination } = await this.transactionService.getAllTransactions(
        userId,
        filters
      );

      return ResponseHelper.success(res, {
        message: 'Transactions fetched',
        data: transactions,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get transaction details by ID
  async getTransactionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await this.transactionService.getTransactionById(id);

      return ResponseHelper.success(res, {
        message: 'Transaction details retrieved',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }
}
