import express from 'express';
import { ReviewController } from '../cotrollers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
const reviewController = new ReviewController();

/**
 * @swagger
 * /api/property/{propertyId}/reviews:
 *   get:
 *     summary: Get reviews for a property
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       404:
 *         description: Property not found
 */
router.get('/:propertyId/reviews', reviewController.getReviews.bind(reviewController));

/**
 * @swagger
 * /api/property/{propertyId}/reviews:
 *   post:
 *     summary: Create a review for a property
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great hostel with excellent amenities!
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 *       409:
 *         description: User has already reviewed this property
 */
router.post(
  '/:propertyId/reviews',
  authenticate,
  reviewController.createReview.bind(reviewController)
);

export default router;
