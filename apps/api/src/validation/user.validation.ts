import { z } from 'zod';

// Base registration schema
const baseRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  type: z.enum(['student', 'agent', 'admin'], {
    message: 'Type must be student, agent, or admin',
  }),
});

// Student-specific registration schema
const studentRegisterSchema = baseRegisterSchema.extend({
  type: z.literal('student'),
  university: z.string().min(3, 'University name is required'),
  yearOfStudy: z.enum(['100', '200', '300', '400', '500'], {
    message: 'Year of study must be one of 100–500 level',
  }),
});

// Agent-specific registration schema
const agentRegisterSchema = baseRegisterSchema.extend({
  type: z.literal('agent'),
});

// Admin-specific registration schema
const adminRegisterSchema = baseRegisterSchema.extend({
  type: z.literal('admin'),
});

// Unified registration schema with conditional validation
export const createUserSchema = z
  .object({
    body: z.discriminatedUnion('type', [
      studentRegisterSchema,
      agentRegisterSchema,
      adminRegisterSchema,
    ]),
  })
  .refine(
    (data) => {
      if (data.body.type === 'student') {
        return 'university' in data.body && 'yearOfStudy' in data.body;
      }
      return true;
    },
    {
      message: 'University and year of study are required for students',
      path: ['body'],
    }
  );

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

// Verify email schema
export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

// Resend verification schema
export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
  }),
});

// Get user by ID schema
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

// Update user schema
export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
    university: z.string().optional(),
    yearOfStudy: z.enum(['100', '200', '300', '400', '500'] as const).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

// Delete user schema
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address').min(1, 'Email is required'),
  }),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  params: z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
  body: z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

// Resend reset token schema
export const resendResetTokenSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address').min(1, 'Email is required'),
  }),
});
