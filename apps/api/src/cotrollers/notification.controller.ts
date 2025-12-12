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

  async streamNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from query params (EventSource doesn't support custom headers)
      const token = req.query.token as string;

      if (!token) {
        res.status(401).json({ error: 'Unauthorized, token missing' });
        return;
      }

      // Verify token
      const jwt = await import('jsonwebtoken');
      let userId: string;

      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        userId = payload.id;
      } catch {
        res.status(401).json({ error: 'Unauthorized, invalid token' });
        return;
      }

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

      // Add client to SSE registry
      this.notificationService.addSSEClient(userId, res);
    } catch (error) {
      next(error);
    }
  }
}
