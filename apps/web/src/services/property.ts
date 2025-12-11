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
  roomType: 'single' | 'shared' | 'self_contain';
  location: string;
  images: PropertyImage[];
  amenities:
    | {
        wifi: boolean;
        kitchen: boolean;
        security: boolean;
        parking: boolean;
        power24_7: boolean;
        gym: boolean;
      }
    | string[]; // Can be object or array for backward compatibility
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

export interface PaginatedProperties {
  properties: SavedProperty[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  amenities?: string[];
  agentId?: string;
  sortBy?: string;
}

const endpoints = {
  getAllProperties: '/api/property',
  getSavedProperties: '/api/property/saved',
  getAgentProperties: '/api/property/agent',
  createProperty: '/api/property',
  updateProperty: (id: string) => `/api/property/${id}`,
  deleteProperty: (id: string) => `/api/property/${id}`,
  getPropertyById: (id: string) => `/api/property/${id}`,
  saveProperty: (id: string) => `/api/property/${id}/save`,
  unsaveProperty: (id: string) => `/api/property/${id}/save`,
};

export const getAllProperties = (filters: PropertyFilters = {}) => {
  const params: Record<string, string | number> = {
    page: filters.page || 1,
    limit: filters.limit || 10,
  };

  if (filters.search) params.search = filters.search;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
  if (filters.location) params.location = filters.location;
  if (filters.amenities && filters.amenities.length > 0) {
    params.amenities = filters.amenities.join(',');
  }
  if (filters.agentId) params.agentId = filters.agentId;
  if (filters.sortBy) params.sortBy = filters.sortBy;

  return API.get<TResponse<PaginatedProperties>>(endpoints.getAllProperties, {
    params,
  });
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

export const getAgentProperties = (page = 1, limit = 10) => {
  return API.get<TResponse<PaginatedProperties>>(endpoints.getAgentProperties, {
    params: { page, limit },
  });
};

export interface AgentDashboardStats {
  totalProperties: number;
  availableRooms: number;
  pendingBookings: number;
  totalRevenue: number;
}

export const getAgentDashboardStats = () => {
  return API.get<TResponse<AgentDashboardStats>>('/api/user/dashboard/stats/agent');
};

export interface CreatePropertyResponse {
  message: string;
  property: SavedProperty;
}

export const createProperty = (formData: FormData) => {
  return API.post<TResponse<CreatePropertyResponse>>(endpoints.createProperty, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export interface UpdatePropertyResponse {
  message: string;
  property: SavedProperty;
}

export const updateProperty = (id: string, formData: FormData) => {
  return API.put<TResponse<UpdatePropertyResponse>>(endpoints.updateProperty(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProperty = (id: string) => {
  return API.delete<TResponse<{ message: string }>>(endpoints.deleteProperty(id));
};

export const getPropertyById = (id: string) => {
  return API.get<TResponse<{ property: SavedProperty }>>(endpoints.getPropertyById(id));
};
