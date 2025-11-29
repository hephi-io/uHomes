import mongoose, { Document, Schema } from 'mongoose'

export interface IBooking extends Document {
  propertyid: mongoose.Types.ObjectId
  agent: mongoose.Types.ObjectId
  tenant: mongoose.Types.ObjectId
  propertyType: string
  moveInDate: Date
  moveOutDate?: Date
  duration: string
  gender: 'male' | 'female'
  specialRequest?: string
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    propertyid: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    propertyType: { type: String, required: true },
    moveInDate: { type: Date, required: true },
    moveOutDate: { type: Date },
    duration: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    specialRequest: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

const Booking = mongoose.model<IBooking>('Booking', bookingSchema)

export default Booking
