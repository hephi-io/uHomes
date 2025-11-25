import { API, type TResponse } from './auth';

export interface ActiveBookingsSummary {
  count: number;
  totalAmount: number;
}

export interface BookingProperty {
  _id: string;
  title: string;
  location: string;
  price: number;
  images?: Array<{ url: string; cloudinary_id: string }>;
}

export interface BookingAgent {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Booking {
  _id: string;
  property: BookingProperty | string;
  agent: BookingAgent | string;
  tenant: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  moveInDate: string;
  moveOutDate?: string;
  duration: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const endpoints = {
  getActiveBookingsSummary: '/api/booking/student/active-summary',
  getMyBookings: '/api/booking',
};

export const getActiveBookingsSummary = () => {
  return API.get<TResponse<ActiveBookingsSummary>>(endpoints.getActiveBookingsSummary);
};

export const getMyBookings = (page = 1, limit = 10) => {
  return API.get<TResponse<PaginatedBookings>>(endpoints.getMyBookings, {
    params: { page, limit },
  });
};
