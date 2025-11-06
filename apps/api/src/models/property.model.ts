import mongoose, { Schema, Document, model } from "mongoose"

export interface IProperty extends Document {
  title: string
  description: string
  price: number
  location: string
  images: {
    url: string;
    cloudinary_id: string
  }[]
  amenities: string[]
  rating?: number
  isAvailable: boolean
  agentId: mongoose.Types.ObjectId[]
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        cloudinary_id: { type: String, required: true }
      }
    ],
    amenities: [{ type: String }],
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    agentId: [{ type: Schema.Types.ObjectId, ref: "Agent", required: true }]
  },
  { timestamps: true }
)

const property = mongoose.model<IProperty>("Property", propertySchema)
 
export default property