import { API, type TResponse } from './auth';

export interface ReviewUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface Review {
  _id: string;
  propertyId: string;
  userId: ReviewUser | string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

const endpoints = {
  getPropertyReviews: (propertyId: string) => `/api/property/${propertyId}/reviews`,
  createPropertyReview: (propertyId: string) => `/api/property/${propertyId}/reviews`,
};

export const getPropertyReviews = (propertyId: string, page = 1, limit = 10) => {
  return API.get<TResponse<PaginatedReviews>>(endpoints.getPropertyReviews(propertyId), {
    params: { page, limit },
  });
};

export interface CreateReviewInput {
  rating: number;
  comment: string;
}

export const createPropertyReview = (propertyId: string, data: CreateReviewInput) => {
  return API.post<TResponse<{ message: string; review: Review }>>(
    endpoints.createPropertyReview(propertyId),
    data
  );
};
