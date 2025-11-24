/**
 * @swagger
 * components:
 *   schemas:
 *     BookingInput:
 *       type: object
 *       required:
 *         - property
 *         - moveInDate
 *         - duration
 *         - amount
 *       properties:
 *         property:
 *           type: string
 *           description: ID of the property being booked
 *           example: 6720f1a96b4d3e12b8c4f412
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

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Booking created successfully
 *               data:
 *                 _id: 67312ef4d47ab3e5f02a9c51
 *                 property: 6720f1a96b4d3e12b8c4f412
 *                 agent: 671ff8d56c3a4b21b9f72e99
 *                 tenant: 671fea7a8e2b5c63d4a90a23
 *                 tenantName: John Doe
 *                 tenantEmail: johndoe@example.com
 *                 tenantPhone: +2348091234567
 *                 moveInDate: 2025-12-01
 *                 moveOutDate: 2026-06-01
 *                 duration: 6 months
 *                 amount: 250000
 *                 status: pending
 *                 paymentStatus: pending
 *                 notes: Tenant requested early move-in if possible
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking details by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 67312ef4d47ab3e5f02a9c51
 *                 property:
 *                   title: "Luxury Apartment"
 *                   location: "Ikeja, Lagos"
 *                   price: 250000
 *                 tenant:
 *                   fullName: "John Doe"
 *                   email: "johndoe@example.com"
 *                   phone: "+2348091234567"
 *                 agent:
 *                   fullName: "Jane Smith"
 *                   email: "janeagent@example.com"
 *                 status: "pending"
 *                 duration: "6 months"
 *                 amount: 250000
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/booking/agent/{agentId}:
 *   get:
 *     summary: Get all bookings for an agent
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         description: ID of the agent
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: 67312ef4d47ab3e5f02a9c51
 *                   property:
 *                     title: "Luxury Apartment"
 *                     location: "Ikeja, Lagos"
 *                     price: 250000
 *                   tenant:
 *                     fullName: "John Doe"
 *                     email: "johndoe@example.com"
 *                     phone: "+2348091234567"
 *                   status: "confirmed"
 *                   amount: 250000
 *                 - _id: 67312ef4d47ab3e5f02a9c52
 *                   property:
 *                     title: "Cozy Studio"
 *                     location: "Lekki, Lagos"
 *                     price: 180000
 *                   tenant:
 *                     fullName: "Mary Johnson"
 *                     email: "maryj@example.com"
 *                     phone: "+2348023456789"
 *                   status: "pending"
 *                   amount: 180000
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/booking/{id}/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Booking status updated
 *               data:
 *                 _id: 67312ef4d47ab3e5f02a9c51
 *                 status: confirmed
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized access
 */
