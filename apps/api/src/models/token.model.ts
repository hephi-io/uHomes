import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  typeOf: 'emailVerification' | 'login' | 'resetPassword';
  token: string;
  expiresAt: Date;
  createdAt: Date;
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
