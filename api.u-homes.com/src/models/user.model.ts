import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
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
    confirmPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
 
)

//  remove confirmPassword before saving to DB
userSchema.pre("save", function (next) {
  if (this.password !== this.confirmPassword) {
    return next(new Error("Passwords do not match"))
  }
  next()
})

const User = mongoose.model<IUser>("User", userSchema)

export default User
