import { z } from 'zod';

// Create Payment
export const createPaymentSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be greater than 0' }),
  email: z.string().email({ message: 'Invalid email address' }),
  description: z.string().optional(),
  currency: z.string(),
  paymentMethod: z.string(),
});

// Update Payment Status
export const updatePaymentStatusSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
});
