import { z } from 'zod';

// Query filters for listing transactions
export const TransactionListQuerySchema = z.object({
  status: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  minAmount: z.preprocess(Number, z.number().optional()),
  maxAmount: z.preprocess(Number, z.number().optional()),
  search: z.string().optional(),
  limit: z.preprocess(Number, z.number().optional()),
  page: z.preprocess(Number, z.number().optional()),
});

// Path params for fetching a single transaction
export const TransactionIdParamSchema = z.object({
  id: z.string(),
});
