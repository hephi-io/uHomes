import mongoose, { Schema, Document } from 'mongoose';

export interface IUserType extends Document {
  userId: mongoose.Types.ObjectId; // ref: 'User', unique, required
  type: 'student' | 'agent' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userTypeSchema: Schema<IUserType> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One user can only have one type
    },
    type: {
      type: String,
      enum: ['student', 'agent', 'admin'],
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
userTypeSchema.index({ userId: 1, type: 1 });
// Index on type for filtering
userTypeSchema.index({ type: 1 });
// Ensure one type per user (unique constraint)
userTypeSchema.index({ userId: 1 }, { unique: true });

const UserType = mongoose.model<IUserType>('UserType', userTypeSchema);

export default UserType;
