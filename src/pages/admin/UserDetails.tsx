import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Building2, 
  Users as UsersIcon, 
  CalendarCheck, 
  TrendingUp,
  MapPin,
  Clock,
  IdCard
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { useAdminUserDetails } from '../../hooks/useAdminHooks';

export const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || '0', 10);
  
  const { data: user, isLoading, error } = useAdminUserDetails(userId);

  if (isLoading) return <div className="p-8 text-center animate-pulse text-[var(--color-text-muted)]">Loading user details...</div>;
  if (error || !user) return <div className="p-8 text-center text-red-500 font-bold">User not found or error fetching data.</div>;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const renderStats = (stats: any, role: string) => {
    if (!stats) return null;

    const cards = role === 'OWNER' ? [
      { label: 'Total Hotels', value: stats.totalHotels, icon: Building2, color: 'text-blue-500' },
      { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-emerald-500' },
      { label: 'Active Bookings', value: stats.activeBookings, icon: TrendingUp, color: 'text-purple-500' },
    ] : [
      { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-blue-500' },
      { label: 'Upcoming', value: stats.upcomingBookings, icon: Clock, color: 'text-amber-500' },
      { label: 'Completed', value: stats.completedBookings, icon: TrendingUp, color: 'text-emerald-500' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="flex items-center gap-4 p-5 shadow-sm border-none bg-[var(--color-background)]/50">
              <div className={`p-3 rounded-xl bg-white dark:bg-black/20 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">{card.value || 0}</p>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
      </Button>

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-[var(--color-border)] pb-8">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-[var(--color-border)]">
            <User className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[var(--color-text)]">{user.name}</h1>
            <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
              <Badge variant={user.role === 'OWNER' ? 'success' : user.role === 'ADMIN' ? 'error' : 'info'}>
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
        
        <Card className="p-4 bg-[var(--color-background)]/30 border-[var(--color-border)] min-w-[200px]">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2">Registration Info</p>
          <div className="space-y-2">
            <p className="text-sm flex items-center gap-2"><IdCard className="w-3 h-3 text-[var(--color-primary)]" /> ID: #{user.id}</p>
            <p className="text-sm flex items-center gap-2"><Calendar className="w-3 h-3 text-[var(--color-primary)]" /> Joined: {formatDate(user.created_at)}</p>
          </div>
        </Card>
      </div>

      {/* Role Specific Content */}
      <div className="space-y-8">
        {user.role === 'OWNER' && (
          <>
            {renderStats(user.details?.stats, 'OWNER')}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--color-primary)]" /> Managed Hotels
                </h3>
                <Table 
                  columns={[
                    { header: 'Hotel Name', accessorKey: 'name', cell: (h) => <span className="font-bold">{h.name}</span> },
                    { header: 'Location', accessorKey: 'location' },
                    { 
                      header: 'Status', 
                      accessorKey: 'is_visible', 
                      cell: (h) => <Badge variant={h.is_visible ? 'success' : 'warning'}>{h.is_visible ? 'Visible' : 'Hidden'}</Badge> 
                    }
                  ]}
                  data={user.details?.hotels || []}
                  onRowClick={(h) => navigate(`/admin/hotels/${h.id}`)}
                  emptyMessage="No hotels managed by this owner."
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-[var(--color-primary)]" /> Staff Members
                </h3>
                <Table 
                  columns={[
                    { header: 'Name', accessorKey: 'name', cell: (s) => <span className="font-bold">{s.name}</span> },
                    { header: 'Email', accessorKey: 'email' },
                    { header: 'Hotel ID', accessorKey: 'hotelId', cell: (s) => <Badge variant="info">#{s.hotelId}</Badge> }
                  ]}
                  data={user.details?.staff || []}
                  emptyMessage="No staff members assigned to this owner's hotels."
                />
              </div>
            </div>
          </>
        )}

        {user.role === 'CUSTOMER' && (
          <>
            {renderStats(user.details?.stats, 'CUSTOMER')}
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[var(--color-primary)]" /> Booking History
              </h3>
              <Table 
                columns={[
                  { 
                    header: 'Hotel', 
                    accessorKey: 'hotel', 
                    cell: (b) => <span className="font-bold">{b.hotel?.name}</span> 
                  },
                  { header: 'Room Type', accessorKey: 'roomType', cell: (b) => b.roomType?.name },
                  { 
                    header: 'Stay Period', 
                    accessorKey: 'dates', 
                    cell: (b) => (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{formatDate(b.checkIn)} - {formatDate(b.checkOut)}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{calculateNights(b.checkIn, b.checkOut)} Nights</span>
                      </div>
                    )
                  },
                  { 
                    header: 'Status', 
                    accessorKey: 'status', 
                    cell: (b) => <Badge variant={b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'error' : 'warning'}>{b.status}</Badge> 
                  }
                ]}
                data={user.details?.bookings || []}
                emptyMessage="This customer has no booking history."
              />
            </div>
          </>
        )}

        {user.role === 'STAFF' && (
          <Card className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <Building2 className="w-6 h-6 text-[var(--color-primary)]" /> Assigned Hotel
            </h3>
            {user.details?.hotel ? (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Hotel Name</p>
                    <p className="text-2xl font-bold">{user.details.hotel.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Location</p>
                    <p className="text-lg flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {user.details.hotel.location}</p>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => navigate(`/admin/hotels/${user.details.hotel.id}`)}>
                    View Hotel Details →
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)]">This staff member is not currently assigned to any hotel.</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
