import { z } from 'zod';

export const bookingSchema = z.object({
  propertyid: z.string().min(1, 'Property ID is required'),       // matches propertyid in model
  tenant: z.string().optional(),                                   // optional because agent may supply
  propertyType: z.string().min(1, 'Property type is required'),
  gender: z.enum(['male', 'female'], { message: 'Gender is required' }),
  specialRequest: z.string().optional(),
  moveInDate: z.string().min(1, 'Move-in date is required'),
  moveOutDate: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  amount: z.number().refine(val => val !== undefined, { message: 'Amount is required' }),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
});


export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
    params: z.object({
      id: z.string({ message: 'Booking ID is required' }),
    }),
  }),
});
