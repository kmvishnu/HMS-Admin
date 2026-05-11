import React, { useState } from 'react';
import { Calendar, Filter, RotateCcw, Building2, User, Hotel } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';
import { useAdminBookings, useAdminHotels } from '../../hooks/useAdminHooks';

export const Bookings: React.FC = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, hotelId: '', status: '', date: '' });
  
  const { data: bookingsData, isLoading: isBookingsLoading } = useAdminBookings({
    ...params,
    hotelId: params.hotelId ? parseInt(params.hotelId, 10) : undefined
  });

  // For the hotel filter dropdown
  const { data: hotelsData } = useAdminHotels({ page: 1, limit: 100 });
  const hotelOptions = [
    { value: '', label: 'All Hotels' },
    ...(hotelsData?.data?.map((h: any) => ({ value: h.id.toString(), label: h.name })) || [])
  ];

  const resetFilters = () => {
    setParams({ page: 1, limit: 10, hotelId: '', status: '', date: '' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const columns = [
    { 
      header: 'Booking ID', 
      accessorKey: 'id', 
      cell: (b: any) => <span className="font-mono font-bold text-xs">#{b.id}</span> 
    },
    { 
      header: 'Hotel', 
      accessorKey: 'hotel_name',
      cell: (b: any) => (
        <div className="flex items-center gap-2">
          <Hotel className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="font-medium">{b.hotel_name}</span>
        </div>
      )
    },
    { 
      header: 'Customer', 
      accessorKey: 'user_name',
      cell: (b: any) => (
        <div className="flex flex-col">
          <span className="font-bold">{b.user_name}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">ID: #{b.user_id}</span>
        </div>
      )
    },
    { 
      header: 'Stay Period', 
      accessorKey: 'dates',
      cell: (b: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {formatDate(b.check_in)} - {formatDate(b.check_out)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {calculateNights(b.check_in, b.check_out)} Nights
          </span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (b: any) => (
        <Badge variant={b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'error' : 'warning'}>
          {b.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Master Bookings</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Monitor all platform transactions</p>
        </div>
        <Button variant="outline" onClick={resetFilters} className="text-xs">
          <RotateCcw className="w-3 h-3 mr-2" /> Reset Filters
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 border-none shadow-sm bg-[var(--color-background)]/50">
        <div className="flex-1">
          <Select 
            label="Filter by Hotel"
            options={hotelOptions}
            value={params.hotelId}
            onChange={(e) => setParams({ ...params, hotelId: e.target.value, page: 1 })}
          />
        </div>
        <div className="w-full md:w-48">
          <Select 
            label="Booking Status"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'CHECKED_IN', label: 'Checked In' },
              { value: 'CHECKED_OUT', label: 'Checked Out' },
            ]}
            value={params.status}
            onChange={(e) => setParams({ ...params, status: e.target.value, page: 1 })}
          />
        </div>
        <div className="w-full md:w-48">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Arrival Date</label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              value={params.date}
              onChange={(e) => setParams({ ...params, date: e.target.value, page: 1 })}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Table 
          columns={columns} 
          data={bookingsData?.data || []} 
          isLoading={isBookingsLoading}
          emptyMessage="No bookings found for the selected criteria."
        />

        {bookingsData?.pagination && (
          <Pagination 
            currentPage={bookingsData.pagination.page}
            totalPages={Math.ceil(bookingsData.pagination.total / bookingsData.pagination.limit)}
            onPageChange={(page) => setParams({ ...params, page })}
            isLoading={isBookingsLoading}
          />
        )}
      </div>
    </div>
  );
};
