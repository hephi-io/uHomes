import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Response Schemas
export const agentResponseSchema = z
  .object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi({
    type: 'object',
    description: 'Agent object',
    example: {
      _id: '652df89ac5aefb6d92123456',
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+2348012345678',
      role: 'agent',
      isVerified: true,
      createdAt: '2025-10-17T18:16:31.818Z',
      updatedAt: '2025-10-17T18:17:45.390Z',
    },
  });

export const agentListResponseSchema = z.array(agentResponseSchema).openapi({
  type: 'array',
  description: 'List of agents',
});

export const registerAgentResponseSchema = z
  .object({
    message: z.string(),
    agentId: z.string().optional(),
  })
  .openapi({
    type: 'object',
    description: 'Agent registration response',
    example: {
      message: 'Verification email sent. Please check your inbox.',
      agentId: '652df89ac5aefb6d92123456',
    },
  });

export const loginAgentResponseSchema = z
  .object({
    token: z.string(),
    agent: agentResponseSchema,
  })
  .openapi({
    type: 'object',
    description: 'Agent login response',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      agent: {
        _id: '652df89ac5aefb6d92123456',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+2348012345678',
        role: 'agent',
        isVerified: true,
        createdAt: '2025-10-17T18:16:31.818Z',
        updatedAt: '2025-10-17T18:17:45.390Z',
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
    status: z.string(),
    data: z.object({
      message: z.string(),
    }),
  })
  .openapi({
    type: 'object',
    description: 'Forgot password response',
    example: {
      status: 'success',
      data: {
        message: 'Password reset link sent to your email.',
      },
    },
  });

export const resetPasswordResponseSchema = z
  .object({
    status: z.string(),
    data: z.object({
      message: z.string(),
    }),
  })
  .openapi({
    type: 'object',
    description: 'Reset password response',
    example: {
      status: 'success',
      data: {
        message: 'Password has been reset successfully.',
      },
    },
  });

// Request Schemas (for OpenAPI documentation)
export const registerAgentRequestSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10).max(15),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .openapi({
    type: 'object',
    description: 'Agent registration request',
  });

export const loginAgentRequestSchema = z
  .object({
    email: z.string().email('Email is required'),
    password: z.string().min(6, 'Password is required'),
  })
  .openapi({
    type: 'object',
    description: 'Agent login request',
  });

export const updateAgentRequestSchema = z
  .object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
  })
  .openapi({
    type: 'object',
    description: 'Update agent request',
  });

export const forgotPasswordAgentRequestSchema = z
  .object({
    email: z.string().nonempty('Email is required').email('Please provide a valid email address'),
  })
  .openapi({
    type: 'object',
    description: 'Forgot password request',
  });

export const resetPasswordAgentRequestSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .openapi({
    type: 'object',
    description: 'Reset password request',
  });

export const getAgentByIdParamsSchema = z.object({
  id: z
    .string()
    .min(1, 'User ID is required')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const deleteAgentParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .openapi({ param: { name: 'id', in: 'path', required: true } }),
});

export const resetPasswordAgentParamsSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .openapi({ param: { name: 'otp', in: 'path', required: true } }),
});

export const verifyEmailAgentParamsSchema = z.object({
  token: z.string().openapi({ param: { name: 'token', in: 'path', required: true } }),
});

export const createAgentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().min(10).max(15),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(6, 'Password is required'),
  }),
});

export const getAgentByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const updateAgentSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6).optional(),
  }),
});

export const deleteAgentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

// Forgot Password Schema (older syntax)
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Email is required').email('Please provide a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
  body: z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
