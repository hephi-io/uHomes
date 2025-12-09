import mongoose from 'mongoose';
import Review, { IReview } from '../models/review.model';
import Property from '../models/property.model';
import User from '../models/user.model';
import { BadRequestError, NotFoundError, ConflictError } from '../middlewares/error.middlewere';
import { NotificationService } from './notification.service';
import logger from '../utils/logger';

export class ReviewService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }
  async getReviewsByPropertyId(
    propertyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: IReview[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    averageRating: number;
  }> {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new BadRequestError('Invalid property ID');
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ propertyId });
    const totalPages = Math.ceil(total / limit);

    const reviews = await Review.find({ propertyId })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate average rating
    const ratingAggregation = await Review.aggregate([
      { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const averageRating = ratingAggregation.length > 0 ? ratingAggregation[0].averageRating : 0;

    return {
      reviews,
      total,
      page,
      limit,
      totalPages,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    };
  }

  async createReview(
    propertyId: string,
    userId: string,
    rating: number,
    comment: string
  ): Promise<IReview> {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new BadRequestError('Invalid property ID');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    if (!comment || comment.trim().length === 0) {
      throw new BadRequestError('Comment is required');
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({ propertyId, userId });
    if (existingReview) {
      throw new ConflictError('You have already reviewed this property');
    }

    // Create review
    const review = new Review({
      propertyId,
      userId,
      rating,
      comment: comment.trim(),
    });

    const savedReview = await review.save();

    // Update property average rating
    await this.updatePropertyRating(propertyId);

    // Notify agent about new review
    try {
      const propertyData = await Property.findById(propertyId);
      if (propertyData && propertyData.agentId) {
        const agentId = propertyData.agentId.toString();
        await this.notificationService.createNotification({
          userId: agentId,
          type: 'property_reviewed',
          title: 'New Review Received',
          message: `New review received for ${propertyData.title || 'your property'}`,
          relatedId: propertyId,
          metadata: { rating, reviewId: savedReview._id.toString() },
        });
      }
    } catch (error) {
      logger.error('Failed to create notification for new review:', error);
    }

    // Populate user data before returning
    await savedReview.populate('userId', 'fullName email');

    return savedReview;
  }

  private async updatePropertyRating(propertyId: string): Promise<void> {
    const ratingAggregation = await Review.aggregate([
      { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const averageRating = ratingAggregation.length > 0 ? ratingAggregation[0].averageRating : 0;

    await Property.findByIdAndUpdate(propertyId, {
      rating: Math.round(averageRating * 10) / 10,
    });
  }
}
