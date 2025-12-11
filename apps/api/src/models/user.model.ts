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
  nin?: string; // National Identification Number for KYC verification
  ninDocumentUrl?: string; // URL to uploaded National ID document
  ninVerificationStatus?: 'pending' | 'verified' | 'rejected'; // NIN verification status

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
    nin: {
      type: String,
      trim: true,
      sparse: true, // Allows null values but ensures uniqueness when present
      unique: true,
    },
    ninDocumentUrl: {
      type: String,
      trim: true,
    },
    ninVerificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ nin: 1 });

// Transform to exclude sensitive fields (password, NIN, and document URL) when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret: Record<string, any>) {
    if ('password' in ret) delete ret.password;
    if ('nin' in ret) delete ret.nin; // NIN is sensitive and should never be exposed in API responses
    if ('ninDocumentUrl' in ret) delete ret.ninDocumentUrl; // Document URL is sensitive
    return ret;
  },
});

// Also apply to toObject for consistency
userSchema.set('toObject', {
  transform: function (doc, ret: Record<string, any>) {
    if ('password' in ret) delete ret.password;
    if ('nin' in ret) delete ret.nin; // NIN is sensitive and should never be exposed in API responses
    if ('ninDocumentUrl' in ret) delete ret.ninDocumentUrl; // Document URL is sensitive
    return ret;
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
