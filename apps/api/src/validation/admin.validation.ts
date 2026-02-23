import { z } from 'zod';

// Query filters for admin transactions
export const AdminTransactionListQuerySchema = z.object({
  status: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  minAmount: z.preprocess(Number, z.number().optional()),
  maxAmount: z.preprocess(Number, z.number().optional()),
  search: z.string().optional(),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Query filters for admin payments
export const AdminPaymentListQuerySchema = z.object({
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.preprocess(Number, z.number().optional()),
  maxAmount: z.preprocess(Number, z.number().optional()),
  search: z.string().optional(),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Query filters for admin properties
export const AdminPropertyListQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.preprocess(Number, z.number().optional()),
  maxPrice: z.preprocess(Number, z.number().optional()),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Query filters for agent applications
export const AgentApplicationListQuerySchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']).optional(),
  search: z.string().optional(),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Query filters for admin users
export const AdminUserListQuerySchema = z.object({
  search: z.string().optional(),
  type: z.enum(['student', 'agent', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Path params for transaction/payment/property IDs
export const AdminIdParamSchema = z.object({
  id: z.string(),
});

// Path params for verify agent
export const VerifyAgentParamSchema = z.object({
  userId: z.string(),
});

// Body schema for verify agent
export const VerifyAgentBodySchema = z.object({
  status: z.enum(['verified', 'rejected']),
});

// Body schema for update property status
export const UpdatePropertyStatusBodySchema = z.object({
  status: z.enum(['approved', 'rejected']),
});
