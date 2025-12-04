import { z } from 'zod';

// Booking status enums
export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  completed = 'completed',
}

// Booking schema
export const bookingSchema = z.object({
  propertyid: z.string().min(1, 'Property ID is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  moveInDate: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), { message: 'Move-in date is required' }),
  moveOutDate: z
    .string()
    .optional()
    .transform((str) => (str && str.trim() !== '' ? new Date(str) : undefined)),
  duration: z.string().min(1, 'Duration is required'),
  gender: z.enum(['male', 'female']),
  specialRequest: z.string().optional(),
  amount: z.preprocess(
    (val) => {
      if (typeof val === 'string' || typeof val === 'number') {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    },
    z.number({ message: 'Amount must be a number' })
  ),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});
