import mongoose from 'mongoose';
import { Response } from 'express';
import { Notification, INotification, NotificationType } from '../models/notification.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  metadata?: Record<string, unknown>;
}

interface SSEMessage {
  type: string;
  message?: string;
  timestamp?: number;
  data?: INotification;
}

interface PaginationResult {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface NotificationQuery {
  userId: mongoose.Types.ObjectId;
  read?: boolean;
}

export class NotificationService {
  // SSE client registry: Map<userId, Set<Response>>
  private static sseClients: Map<string, Set<Response>> = new Map();

  // Add SSE client
  addSSEClient(userId: string, res: Response): void {
    if (!NotificationService.sseClients.has(userId)) {
      NotificationService.sseClients.set(userId, new Set());
    }
    NotificationService.sseClients.get(userId)!.add(res);

    // Send initial connection message
    this.sendSSEMessage(res, { type: 'connected', message: 'SSE connection established' });

    // Setup heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(heartbeatInterval);
        return;
      }
      this.sendSSEMessage(res, { type: 'heartbeat', timestamp: Date.now() });
    }, 30000); // Send heartbeat every 30 seconds

    // Handle client disconnect
    res.on('close', () => {
      clearInterval(heartbeatInterval);
      this.removeSSEClient(userId, res);
    });
  }

  // Remove SSE client
  private removeSSEClient(userId: string, res: Response): void {
    const clients = NotificationService.sseClients.get(userId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        NotificationService.sseClients.delete(userId);
      }
    }
  }

  // Send SSE message to a specific client
  private sendSSEMessage(res: Response, data: SSEMessage): void {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  // Emit notification to all connected clients for a user
  private emitNotificationToUser(userId: string, notification: INotification): void {
    const clients = NotificationService.sseClients.get(userId);
    if (clients && clients.size > 0) {
      const message: SSEMessage = {
        type: 'notification',
        data: notification,
      };
      clients.forEach((client) => {
        this.sendSSEMessage(client, message);
      });
    }
  }

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

    const savedNotification = await notification.save();

    // Emit notification via SSE to connected clients
    this.emitNotificationToUser(input.userId, savedNotification);

    return savedNotification;
  }

  async getUserNotifications(
    userId: string,
    filters: { read?: boolean; limit?: number; page?: number } = {}
  ): Promise<{ notifications: INotification[]; pagination: PaginationResult }> {
    const query: NotificationQuery = { userId: new mongoose.Types.ObjectId(userId) };

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
