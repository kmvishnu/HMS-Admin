import { apiClient } from './client';

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    const data = response.data.data;
    return {
      totalUsers: Number(data.total_users || 0),
      totalHotels: Number(data.total_hotels || 0),
      totalBookings: Number(data.total_bookings || 0),
      activeBookingsToday: Number(data.active_bookings_today || 0),
      totalOwners: Number(data.total_owners || 0),
      totalCustomers: Number(data.total_customers || 0)
    };
  },

  // Users
  getUsers: async (params: { page?: number; limit?: number; role?: string; search?: string }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data; // Returning full response because it contains pagination info
  },
  createUser: async (userData: any) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data.data;
  },
  updateUser: async (id: number, userData: any) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data.data;
  },
  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data.data;
  },

  // Hotels
  getHotels: async (params: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/hotels', { params });
    return response.data; // Contains pagination
  },
  getHotelDetails: async (id: number) => {
    const response = await apiClient.get(`/admin/hotels/${id}`);
    const { hotel, roomTypes, bookings } = response.data.data;
    return {
      ...hotel,
      isVisible: Boolean(hotel.is_visible),
      imageUrls: hotel.image_urls || [],
      roomTypes: roomTypes || [],
      bookings: bookings || []
    };
  },
  toggleHotelVisibility: async (id: number, isVisible: boolean) => {
    const response = await apiClient.put(`/admin/hotels/${id}/visibility`, { isVisible });
    return response.data.data;
  },
  deleteHotel: async (id: number) => {
    const response = await apiClient.delete(`/admin/hotels/${id}`);
    return response.data.data;
  },

  // Owners
  getOwnerDetails: async (id: number) => {
    const response = await apiClient.get(`/admin/owners/${id}`);
    return response.data.data;
  },

  // Bookings
  getBookings: async (params: { page?: number; limit?: number; hotelId?: number; status?: string }) => {
    const response = await apiClient.get('/admin/bookings', { params });
    return response.data; // Contains pagination
  },

  // Search
  globalSearch: async (q: string) => {
    const response = await apiClient.get('/admin/search', { params: { q } });
    return response.data.data;
  }
};
