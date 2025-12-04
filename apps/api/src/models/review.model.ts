import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Index for efficient queries
reviewSchema.index({ propertyId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, propertyId: 1 }); // Prevent duplicate reviews

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
