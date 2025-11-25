import express from 'express';
import { BookingController } from '../cotrollers/booking.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { bookingSchema, updateBookingStatusSchema } from '../validation/booking.validation';

const router = express.Router();
const bookingController = new BookingController();

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
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
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request (missing or invalid fields)
 */
router.post('/', authenticate, validate(bookingSchema), bookingController.createBooking);

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid booking ID
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/:id', authenticate, bookingController.getBooking);

/**
 * @swagger
 * /api/booking/agent/{agentId}:
 *   get:
 *     summary: Get all bookings for an agent
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: agentId
 *         in: path
 *         required: true
 *         description: Agent ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of agent bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid agent ID
 *       401:
 *         description: Unauthorized access
 */
router.get('/agent/:agentId', authenticate, bookingController.getAgentBookings);

/**
 * @swagger
 * /api/booking/student/active-summary:
 *   get:
 *     summary: Get active bookings summary for student
 *     description: Returns count and total amount of active bookings (status='confirmed' AND paymentStatus='paid')
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active bookings summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                       example: 4
 *                     totalAmount:
 *                       type: number
 *                       example: 500000
 *       401:
 *         description: Unauthorized access
 */
router.get('/student/active-summary', authenticate, bookingController.getActiveBookingsSummary);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description:
 *       Retrieve all bookings based on the user's role.
 *       - **Admin:** Can view all bookings.
 *       - **Agent:** Can view only their assigned bookings.
 *       - **Student:** Can view only their own bookings.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Bookings retrieved successfully
 *               data:
 *                 - _id: 67312ef4d47ab3e5f02a9c51
 *                   property:
 *                     _id: 6720f1a96b4d3e12b8c4f412
 *                     title: Cozy Apartment
 *                     location: Lekki Phase 1, Lagos
 *                     price: 250000
 *                   tenant:
 *                     _id: 671fea7a8e2b5c63d4a90a23
 *                     fullName: John Doe
 *                     email: johndoe@example.com
 *                     phoneNumber: +2348091234567
 *                   agent:
 *                     _id: 671ff8d56c3a4b21b9f72e99
 *                     fullName: Agent Mike
 *                     email: agentmike@example.com
 *                     phoneNumber: +2348097654321
 *                   moveInDate: 2025-12-01
 *                   moveOutDate: 2026-06-01
 *                   duration: 6 months
 *                   amount: 250000
 *                   status: confirmed
 *                   paymentStatus: paid
 *                   notes: Tenant requested early move-in if possible
 *                   createdAt: 2025-11-06T10:30:00.000Z
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/', authenticate, bookingController.getAllBookings);

/**
 * @swagger
 * /api/booking/{id}/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid booking ID or status
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Booking not found
 */
router.patch(
  '/:id/status',
  authenticate,
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description:
 *       Delete a specific booking by ID.
 *       - **Admin:** Can delete any booking.
 *       - **Agent:** Can delete only their assigned bookings.
 *       - **Student:** Can delete only their own bookings.
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
 *           example: 67312ef4d47ab3e5f02a9c51
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Booking deleted successfully
 *               data:
 *                 _id: 67312ef4d47ab3e5f02a9c51
 *                 property:
 *                   _id: 6720f1a96b4d3e12b8c4f412
 *                   title: Cozy Apartment
 *                   location: Lekki Phase 1, Lagos
 *                   price: 250000
 *                 tenant:
 *                   _id: 671fea7a8e2b5c63d4a90a23
 *                   fullName: John Doe
 *                   email: johndoe@example.com
 *                 agent:
 *                   _id: 671ff8d56c3a4b21b9f72e99
 *                   fullName: Agent Mike
 *                   email: agentmike@example.com
 *                 moveInDate: 2025-12-01
 *                 duration: 6 months
 *                 amount: 250000
 *                 status: confirmed
 *                 paymentStatus: paid
 *                 notes: Tenant requested early move-in if possible
 *       400:
 *         description: Invalid booking ID
 *       401:
 *         description: Unauthorized - You do not have permission to delete this booking
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', authenticate, bookingController.deleteBooking);

export default router;
