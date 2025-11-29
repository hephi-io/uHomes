/**
 * @swagger
 * components:
 *   schemas:
 *     BookingInput:
 *       type: object
 *       required:
 *         - propertyid
 *         - propertyType
 *         - gender
 *         - moveInDate
 *         - duration
 *         - amount
 *       properties:
 *         propertyid:
 *           type: string
 *           description: ID of the property being booked
 *           example: 6720f1a96b4d3e12b8c4f412
 *         propertyType:
 *           type: string
 *           description: Type of the property (e.g., Apartment, Studio)
 *           example: Apartment
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: male
 *         specialRequest:
 *           type: string
 *           description: Optional special requests for the booking
 *           example: Early move-in if possible
 *         tenant:
 *           type: string
 *           description: ID of the tenant (optional if created by a student)
 *           example: 671fea7a8e2b5c63d4a90a23
 *         moveInDate:
 *           type: string
 *           format: date
 *           example: 2025-12-01
 *         moveOutDate:
 *           type: string
 *           format: date
 *           example: 2026-06-01
 *         duration:
 *           type: string
 *           example: 6 months
 *         amount:
 *           type: number
 *           example: 250000
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *           example: pending
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, refunded]
 *           default: pending
 *           example: pending
 */
