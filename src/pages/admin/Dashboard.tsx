import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, CalendarCheck, UserCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAdminDashboard } from '../../hooks/useAdminHooks';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminDashboard();

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/admin/users' },
    { label: 'Total Hotels', value: stats?.totalHotels, icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/admin/hotels' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/admin/bookings' },
    { label: 'Active Owners', value: stats?.totalOwners, icon: UserCheck, color: 'text-amber-500', bg: 'bg-amber-500/10', path: '/admin/users?role=OWNER' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
        <p className="text-[var(--color-text-muted)]">Platform-wide performance and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card 
              key={i} 
              onClick={() => navigate(card.path)}
              className="flex items-center gap-5 p-6 border-none shadow-sm transition-transform hover:scale-[1.02] cursor-pointer hover:bg-[var(--color-primary)]/5"
            >
              <div className={`p-4 rounded-2xl ${card.bg}`}>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-[var(--color-text)] mt-1">
                  {isLoading ? '...' : card.value?.toLocaleString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for more complex analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96 flex items-center justify-center border-dashed border-2 bg-transparent">
          <p className="text-[var(--color-text-muted)]">Booking Trends (Coming Soon)</p>
        </Card>
        <Card className="h-96 flex items-center justify-center border-dashed border-2 bg-transparent">
          <p className="text-[var(--color-text-muted)]">Top Performing Hotels (Coming Soon)</p>
        </Card>
      </div>
    </div>
  );
};
