import axios from 'axios';

import { token } from '@/utils';

interface IRegister {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  type: 'student' | 'agent' | 'admin';
  university?: string;
  yearOfStudy?: '100' | '200' | '300' | '400' | '500';
}

export type TResponse<T> = {
  status: string;
  data: T;
};

type TUserType = {
  type: 'student' | 'agent' | 'admin';
};

type TUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: TUserType;
  isVerified: boolean;
};

const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  verifyEmail: (token: string) => `/api/auth/verify-email/${token}`,
  resendVerification: '/api/auth/resend-verification',
  getCurrentUser: '/api/auth/me',
  getUserById: (id: string) => `/api/auth/${id}`,
  updateUser: (id: string) => `/api/auth/${id}`,
  deleteUser: (id: string) => `/api/auth/${id}`,
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: (otp: string) => `/api/auth/reset-password/${otp}`,
  resendResetToken: '/api/auth/resend-reset-token',
};

export const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

API.interceptors.request.use((config) => {
  if (token.getToken()) {
    config.headers.Authorization = `Bearer ${token.getToken()}`;
  }
  return config;
});

// Unified auth functions
export const register = (payload: IRegister) => {
  return API.post<TResponse<{ message: string }>>(endpoints.register, payload);
};

export const login = (payload: { email: string; password: string }) => {
  return API.post<TResponse<{ token: string; user: TUser }>>(endpoints.login, payload);
};

export const verifyEmail = (token: string) => {
  return API.get<TResponse<{ message: string }>>(endpoints.verifyEmail(token));
};

export const resendVerification = (email: string) => {
  return API.post<TResponse<{ message: string }>>(endpoints.resendVerification, { email });
};

export const getCurrentUser = () => {
  return API.get<TResponse<TUser>>(endpoints.getCurrentUser);
};

export const getUserById = (id: string) => {
  return API.get<TResponse<TUser>>(endpoints.getUserById(id));
};

export const updateUser = (id: string, payload: Partial<TUser>) => {
  return API.put<TResponse<TUser>>(endpoints.updateUser(id), payload);
};

export const deleteUser = (id: string) => {
  return API.delete<TResponse<{ message: string }>>(endpoints.deleteUser(id));
};

export const forgotPassword = (email: string) => {
  return API.post<TResponse<{ message: string }>>(endpoints.forgotPassword, { email });
};

export const resetPassword = (otp: string, newPassword: string, confirmPassword: string) => {
  return API.post<TResponse<{ success: boolean; message: string }>>(endpoints.resetPassword(otp), {
    newPassword,
    confirmPassword,
  });
};

export const resendResetToken = (email: string) => {
  return API.post<TResponse<{ message: string }>>(endpoints.resendResetToken, { email });
};

// Legacy functions (for backward compatibility during migration)
export const agentSignup = register;
export const agentLogin = login;
export const getAgent = getUserById;
export const resentPassword = (payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return resetPassword(payload.token, payload.newPassword, payload.confirmPassword);
};
