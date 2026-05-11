import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Building2, TrendingUp, CalendarCheck, Hotel } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdminOwnerDetails } from '../../hooks/useAdminHooks';

export const OwnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ownerId = parseInt(id || '0', 10);
  
  const { data: owner, isLoading } = useAdminOwnerDetails(ownerId);

  if (isLoading) return <div className="p-8 text-center animate-pulse text-[var(--color-text-muted)]">Loading owner data...</div>;
  if (!owner) return <div className="p-8 text-center text-red-500">Owner not found.</div>;

  const statsCards = [
    { label: 'Total Hotels', value: owner.stats?.totalHotels, icon: Building2, color: 'text-blue-500' },
    { label: 'Total Bookings', value: owner.stats?.totalBookings, icon: CalendarCheck, color: 'text-emerald-500' },
    { label: 'Active Bookings', value: owner.stats?.activeBookings, icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Owner Info Sidebar */}
        <Card className="w-full md:w-80 shrink-0 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-[var(--color-border)]">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{owner.name}</h2>
              <p className="text-sm text-[var(--color-text-muted)] flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" /> {owner.email}
              </p>
            </div>
            <Badge variant="success">Verified Owner</Badge>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Account Actions</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-blue-500">Contact Owner</Button>
              <Button variant="ghost" className="w-full justify-start text-amber-500">Reset Password</Button>
              <Button variant="ghost" className="w-full justify-start text-red-500">Suspend Account</Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="flex items-center gap-4 p-5 shadow-sm border-none bg-[var(--color-background)]/50">
                  <div className={`p-3 rounded-xl bg-white dark:bg-black/20 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value || 0}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Hotels List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Hotel className="w-5 h-5 text-[var(--color-primary)]" />
              Managed Hotels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {owner.hotels?.length > 0 ? (
                owner.hotels.map((hotel: any) => (
                  <Card 
                    key={hotel.id} 
                    className="hover:scale-[1.02] transition-transform cursor-pointer group"
                    onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg group-hover:text-[var(--color-primary)] transition-colors">
                        {hotel.name}
                      </h4>
                      <Badge variant={hotel.is_visible ? 'success' : 'warning'}>
                        {hotel.is_visible ? 'Live' : 'Hidden'}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">{hotel.location}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                      <span className="text-xs text-[var(--color-text-muted)]">Hotel ID: #{hotel.id}</span>
                      <span className="text-xs font-bold text-blue-500">View Details →</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center glass rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                  <p className="text-[var(--color-text-muted)]">No hotels assigned to this owner.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
