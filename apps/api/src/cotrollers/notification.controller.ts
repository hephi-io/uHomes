import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../service/notification.service';
import { ResponseHelper } from '../utils/response';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const filters = {
        read: req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
      };

      const result = await this.notificationService.getUserNotifications(userId, filters);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const count = await this.notificationService.getUnreadCount(userId);
      return ResponseHelper.success(res, { unreadCount: count });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notification = await this.notificationService.markAsRead(req.params.id, userId);
      return ResponseHelper.success(res, notification);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await this.notificationService.markAllAsRead(userId);
      return ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await this.notificationService.deleteNotification(req.params.id, userId);
      return ResponseHelper.success(res, { message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }
}
