import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  role: z.enum(['Agent', 'Student', 'Admin']).optional(),
  isVerified: z.boolean().optional(),
});

export const updatePropertySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        cloudinary_id: z.string(),
      })
    )
    .optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  isAvailable: z.boolean().optional(),
  agentId: z.array(z.string().min(24).max(24)).optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']),
});
