import { z } from 'zod';

// Signup validation
export const signupSchema = z.object({
    body: z.object({
        fullName: z.string().min(2, 'Full name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phoneNumber: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        types: z.enum(['Student', 'Agent', 'Admin'], 'types must be Student, Agent, or Admin'),
        university: z.string().optional(),
        yearOfStudy: z.preprocess((val) => Number(val), z.number()).optional(),
    }),
});

export type SignupPayload = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export type LoginPayload = z.infer<typeof loginSchema>;
