import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import toast from 'react-hot-toast';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardStats,
    staleTime: STALE_TIME,
  });
};

export const useAdminUsers = (params: any) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getUsers(params),
    staleTime: STALE_TIME,
    placeholderData: (previousData) => previousData, // keepPreviousData replacement in v5
  });
};

export const useAdminUserDetails = (id: number) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserDetails(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
};

export const useAdminHotels = (params: any) => {
  return useQuery({
    queryKey: ['admin-hotels', params],
    queryFn: () => adminApi.getHotels(params),
    staleTime: STALE_TIME,
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminHotelDetails = (id: number) => {
  return useQuery({
    queryKey: ['admin-hotel', id],
    queryFn: () => adminApi.getHotelDetails(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
};

export const useAdminBookings = (params: any) => {
  return useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: () => adminApi.getBookings(params),
    staleTime: STALE_TIME,
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminSearch = (q: string) => {
  return useQuery({
    queryKey: ['admin-search', q],
    queryFn: () => adminApi.globalSearch(q),
    enabled: q.length >= 2,
    staleTime: 0, // Search results should be fresh
  });
};

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
  });
};

export const useToggleVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVisible }: { id: number; isVisible: boolean }) => 
      adminApi.toggleHotelVisibility(id, isVisible),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      queryClient.invalidateQueries({ queryKey: ['admin-hotel', variables.id] });
      toast.success(`Hotel ${variables.isVisible ? 'is now visible' : 'is now hidden'}`);
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      toast.success('Hotel deleted successfully');
    },
  });
};

export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      toast.success('Hotel created successfully');
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateHotel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      queryClient.invalidateQueries({ queryKey: ['admin-hotel', variables.id] });
      toast.success('Hotel updated successfully');
    },
  });
};
