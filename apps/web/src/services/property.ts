import { API, type TResponse } from './auth';

export interface PropertyImage {
  url: string;
  cloudinary_id: string;
}

export interface PropertyAgent {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface SavedProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: PropertyImage[];
  amenities: string[];
  rating?: number;
  isAvailable: boolean;
  agentId: PropertyAgent[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedSavedProperties {
  properties: SavedProperty[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const endpoints = {
  getSavedProperties: '/api/property/saved',
  saveProperty: (id: string) => `/api/property/${id}/save`,
  unsaveProperty: (id: string) => `/api/property/${id}/save`,
};

export const getSavedProperties = (page = 1, limit = 10) => {
  return API.get<TResponse<PaginatedSavedProperties>>(endpoints.getSavedProperties, {
    params: { page, limit },
  });
};

export const saveProperty = (propertyId: string) => {
  return API.post<TResponse<{ message: string }>>(endpoints.saveProperty(propertyId));
};

export const unsaveProperty = (propertyId: string) => {
  return API.delete<TResponse<{ message: string }>>(endpoints.unsaveProperty(propertyId));
};
