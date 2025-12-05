import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  paymentId: mongoose.Types.ObjectId;
  user_Id: mongoose.Types.ObjectId;
  reference: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: 'payment', required: true },
    user_Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
