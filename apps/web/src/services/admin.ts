import { API, type TResponse } from './auth';

// TypeScript Interfaces
export interface DashboardStats {
  totalRevenue: number;
  totalAgents: number;
  totalClients: number;
  activeListings: number;
}

export interface PaymentStats {
  totalRevenue: number;
  platformFees: number;
  inEscrow: number;
  releasedPayments: number;
  declined: number;
}

export interface AdminTransaction {
  _id: string;
  paymentId: string | { _id: string };
  userId: string | { _id: string; fullName: string; email: string; phoneNumber: string };
  reference: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface AdminPayment {
  _id: string;
  userId: string | { _id: string; fullName: string; email: string; phoneNumber: string };
  bookingId?: string | { _id: string };
  user_email?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  description?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: boolean;
  documentName: string | null;
  status: 'pending' | 'verified' | 'rejected';
  date: Date | string;
}

export interface AdminProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  roomType: 'single' | 'shared' | 'self_contain';
  images: Array<{ url: string; cloudinary_id: string }>;
  amenities: {
    wifi: boolean;
    kitchen: boolean;
    security: boolean;
    parking: boolean;
    power24_7: boolean;
    gym: boolean;
  };
  agentId: string | { _id: string; fullName: string; email: string; phoneNumber: string };
  isAvailable: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  userType?: 'student' | 'agent' | 'admin' | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TransactionFilters extends PaginationParams {
  status?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaymentFilters extends PaginationParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PropertyFilters extends PaginationParams {
  status?: string;
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AgentApplicationFilters extends PaginationParams {
  status?: 'pending' | 'verified' | 'rejected';
  search?: string;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  type?: 'student' | 'agent' | 'admin';
  status?: 'active' | 'inactive';
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// API Endpoints
const endpoints = {
  dashboardStats: '/api/admin/dashboard/stats',
  paymentStats: '/api/admin/payments/stats',
  transactions: '/api/admin/transactions',
  transactionDetails: (id: string) => `/api/admin/transactions/${id}`,
  payments: '/api/admin/payments',
  paymentDetails: (id: string) => `/api/admin/payments/${id}`,
  properties: '/api/admin/properties',
  updatePropertyStatus: (id: string) => `/api/admin/properties/${id}/status`,
  agentApplications: '/api/admin/agents/applications',
  verifyAgent: (userId: string) => `/api/admin/verify-agent/${userId}`,
  users: '/api/admin/users',
};

// API Functions
export const getDashboardStats = () => {
  return API.get<TResponse<DashboardStats>>(endpoints.dashboardStats);
};

export const getPaymentStats = () => {
  return API.get<TResponse<PaymentStats>>(endpoints.paymentStats);
};

export const getAllTransactions = (params?: TransactionFilters) => {
  return API.get<TResponse<{ transactions: AdminTransaction[]; pagination: Pagination }>>(
    endpoints.transactions,
    {
      params,
    }
  );
};

export const getTransactionDetails = (id: string) => {
  return API.get<TResponse<AdminTransaction>>(endpoints.transactionDetails(id));
};

export const getAllPayments = (params?: PaymentFilters) => {
  return API.get<TResponse<{ payments: AdminPayment[]; pagination: Pagination }>>(
    endpoints.payments,
    {
      params,
    }
  );
};

export const getPaymentDetails = (id: string) => {
  return API.get<TResponse<AdminPayment>>(endpoints.paymentDetails(id));
};

export const getAllProperties = (params?: PropertyFilters) => {
  return API.get<TResponse<{ properties: AdminProperty[]; pagination: Pagination }>>(
    endpoints.properties,
    {
      params,
    }
  );
};

export const updatePropertyStatus = (id: string, status: 'approved' | 'rejected') => {
  return API.patch<TResponse<AdminProperty>>(endpoints.updatePropertyStatus(id), { status });
};

export const getAgentApplications = (params?: AgentApplicationFilters) => {
  return API.get<TResponse<{ applications: AgentApplication[]; pagination: Pagination }>>(
    endpoints.agentApplications,
    {
      params,
    }
  );
};

export const verifyAgent = (userId: string, status: 'verified' | 'rejected') => {
  return API.patch<TResponse<{ user: { id: string; email: string; status: string } }>>(
    endpoints.verifyAgent(userId),
    { status }
  );
};

export const getAllUsers = (params?: UserFilters) => {
  return API.get<TResponse<{ users: AdminUser[]; pagination: Pagination }>>(endpoints.users, {
    params,
  });
};
