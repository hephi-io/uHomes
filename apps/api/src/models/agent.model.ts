import mongoose, { Schema, Document } from "mongoose"

export interface IAgent extends Document {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  role?: string
  properties: mongoose.Types.ObjectId[]
  totalRevenue?: number
  isVerified: boolean 
  createdAt: Date
  updatedAt: Date
}

const agentSchema: Schema<IAgent> = new Schema(
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
      enum: ["Agent","Student","Admin"],
      default: "Agent",
    },
     properties: [
      { type: Schema.Types.ObjectId, ref: "Property" }
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Agent = mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;
