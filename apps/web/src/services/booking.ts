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
  propertyid: BookingProperty | string;
  propertyType: string;
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

export interface CreateBookingInput {
  propertyid: string;
  propertyType: string;
  moveInDate: string; // ISO date string
  moveOutDate?: string; // ISO date string
  duration: string;
  gender: 'male' | 'female';
  specialRequest?: string;
  amount: number;
}

const endpoints = {
  createBooking: '/api/booking',
  getActiveBookingsSummary: '/api/booking/student/active-summary',
  getMyBookings: '/api/booking',
  getBookingById: (id: string) => `/api/booking/${id}`,
};

export const createBooking = (data: CreateBookingInput) => {
  return API.post<TResponse<Booking>>(endpoints.createBooking, data);
};

export const getActiveBookingsSummary = () => {
  return API.get<TResponse<ActiveBookingsSummary>>(endpoints.getActiveBookingsSummary);
};

export const getMyBookings = (page = 1, limit = 10) => {
  return API.get<TResponse<PaginatedBookings>>(endpoints.getMyBookings, {
    params: { page, limit },
  });
};

export const getBookingById = (id: string) => {
  return API.get<TResponse<Booking>>(endpoints.getBookingById(id));
};

// Helper function to get booking for a specific property
export const getBookingByPropertyId = async (propertyId: string): Promise<Booking | null> => {
  try {
    // Fetch all bookings and filter client-side
    const response = await getMyBookings(1, 100); // Get first 100 bookings
    if (response.data.status === 'success') {
      const booking = response.data.data.bookings.find((b) => {
        const property = typeof b.propertyid === 'object' ? b.propertyid : null;
        return property?._id === propertyId && b.paymentStatus === 'paid';
      });
      return booking || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking by property ID:', error);
    return null;
  }
};
