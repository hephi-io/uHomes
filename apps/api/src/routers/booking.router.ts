import express from 'express';
import { BookingController } from '../cotrollers/booking.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
  bookingSchema,
  updateBookingStatusSchema,
  bookingResponseSchema,
  bookingListResponseSchema,
  createBookingResponseSchema,
  updateBookingStatusRequestSchema,
  updateBookingStatusParamsSchema,
} from '../validation/booking.validation';
import { registry } from '../config/swagger';
import {
  badRequestResponseSchema,
  unauthorizedResponseSchema,
  notFoundResponseSchema,
} from '../validation/shared-responses';
import { z } from 'zod';

const router = express.Router();
const bookingController = new BookingController();

registry.registerPath({
  method: 'post',
  path: '/api/booking',
  summary: 'Create a new booking',
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: bookingSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Booking created successfully',
      content: {
        'application/json': {
          schema: createBookingResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request (missing or invalid fields)',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
  },
});

router.post('/', authenticate, validate(bookingSchema), bookingController.createBooking);

registry.registerPath({
  method: 'get',
  path: '/api/booking/{id}',
  summary: 'Get booking by ID',
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
    }),
  },
  responses: {
    200: {
      description: 'Booking retrieved successfully',
      content: {
        'application/json': {
          schema: bookingResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid booking ID',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    404: {
      description: 'Booking not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
  },
});

router.get('/:id', authenticate, bookingController.getBooking);

registry.registerPath({
  method: 'get',
  path: '/api/booking/agent/{agentId}',
  summary: 'Get all bookings for an agent',
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      agentId: z.string().openapi({ param: { name: 'agentId', in: 'path' } }),
    }),
  },
  responses: {
    200: {
      description: 'List of agent bookings',
      content: {
        'application/json': {
          schema: bookingListResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid agent ID',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
  },
});

router.get('/agent/:agentId', authenticate, bookingController.getAgentBookings);

registry.registerPath({
  method: 'get',
  path: '/api/bookings',
  summary: 'Get all bookings',
  description: `Retrieve all bookings based on the user's role. Admin: Can view all bookings. Agent: Can view only their assigned bookings. Student: Can view only their own bookings.`,
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Bookings retrieved successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.boolean(),
              message: z.string(),
              data: bookingListResponseSchema,
            })
            .openapi({ type: 'object' }),
        },
      },
    },
    401: {
      description: 'Unauthorized - Missing or invalid token',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
  },
});

router.get('/', authenticate, bookingController.getAllBookings);

registry.registerPath({
  method: 'patch',
  path: '/api/booking/{id}/status',
  summary: 'Update booking status',
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  request: {
    params: updateBookingStatusParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateBookingStatusRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Booking status updated successfully',
      content: {
        'application/json': {
          schema: bookingResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid booking ID or status',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Booking not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.patch(
  '/:id/status',
  authenticate,
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

registry.registerPath({
  method: 'delete',
  path: '/api/booking/{id}',
  summary: 'Delete a booking',
  description:
    'Delete a specific booking by ID. Admin: Can delete any booking. Agent: Can delete only their assigned bookings. Student: Can delete only their own bookings.',
  tags: ['Bookings'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
    }),
  },
  responses: {
    200: {
      description: 'Booking deleted successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.boolean(),
              message: z.string(),
              data: bookingResponseSchema.optional(),
            })
            .openapi({ type: 'object' }),
        },
      },
    },
    400: {
      description: 'Invalid booking ID',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - You do not have permission to delete this booking',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Booking not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.delete('/:id', authenticate, bookingController.deleteBooking);

export default router;
