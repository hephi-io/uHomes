import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  university: string;
  yearOfStudy: string;
  password: string;
  role?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema: Schema<IStudent> = new Schema(
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
    university: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfStudy: {
      type: String,
      required: true,
      enum: ['100', '200', '300', '400', '500'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Student', 'Agent', 'Admin'],
      default: 'Student',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
