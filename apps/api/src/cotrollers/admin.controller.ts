import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response';
import { AdminService } from '../service/admin.service';
import { TransactionService } from '../service/transaction.service';
import { Payment } from '../models/payment.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export class AdminController {
  private adminService = new AdminService();
  private transactionService = new TransactionService();

  // 1. Verify Agent
  async verifyAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      // Simple validation
      if (!['verified', 'rejected'].includes(status)) {
        return ResponseHelper.badRequest(res, { message: 'Status must be verified or rejected' });
      }

      const result = await this.adminService.verifyAgent(userId, status);

      return ResponseHelper.success(res, {
        message: `Agent NIN status updated to ${status}`,
        user: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // 2. Get All Users (Enhanced with filters)
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await this.adminService.getAllUsersAdmin(filters);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 3. Get Dashboard Statistics
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.adminService.getDashboardStats();
      return ResponseHelper.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  // 4. Get All Transactions (Admin view)
  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await this.adminService.getAllTransactionsAdmin(filters);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 5. Get Transaction Details
  async getTransactionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await this.transactionService.getTransactionById(id);
      return ResponseHelper.success(res, {
        message: 'Transaction details retrieved',
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  }

  // 6. Get All Payments (Admin view)
  async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await this.adminService.getAllPaymentsAdmin(filters);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 7. Get Payment Details
  async getPaymentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id)
        .populate('userId', 'fullName email phoneNumber')
        .populate('bookingId');
      if (!payment) {
        throw new NotFoundError('Payment not found');
      }
      return ResponseHelper.success(res, {
        message: 'Payment details retrieved',
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }

  // 8. Get Payment Statistics
  async getPaymentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.adminService.getPaymentStats();
      return ResponseHelper.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  // 9. Get All Properties (Admin view)
  async getAllProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await this.adminService.getAllPropertiesAdmin(filters);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 10. Update Property Status
  async updatePropertyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return ResponseHelper.badRequest(res, {
          message: 'Status must be approved or rejected',
        });
      }

      const property = await this.adminService.updatePropertyStatus(id, status);
      return ResponseHelper.success(res, {
        message: `Property status updated to ${status}`,
        data: property,
      });
    } catch (err) {
      next(err);
    }
  }

  // 11. Get Agent Applications
  async getAgentApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await this.adminService.getAgentApplications(filters);
      return ResponseHelper.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}
