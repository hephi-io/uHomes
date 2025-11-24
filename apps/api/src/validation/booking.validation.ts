import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Response Schemas
export const bookingResponseSchema = z
  .object({
    _id: z.string(),
    property: z.union([
      z.string(),
      z
        .object({
          _id: z.string(),
          title: z.string(),
          location: z.string(),
          price: z.number(),
        })
        .openapi({ type: 'object' }),
    ]),
    agent: z.union([
      z.string(),
      z
        .object({
          _id: z.string(),
          fullName: z.string(),
          email: z.string(),
          phoneNumber: z.string().optional(),
        })
        .openapi({ type: 'object' }),
    ]),
    tenant: z.union([
      z.string(),
      z
        .object({
          _id: z.string(),
          fullName: z.string(),
          email: z.string(),
          phoneNumber: z.string(),
        })
        .openapi({ type: 'object' }),
    ]),
    tenantName: z.string(),
    tenantEmail: z.string().email(),
    tenantPhone: z.string(),
    moveInDate: z.string(),
    moveOutDate: z.string().optional(),
    duration: z.string(),
    amount: z.number(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
    paymentStatus: z.enum(['pending', 'paid', 'refunded']),
    notes: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Booking object',
    example: {
      _id: '67312ef4d47ab3e5f02a9c51',
      property: {
        _id: '6720f1a96b4d3e12b8c4f412',
        title: 'Cozy Apartment',
        location: 'Lekki Phase 1, Lagos',
        price: 250000,
      },
      tenant: {
        _id: '671fea7a8e2b5c63d4a90a23',
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        phoneNumber: '+2348091234567',
      },
      agent: {
        _id: '671ff8d56c3a4b21b9f72e99',
        fullName: 'Agent Mike',
        email: 'agentmike@example.com',
        phoneNumber: '+2348097654321',
      },
      tenantName: 'John Doe',
      tenantEmail: 'johndoe@example.com',
      tenantPhone: '+2348091234567',
      moveInDate: '2025-12-01',
      moveOutDate: '2026-06-01',
      duration: '6 months',
      amount: 250000,
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Tenant requested early move-in if possible',
      createdAt: '2025-11-06T10:30:00.000Z',
    },
  });

export const bookingListResponseSchema = z.array(bookingResponseSchema).openapi({
  type: 'array',
  description: 'List of bookings',
});

export const createBookingResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: bookingResponseSchema,
  })
  .openapi({
    type: 'object',
    description: 'Create booking response',
    example: {
      success: true,
      message: 'Booking created successfully',
      data: {
        _id: '67312ef4d47ab3e5f02a9c51',
        property: '6720f1a96b4d3e12b8c4f412',
        agent: '671ff8d56c3a4b21b9f72e99',
        tenant: '671fea7a8e2b5c63d4a90a23',
        tenantName: 'John Doe',
        tenantEmail: 'johndoe@example.com',
        tenantPhone: '+2348091234567',
        moveInDate: '2025-12-01',
        moveOutDate: '2026-06-01',
        duration: '6 months',
        amount: 250000,
        status: 'pending',
        paymentStatus: 'pending',
        notes: 'Tenant requested early move-in if possible',
      },
    },
  });

export const bookingSchema = z
  .object({
    property: z.string().min(1, 'Property is required'),
    tenantName: z.string().min(1, 'Tenant name is required'),
    tenantEmail: z.string().email('Invalid email address'),
    tenantPhone: z.string().min(1, 'Tenant phone is required'),
    moveInDate: z.string().min(1, 'Move-in date is required'),
    duration: z.string().min(1, 'Duration is required'),
    amount: z.number({ message: 'Amount must be a number' }),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
    paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
    notes: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Booking creation request',
  });

// Request Schemas (for OpenAPI documentation)
export const updateBookingStatusRequestSchema = z
  .object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  })
  .openapi({
    type: 'object',
    description: 'Update booking status request',
  });

export const updateBookingStatusParamsSchema = z.object({
  id: z
    .string({ message: 'Booking ID is required' })
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Booking ID is required' }),
  }),
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  }),
});
