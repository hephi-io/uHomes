import { API, type TResponse } from './auth';

export interface PaymentInput {
  amount: number;
  email: string;
  description?: string;
  currency: string;
  paymentMethod: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  _id: string;
  userId: string;
  user_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  description?: string;
  metadata?: Record<string, any>;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  payment: Payment;
  authorization_url: string;
}

const endpoints = {
  createPayment: '/api/payment',
  verifyPayment: (id: string) => `/api/payment/${id}/verify`,
};

export const createPayment = (data: PaymentInput) => {
  return API.post<TResponse<CreatePaymentResponse>>(endpoints.createPayment, data);
};

export const verifyPayment = (paymentId: string) => {
  return API.post<TResponse<Payment>>(endpoints.verifyPayment(paymentId));
};
