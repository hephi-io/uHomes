/**
 * @swagger
 * components:
 *   schemas:
 *     BookingInput:
 *       type: object
 *       required:
 *         - property
 *         - tenantName
 *         - tenantEmail
 *         - tenantPhone
 *         - moveInDate
 *         - duration
 *         - amount
 *       properties:
 *         property:
 *           type: string
 *           description: ID of the property being booked
 *           example: 6720f1a96b4d3e12b8c4f412
 *         tenantName:
 *           type: string
 *           description: Full name of the tenant
 *           example: John Doe
 *         tenantEmail:
 *           type: string
 *           description: Email of the tenant
 *           example: johndoe@example.com
 *         tenantPhone:
 *           type: string
 *           description: Phone number of the tenant
 *           example: +2348091234567
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
 *         notes:
 *           type: string
 *           example: Tenant requested early move-in if possible
 */