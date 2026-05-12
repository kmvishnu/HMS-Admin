import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { useAdminHotelDetails, useToggleVisibility } from '../../hooks/useAdminHooks';

export const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hotelId = parseInt(id || '0', 10);
  
  const { data: hotel, isLoading } = useAdminHotelDetails(hotelId);
  const toggleVisibility = useToggleVisibility();

  if (isLoading) return <div className="p-8 text-center animate-pulse text-[var(--color-text-muted)]">Loading hotel data...</div>;
  if (!hotel) return <div className="p-8 text-center text-red-500">Hotel not found.</div>;

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

  const bookingColumns = [
    { header: 'Guest', accessorKey: 'user_name', cell: (b: any) => <span className="font-bold">{b.user_name}</span> },
    { header: 'Room Type', accessorKey: 'room_type_name' },
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
    <div className="space-y-8 pb-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-[var(--color-text)]">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <MapPin className="w-4 h-4" />
              <span>{hotel.location}</span>
            </div>
            <div className="pt-2 flex gap-2">
              <Badge variant={hotel.isVisible ? 'success' : 'warning'}>
                {hotel.isVisible ? 'Visible' : 'Hidden'}
              </Badge>
              <Badge variant="info">ID: {hotel.id}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <Button 
            variant={hotel.isVisible ? 'outline' : 'primary'}
            onClick={() => toggleVisibility.mutate({ id: hotel.id, isVisible: !hotel.isVisible })}
            isLoading={toggleVisibility.isPending}
          >
            {hotel.isVisible ? <><XCircle className="w-4 h-4 mr-2" /> Hide Hotel</> : <><CheckCircle className="w-4 h-4 mr-2" /> Publish Hotel</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Features and Images */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images */}
          <Card>
            <h3 className="text-xl font-bold mb-4">Gallery</h3>
            {hotel.imageUrls?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.imageUrls.map((url: string, i: number) => (
                  <img key={i} src={url} alt={`Hotel ${i}`} className="w-full h-48 object-cover rounded-xl border border-[var(--color-border)] shadow-sm hover:opacity-90 transition-opacity" />
                ))}
              </div>
            ) : (
              <div className="h-48 rounded-xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)]">
                <ImageIcon className="w-8 h-8 mr-2" /> No images uploaded
              </div>
            )}
          </Card>

          {/* Features */}
          <Card>
            <h3 className="text-xl font-bold mb-4">Features & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.features?.map((f: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-sm font-medium">
                  {f}
                </span>
              )) || <p className="text-[var(--color-text-muted)]">No features listed.</p>}
            </div>
          </Card>

          {/* Bookings Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Recent Bookings</h3>
            <Table 
              columns={bookingColumns} 
              data={hotel.bookings || []} 
              emptyMessage="No bookings found for this hotel."
            />
          </div>
        </div>

        {/* Right Column: Room Types and Stats */}
        <div className="space-y-8">
          <Card>
            <h3 className="text-xl font-bold mb-4">Room Types</h3>
            <div className="space-y-4">
              {hotel.roomTypes?.map((rt: any) => (
                <div key={rt.id} className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold">{rt.name}</p>
                    <p className="text-[var(--color-primary)] font-bold">₹{rt.price}</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{rt.total_rooms} Rooms Available</p>
                </div>
              )) || <p className="text-[var(--color-text-muted)]">No room types defined.</p>}
            </div>
          </Card>

          <Card className="bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20">
            <h3 className="text-xl font-bold mb-4">Ownership</h3>
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-muted)]">Managed by</p>
              <div className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
                <p className="text-lg font-bold">{hotel.owner_name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{hotel.owner_email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full justify-start pl-0 text-blue-500 hover:text-blue-600"
                onClick={() => navigate(`/admin/users/${hotel.owner_id}`)}
              >
                View Owner Profile →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
