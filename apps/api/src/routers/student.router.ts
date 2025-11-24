import Express from 'express';
import { z } from 'zod';
import { StudentController } from '../cotrollers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createStudentSchema,
  loginSchema,
  getStudentByIdSchema,
  updateStudentSchema,
  deleteStudentSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  studentResponseSchema,
  studentListResponseSchema,
  registerStudentResponseSchema,
  loginStudentResponseSchema,
  verifyEmailResponseSchema,
  forgotPasswordResponseSchema,
  resetPasswordResponseSchema,
  registerStudentRequestSchema,
  loginRequestSchema,
  updateStudentRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  verifyEmailParamsSchema,
  getStudentByIdParamsSchema,
  deleteStudentParamsSchema,
  resetPasswordParamsSchema,
} from '../validation/student.validation';
import { registry } from '../config/swagger';
import {
  badRequestResponseSchema,
  unauthorizedResponseSchema,
  notFoundResponseSchema,
  serverErrorResponseSchema,
} from '../validation/shared-responses';

const router = Express.Router();
const Controller = new StudentController();

// Register routes with OpenAPI
registry.registerPath({
  method: 'post',
  path: '/api/students/register',
  summary: 'Register a new student',
  tags: ['Students'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerStudentRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Student registered successfully. Verification email sent.',
      content: {
        'application/json': {
          schema: registerStudentResponseSchema,
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
  },
});

router.post('/register', validate(createStudentSchema), Controller.register.bind(Controller));

registry.registerPath({
  method: 'get',
  path: '/api/student/verify-email/{otp}',
  summary: 'Verify a student email using the OTP sent via email',
  tags: ['Students'],
  request: {
    params: verifyEmailParamsSchema,
  },
  responses: {
    200: {
      description: 'Email verified successfully',
      content: {
        'application/json': {
          schema: verifyEmailResponseSchema,
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

router.get('/verify-email/:otp', Controller.verifyEmail.bind(Controller));

registry.registerPath({
  method: 'post',
  path: '/api/students/resend-verification',
  summary: 'Resend email verification link',
  tags: ['Students'],
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

router.post('/resend-verification', Controller.resendVerification.bind(Controller));

registry.registerPath({
  method: 'post',
  path: '/api/student/login',
  summary: 'Login a student',
  tags: ['Students'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful, JWT token returned',
      content: {
        'application/json': {
          schema: loginStudentResponseSchema,
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
      description: 'Student not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post('/login', validate(loginSchema), Controller.login.bind(Controller));

registry.registerPath({
  method: 'get',
  path: '/api/students',
  summary: 'Get all students',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of all students',
      content: {
        'application/json': {
          schema: studentListResponseSchema,
        },
      },
    },
  },
});

router.get('/', authenticate, Controller.getAll.bind(Controller));

registry.registerPath({
  method: 'get',
  path: '/api/students/{id}',
  summary: 'Get a single student by ID',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getStudentByIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Student details retrieved successfully',
      content: {
        'application/json': {
          schema: studentResponseSchema,
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

router.get(
  '/:id',
  authenticate,
  validate(getStudentByIdSchema),
  Controller.getById.bind(Controller)
);

registry.registerPath({
  method: 'put',
  path: '/api/students/{id}',
  summary: 'Update student details',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getStudentByIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateStudentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated student',
      content: {
        'application/json': {
          schema: studentResponseSchema,
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

router.put(
  '/:id',
  authenticate,
  validate(updateStudentSchema),
  Controller.updateStudent.bind(Controller)
);

registry.registerPath({
  method: 'delete',
  path: '/api/students/{id}',
  summary: 'Delete a student by ID',
  tags: ['Students'],
  security: [{ bearerAuth: [] }],
  request: {
    params: deleteStudentParamsSchema,
  },
  responses: {
    200: {
      description: 'Student deleted successfully',
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

router.delete(
  '/:id',
  authenticate,
  validate(deleteStudentSchema),
  Controller.delete.bind(Controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/student/forgot-password',
  summary: 'Request password reset',
  tags: ['Students'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: forgotPasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset link sent successfully',
      content: {
        'application/json': {
          schema: forgotPasswordResponseSchema,
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
    404: {
      description: 'Student not found',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
    },
  },
});

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  Controller.forgotPassword.bind(Controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/student/reset-password/{otp}',
  summary: 'Reset password using OTP',
  tags: ['Students'],
  request: {
    params: resetPasswordParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: resetPasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successfully',
      content: {
        'application/json': {
          schema: resetPasswordResponseSchema,
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
  Controller.resetPassword.bind(Controller)
);

registry.registerPath({
  method: 'post',
  path: '/api/students/resend-reset-token',
  summary: 'Resend password reset token',
  tags: ['Students'],
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

router.post('/resend-reset-token', Controller.resendResetToken.bind(Controller));

export default router;
