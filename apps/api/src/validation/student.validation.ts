import { z } from 'zod';

// 🎓 Create Student Schema
export const createStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    university: z.string().min(3, 'University name is required'),
    yearOfStudy: z.enum(['100', '200', '300', '400', '500'] as const, {
      error: () => ({ message: 'Year of study must be one of 100–500 level' }),
    }),
  }),
});

// 🔐 Login Schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

// 🔍 Get Student by ID Schema
export const getStudentByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format'),
  }),
});

// ✏️ Update Student Schema
export const updateStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
    university: z.string().optional(),
    yearOfStudy: z.enum(['100', '200', '300', '400', '500'] as const).optional(),
  }),
});

export const deleteStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format'),
  }),
});

// 🔄 Forgot Password Schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address').nonempty('Email is required'),
  }),
});

// 🔑 Reset Password Schema
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(10, 'Invalid token format').nonempty('Reset token is required'),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .nonempty('New password is required'),
  }),
});
