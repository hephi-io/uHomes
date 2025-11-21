import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
<<<<<<< HEAD
  role: 'Student' | 'Agent' | 'Admin';
=======
  types: 'Student' | 'Agent' | 'Admin';
>>>>>>> 009220c (refactored user)
  typeOf: 'emailVerification' | 'login' | 'resetPassword';
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const tokenSchema: Schema<IToken> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      refPath: 'role', // dynamically refers to student or agent collection
      required: true,
    },
<<<<<<< HEAD
    role: {
=======
    types: {
>>>>>>> 009220c (refactored user)
      type: String,
      enum: ['Student', 'Agent', 'Admin'],
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
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
