import express from 'express';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { AgentController } from '../cotrollers/agent.controller';

extendZodWithOpenApi(z);
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createAgentSchema,
  loginSchema,
  getAgentByIdSchema,
  updateAgentSchema,
  deleteAgentSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  agentResponseSchema,
  agentListResponseSchema,
  registerAgentResponseSchema,
  loginAgentResponseSchema,
  verifyEmailResponseSchema as agentVerifyEmailResponseSchema,
  forgotPasswordResponseSchema as agentForgotPasswordResponseSchema,
  resetPasswordResponseSchema as agentResetPasswordResponseSchema,
  registerAgentRequestSchema,
  loginAgentRequestSchema,
  updateAgentRequestSchema,
  forgotPasswordAgentRequestSchema,
  resetPasswordAgentRequestSchema,
  getAgentByIdParamsSchema,
  deleteAgentParamsSchema,
  resetPasswordAgentParamsSchema,
} from '../validation/agent.validation';
import { registry } from '../config/swagger';
import {
  badRequestResponseSchema,
  unauthorizedResponseSchema,
  notFoundResponseSchema,
  serverErrorResponseSchema,
} from '../validation/shared-responses';

const router = express.Router();
const controller = new AgentController();

registry.registerPath({
  method: 'post',
  path: '/api/agent/register',
  summary: 'Register a new agent',
  tags: ['Agents'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerAgentRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Agent registered successfully, verification email sent',
      content: {
        'application/json': {
          schema: registerAgentResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.post('/register', validate(createAgentSchema), controller.register.bind(controller));

registry.registerPath({
  method: 'get',
  path: '/api/agent/verify-email/{token}',
  summary: "Verify an agent's email using the token sent via email",
  tags: ['Agents'],
  request: {
    params: z.object({
      token: z.string().openapi({
        param: {
          name: 'token',
          in: 'path',
          required: true,
          description: 'Email verification token',
        },
        example: 'abc123def456',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Email verified successfully',
      content: {
        'application/json': {
          schema: agentVerifyEmailResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.get('/verify-email/:token', controller.verifyEmail.bind(controller));

registry.registerPath({
  method: 'post',
  path: '/api/agent/resend-verification',
  summary: 'Resend email verification code',
  tags: ['Agents'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              email: z.string().email(),
            })
            .openapi({ type: 'object' }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Verification email resent successfully',
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post('/resend-verification', controller.resendVerification.bind(controller));

registry.registerPath({
  method: 'post',
  path: '/api/agent/login',
  summary: 'Login an agent',
  tags: ['Agents'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginAgentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful, JWT token returned',
      content: {
        'application/json': {
          schema: loginAgentResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request / validation failed',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Incorrect email or password',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Agent not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post('/login', validate(loginSchema), controller.login.bind(controller));

registry.registerPath({
  method: 'get',
  path: '/api/agent',
  summary: 'Get all agents',
  tags: ['Agents'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of all agents',
      content: {
        'application/json': {
          schema: agentListResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.get('/', authenticate, controller.getAll.bind(controller));

registry.registerPath({
  method: 'get',
  path: '/api/agent/{id}',
  summary: 'Get an agent by ID',
  tags: ['Agents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getAgentByIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Agent retrieved successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.boolean(),
              user: agentResponseSchema,
            })
            .openapi({ type: 'object' }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.get('/:id', authenticate, validate(getAgentByIdSchema), controller.getById.bind(controller));

registry.registerPath({
  method: 'put',
  path: '/api/agent/{id}',
  summary: 'Update an agent by ID',
  tags: ['Agents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getAgentByIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateAgentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Agent updated successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.boolean(),
              user: agentResponseSchema,
            })
            .openapi({ type: 'object' }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedResponseSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.put(
  '/:id',
  authenticate,
  validate(updateAgentSchema),
  controller.updateAgent.bind(controller)
);

registry.registerPath({
  method: 'delete',
  path: '/api/agent/{id}',
  summary: 'Delete an agent by ID',
  tags: ['Agents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: deleteAgentParamsSchema,
  },
  responses: {
    200: {
      description: 'Agent deleted successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.boolean(),
              message: z.string(),
            })
            .openapi({ type: 'object' }),
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.delete(
  '/:id',
  authenticate,
  validate(deleteAgentSchema),
  controller.delete.bind(controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/agent/forgot-password',
  summary: 'Send password reset link to agent email',
  tags: ['Agents'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: forgotPasswordAgentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset link sent successfully',
      content: {
        'application/json': {
          schema: agentForgotPasswordResponseSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: serverErrorResponseSchema,
        },
      },
    },
  },
});

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  controller.forgotPassword.bind(controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/agent/reset-password/{otp}',
  summary: 'Reset password using OTP',
  tags: ['Agents'],
  request: {
    params: resetPasswordAgentParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: resetPasswordAgentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successfully',
      content: {
        'application/json': {
          schema: agentResetPasswordResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request or invalid OTP',
      content: {
        'application/json': {
          schema: badRequestResponseSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post(
  '/reset-password/:otp',
  validate(resetPasswordSchema),
  controller.resetPassword.bind(controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/agent/resend-reset-token',
  summary: 'Resend password reset token',
  tags: ['Agents'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              email: z.string().email(),
            })
            .openapi({ type: 'object' }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Reset token resent successfully',
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post(
  '/resend-reset-token',
  validate(resetPasswordSchema),
  controller.resendResetToken.bind(controller)
);

export default router;
