/**
 * @swagger
 * components:
 *   schemas:
 *     BookingInput:
 *       type: object
 *       required:
 *         - propertyid
 *         - propertyType
 *         - moveInDate
 *         - duration
 *         - gender
 *         - amount
 *       properties:
 *         propertyid:
 *           type: string
 *           description: ID of the property being booked
 *           example: 6720f1a96b4d3e12b8c4f412
 *         propertyType:
 *           type: string
 *           description: Type of property (matches your model)
 *           example: selfcontain
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
 *           example: 1 year
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: male
 *         specialRequest:
 *           type: string
 *           example: Please give me an upstairs room
 *         amount:
 *           type: number
 *           example: 250000
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, refunded]
 *           default: pending
 *
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67312ef4d47ab3e5f02a9c51
 *         propertyid:
 *           type: string
 *           example: 6720f1a96b4d3e12b8c4f412
 *         agent:
 *           type: string
 *           description: ID of the agent automatically determined from the property
 *           example: 671ff8d56c3a4b21b9f72e99
 *         tenant:
 *           type: string
 *           description: ID of the tenant automatically set from the logged-in user
 *           example: 671fea7a8e2b5c63d4a90a23
 *         propertyType:
 *           type: string
 *           example: selfcontain
 *         moveInDate:
 *           type: string
 *           example: 2025-12-01
 *         moveOutDate:
 *           type: string
 *           example: 2026-06-01
 *         duration:
 *           type: string
 *           example: 6 months
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: female
 *         specialRequest:
 *           type: string
 *           example: I'd like a quiet room
 *         amount:
 *           type: number
 *           example: 250000
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           example: confirmed
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, refunded]
 *           example: paid
 *         createdAt:
 *           type: string
 *           example: 2025-11-10T12:30:00.000Z
 *         updatedAt:
 *           type: string
 *           example: 2025-11-10T12:30:00.000Z
 */
