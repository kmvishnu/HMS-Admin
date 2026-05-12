import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Dashboard } from '../pages/admin/Dashboard';
import { Users } from '../pages/admin/Users';
import { UserDetails } from '../pages/admin/UserDetails';
import { Hotels } from '../pages/admin/Hotels';
import { HotelDetails } from '../pages/admin/HotelDetails';
import { Bookings } from '../pages/admin/Bookings';
import { Search } from '../pages/admin/Search';

export const AdminRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotels/:id" element={<HotelDetails />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="search" element={<Search />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};
