import axios from 'axios';
import { token } from '@/utils';

interface ILogin {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export type TResponse<T> = {
  status: string;
  data: T;
};

type TUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isverified: boolean;
};

const endpoints = {
  login: '/api/agent/login',
  signup: '/api/agent/register',
  getAllAgent: '/api/agent',
  getAgentById: (id: string) => `/api/agent/${id}`,
  updateAgnet: (id: string) => `/api/agent/${id}`,
  deleteAgent: (id: string) => `/api/agent/${id}`,
  forgotPassword: '/api/agent/forgot-password',
  resendVerification: '/api/agent/resend-verification',
  resetPassword: (token: string) => `/api/agent/reset-password/${token}`,
};

export const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

API.interceptors.request.use((config) => {
  if (token.getToken()) {
    config.headers.Authorization = `Bearer ${token.getToken()}`;
  }
  return config;
});

export const agentSignup = (payload: ILogin) => {
  return API.post<TResponse<TUser>>(endpoints.signup, payload);
};

export const agentLogin = (payload: { email: string; password: string }) => {
  return API.post<TResponse<TUser & { token: string }>>(endpoints.login, payload);
};

export const getAgent = (id: string) => {
  return API.get<TResponse<TUser>>(endpoints.getAgentById(id));
};

export const getAllAgent = () => {
  return API.get<TResponse<TUser>>(endpoints.getAllAgent);
};

export const forgotPassword = (email: string) => {
  return API.post<TResponse<TUser>>(endpoints.forgotPassword, { email });
};

export const resendVerification = (email: string) => {
  return API.post(endpoints.resendVerification, email);
};
export const resentPassword = (payload: { token: string; newPassword: string }) => {
  return API.post(endpoints.resetPassword(payload.token), payload.newPassword);
};
