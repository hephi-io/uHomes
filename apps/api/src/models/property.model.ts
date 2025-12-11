import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  location: string;

  price: number;
  roomType: 'single' | 'shared' | 'self_contain';

  images: {
    url: string;
    cloudinary_id: string;
  }[];

  amenities: {
    wifi: boolean;
    kitchen: boolean;
    security: boolean;
    parking: boolean;
    power24_7: boolean;
    gym: boolean;
  };

  agentId: mongoose.Types.ObjectId;
  isAvailable: boolean;
  rating?: number;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    price: { type: Number, required: true },
    roomType: {
      type: String,
      required: true,
      enum: ['single', 'shared', 'self_contain'],
    },

    images: [
      {
        url: { type: String, required: true },
        cloudinary_id: { type: String, required: true },
      },
    ],

    amenities: {
      wifi: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      power24_7: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
    },

    isAvailable: { type: Boolean, default: true },

    rating: { type: Number, default: 0 },

    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>('Property', propertySchema);

export default Property;
