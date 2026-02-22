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

export interface NotificationPreferences {
  email?: {
    payment?: boolean;
    booking?: boolean;
    systemUpdates?: boolean;
    reviewAlert?: boolean;
  };
  inApp?: {
    payment?: boolean;
    booking?: boolean;
    systemUpdates?: boolean;
    reviewAlert?: boolean;
  };
  sms?: {
    payment?: boolean;
    booking?: boolean;
    systemUpdates?: boolean;
    reviewAlert?: boolean;
  };
}

export type TUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: TUserType;
  isVerified: boolean;
  savedProperties?: string[];
  profilePicture?: string;
  accountNumber?: string;
  accountName?: string;
  bank?: string;
  alternativeEmail?: string;
  notificationPreferences?: NotificationPreferences;
};

const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  verifyEmail: (token: string) => `/api/auth/verify-email/${token}`,
  verifyAccount: '/api/auth/verify-account',
  verifyUrl: '/api/auth/verify',
  resendVerification: '/api/auth/resend-verification',
  getCurrentUser: '/api/auth/me',
  getUserById: (id: string) => `/api/auth/${id}`,
  updateUser: (id: string) => `/api/auth/${id}`,
  deleteUser: (id: string) => `/api/auth/${id}`,
  forgotPassword: '/api/auth/forgot-password',
  verifyNin: '/api/user/verify-nin',
  resetPassword: (otp: string) => `/api/auth/reset-password/${otp}`,
  resendResetToken: '/api/auth/resend-reset-token',
  logout: '/api/auth/logout',
  getNINVerificationStatus: '/api/user/nin-verification-status',
  uploadProfilePicture: '/api/user/upload-profile-picture',
  updatePaymentSetup: '/api/user/payment-setup',
  getNotificationPreferences: '/api/user/notification-preferences',
  updateNotificationPreferences: '/api/user/notification-preferences',
  resetNotificationPreferences: '/api/user/notification-preferences/reset',
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

export const verifyAccount = (email: string, code: string) => {
  return API.post<TResponse<{ token: string; user: TUser; message: string }>>(
    endpoints.verifyAccount,
    { email, code }
  );
};

export const verifyAccountViaUrl = (token: string) => {
  return API.get<TResponse<{ token: string; user: TUser; message: string }>>(endpoints.verifyUrl, {
    params: { token },
  });
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

export const verifyNin = (nin: string, document: File) => {
  const formData = new FormData();

  formData.append('nin', nin);
  formData.append('document', document);

  return API.post(endpoints.verifyNin, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export const logout = () => {
  return API.post<TResponse<{ message: string }>>(endpoints.logout);
};

export type TNINVerificationStatus = {
  verificationStatus: 'pending' | 'verified' | 'rejected';
  hasDocument: boolean;
};

export const getNINVerificationStatus = () => {
  return API.get<TResponse<TNINVerificationStatus>>(endpoints.getNINVerificationStatus);
};

export const uploadProfilePicture = (file: File) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return API.post<TResponse<{ profilePicture: string }>>(endpoints.uploadProfilePicture, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export interface PaymentSetupData {
  accountNumber?: string;
  accountName?: string;
  bank?: string;
  alternativeEmail?: string;
}

export const updatePaymentSetup = (payload: PaymentSetupData) => {
  return API.put<TResponse<TUser>>(endpoints.updatePaymentSetup, payload);
};

export interface NotificationPreferencesResponse {
  notificationPreferences: NotificationPreferences;
}

export const getNotificationPreferences = () => {
  return API.get<TResponse<NotificationPreferencesResponse>>(endpoints.getNotificationPreferences);
};

export const updateNotificationPreferences = (preferences: NotificationPreferences) => {
  return API.put<TResponse<TUser>>(endpoints.updateNotificationPreferences, {
    preferences,
  });
};

export const resetNotificationPreferences = () => {
  return API.post<TResponse<TUser>>(endpoints.resetNotificationPreferences);
};
