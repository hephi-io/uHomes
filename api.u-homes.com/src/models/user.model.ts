import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  role?: string
  isverified: boolean
  verificationToken?: string 
  createdAt: Date
  updatedAt: Date
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>("User", userSchema);

export default User;
