import mongoose from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/notification.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  async createNotification(input: CreateNotificationInput): Promise<INotification> {
    const notification = new Notification({
      userId: new mongoose.Types.ObjectId(input.userId),
      type: input.type,
      title: input.title,
      message: input.message,
      relatedId: input.relatedId ? new mongoose.Types.ObjectId(input.relatedId) : undefined,
      metadata: input.metadata,
      read: false,
    });

    return await notification.save();
  }

  async getUserNotifications(
    userId: string,
    filters: { read?: boolean; limit?: number; page?: number } = {}
  ): Promise<{ notifications: INotification[]; pagination: any }> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (filters.read !== undefined) {
      query.read = filters.read;
    }

    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      read: false,
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    notification.read = true;
    return await notification.save();
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), read: false },
      { read: true }
    );

    return { count: result.modifiedCount };
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    await notification.deleteOne();
  }
}
