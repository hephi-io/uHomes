import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Response Schemas
export const studentResponseSchema = z
  .object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    university: z.string(),
    yearOfStudy: z.string(),
    isVerified: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi({
    type: 'object',
    description: 'Student object',
    example: {
      _id: '671f0ad2b65489c1a2345abc',
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+2348012345678',
      university: 'University of Lagos',
      yearOfStudy: '3',
      isVerified: true,
      createdAt: '2025-10-25T14:48:00.000Z',
      updatedAt: '2025-10-27T10:21:00.000Z',
    },
  });

export const studentListResponseSchema = z.array(studentResponseSchema).openapi({
  type: 'array',
  description: 'List of students',
});

export const registerStudentResponseSchema = z
  .object({
    message: z.string(),
    studentId: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Student registration response',
    example: {
      message: 'Verification email sent. Please check your inbox.',
      studentId: '671f0ad2b65489c1a2345abc',
    },
  });

export const loginStudentResponseSchema = z
  .object({
    token: z.string(),
    student: studentResponseSchema,
  })
  .openapi({
    type: 'object',
    description: 'Student login response',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      student: {
        _id: '671f0ad2b65489c1a2345abc',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+2348012345678',
        university: 'University of Lagos',
        yearOfStudy: '3',
        isVerified: true,
        createdAt: '2025-10-25T14:48:00.000Z',
        updatedAt: '2025-10-27T10:21:00.000Z',
      },
    },
  });

export const verifyEmailResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    type: 'object',
    description: 'Email verification response',
    example: {
      message: 'Email verified successfully',
    },
  });

export const forgotPasswordResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    type: 'object',
    description: 'Forgot password response',
    example: {
      message: 'Password reset link sent to your email.',
    },
  });

export const resetPasswordResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    email: z.string().optional(),
    time: z.string().datetime().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Reset password response',
    example: {
      success: true,
      message: 'Password reset successfully',
      email: 'student@example.com',
      time: '2025-11-11T14:30:00.000Z',
    },
  });

// Request Schemas (for OpenAPI documentation)
export const registerStudentRequestSchema = z
  .object({
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
  })
  .openapi({
    type: 'object',
    description: 'Student registration request',
  });

export const loginRequestSchema = z
  .object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .openapi({
    type: 'object',
    description: 'Login request',
  });

export const updateStudentRequestSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
    university: z.string().optional(),
    yearOfStudy: z.enum(['100', '200', '300', '400', '500'] as const).optional(),
  })
  .openapi({
    type: 'object',
    description: 'Update student request',
  });

export const forgotPasswordRequestSchema = z
  .object({
    email: z.string().email('Please provide a valid email address').nonempty('Email is required'),
  })
  .openapi({
    type: 'object',
    description: 'Forgot password request',
  });

export const resetPasswordRequestSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .openapi({
    type: 'object',
    description: 'Reset password request',
  });

export const verifyEmailParamsSchema = z.object({
  otp: z
    .string()
    .nonempty('OTP is required')
    .length(6, 'OTP must be 6 digits')
    .openapi({ param: { name: 'otp', in: 'path', required: true } }),
});

export const getStudentByIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const deleteStudentParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const resetPasswordParamsSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .openapi({ param: { name: 'otp', in: 'path', required: true } }),
});

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

export const verifyEmailSchema = z.object({
  params: z.object({
    otp: z.string().nonempty('OTP is required').length(6, 'OTP must be 6 digits'),
  }),
});

// Login Schema
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
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
  body: z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
