import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  typeOf: 'emailVerification' | 'login' | 'resetPassword';
  token: string;
  email?: string;
  expiresAt: Date;
  attempts?: number;
  status?: 'pending' | 'verified' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema: Schema<IToken> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // references User collection
      required: true,
    },
    typeOf: {
      type: String,
      enum: ['emailVerification', 'login', 'resetPassword'],
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'expired'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Indexes for performance
tokenSchema.index({ userId: 1 });
tokenSchema.index({ expiresAt: 1 });
tokenSchema.index({ typeOf: 1 });
// For emailVerification codes
tokenSchema.index({ email: 1 });
tokenSchema.index({ token: 1, typeOf: 1, status: 1 });
tokenSchema.index({ email: 1, typeOf: 1, status: 1 });
tokenSchema.index({ email: 1, createdAt: 1 });

// TTL index to automatically delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
