import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Core authentication fields
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;

  // Student-specific fields
  university?: string;
  yearOfStudy?: '100' | '200' | '300' | '400' | '500';
  savedProperties?: mongoose.Types.ObjectId[]; // ref: 'Property'

  // Agent-specific fields
  properties?: mongoose.Types.ObjectId[]; // ref: 'Property'
  totalRevenue?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Student-specific fields
    university: {
      type: String,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      enum: ['100', '200', '300', '400', '500'],
    },
    savedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    // Agent-specific fields
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
