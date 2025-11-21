/**
 * @openapi
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123456
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           enum: [Agent, Student, Admin]
 *           example: Agent
 *         isVerified:
 *           type: boolean
 *           example: true
 *         properties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PropertySummary'
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123457
 *         fullName:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           example: jane@example.com
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345679"
 *         role:
 *           type: string
 *           enum: [Student]
 *           example: Student
 *         isVerified:
 *           type: boolean
 *           example: true
 *     PropertySummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123458
 *         title:
 *           type: string
 *           example: Luxury Apartment
 *         price:
 *           type: number
 *           example: 1500
 *         location:
 *           type: string
 *           example: Lagos
 *         isAvailable:
 *           type: boolean
 *           example: true
 *     Property:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123459
 *         title:
 *           type: string
 *           example: Ocean View Condo
 *         description:
 *           type: string
 *           example: Stunning condo with ocean view
 *         price:
 *           type: number
 *           example: 2000
 *         location:
 *           type: string
 *           example: Lagos
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Pool", "Gym", "WiFi"]
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/image1.jpg"
 *               cloudinary_id:
 *                 type: string
 *                 example: "cloudinary123"
 *         agentId:
 *           $ref: '#/components/schemas/Agent'
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 652df89ac5aefb6d92123460
 *         property:
 *           $ref: '#/components/schemas/PropertySummary'
 *         agent:
 *           $ref: '#/components/schemas/Agent'
 *         tenant:
 *           $ref: '#/components/schemas/Student'
 *         tenantName:
 *           type: string
 *           example: Jane Doe
 *         tenantEmail:
 *           type: string
 *           example: jane@example.com
 *         tenantPhone:
 *           type: string
 *           example: "+2348012345679"
 *         moveInDate:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         moveOutDate:
 *           type: string
 *           format: date
 *           example: "2026-12-01"
 *         duration:
 *           type: number
 *           example: 12
 *         amount:
 *           type: number
 *           example: 18000
 *         status:
 *           type: string
 *           enum: [Pending, Approved, Rejected, Cancelled]
 *           example: Pending
 *         paymentStatus:
 *           type: string
 *           enum: [paid, unpaid]
 *           example: unpaid
 *     UpdateBooking:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [Pending, Approved, Rejected, Cancelled]
 *           example: Approved
 */
