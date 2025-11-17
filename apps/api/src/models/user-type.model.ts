import mongoose, { Schema, Document } from 'mongoose';

export interface IUser_type extends Document {
  userId: Schema.Types.ObjectId;
  role: string;
}

const user_typeSchema: Schema<IUser_type> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ['Agent', 'Student', 'Admin'],
    default: 'Agent',
  },
});

const User_type = mongoose.model<IUser_type>('User_type', user_typeSchema);

export default User_type;
