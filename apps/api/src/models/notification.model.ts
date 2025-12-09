import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'booking_created'
  | 'booking_updated'
  | 'booking_deleted'
  | 'payment_created'
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_refunded'
  | 'property_reviewed'
  | 'account_updated'
  | 'password_reset';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'booking_created',
        'booking_updated',
        'booking_deleted',
        'payment_created',
        'payment_completed',
        'payment_failed',
        'payment_refunded',
        'property_reviewed',
        'account_updated',
        'password_reset',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    relatedId: { type: Schema.Types.ObjectId, refPath: 'relatedModel' },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
