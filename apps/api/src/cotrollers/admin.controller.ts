import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response';
import { AdminService } from '../service/admin.service';

export class AdminController {
  private adminService = new AdminService();

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

  // 2. Get All Users
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.adminService.getAllUsers();
      return ResponseHelper.success(res, users);
    } catch (err) {
      next(err);
    }
  }
}
