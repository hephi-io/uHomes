import { z } from 'zod'

export const bookingSchema = z.object({
  property: z.string().min(1, 'Property is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantEmail: z.string().email('Invalid email address'),
  tenantPhone: z.string().min(1, 'Tenant phone is required'),
  moveInDate: z.string().min(1, 'Move-in date is required'),
  duration: z.string().min(1, 'Duration is required'),
  amount: z.number({ message: 'Amount must be a number' }),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  notes: z.string().optional()
})

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  params: z.object({
    id: z.string({ message: 'Booking ID is required' }),
  }),
})
})
