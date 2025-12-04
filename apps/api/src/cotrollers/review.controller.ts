import { NextFunction, Request, Response } from 'express';
import { ReviewService } from '../service/review.service';
import { ResponseHelper } from '../utils/response';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.reviewService.getReviewsByPropertyId(propertyId, page, limit);

      return ResponseHelper.success(res, {
        message: 'Reviews fetched successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const { propertyId } = req.params;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      if (!rating || !comment) {
        return ResponseHelper.badRequest(res, { error: 'Rating and comment are required' });
      }

      const review = await this.reviewService.createReview(propertyId, userId, rating, comment);

      return ResponseHelper.created(res, {
        message: 'Review created successfully',
        review,
      });
    } catch (err) {
      next(err);
    }
  }
}
