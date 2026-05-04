import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, CalendarCheck, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../api/client';

interface DashboardStats {
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Hotels',
      value: stats?.totalHotels || 0,
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: CalendarCheck,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-[var(--color-border)] rounded-2xl opacity-50"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Overview</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card hoverEffect className="relative overflow-hidden group">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-[var(--color-text)]">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              {/* Decorative background glow on hover */}
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Placeholder for future charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-96 flex items-center justify-center">
          <p className="text-[var(--color-text-muted)]">Revenue Chart Placeholder</p>
        </Card>
        <Card className="h-96 flex items-center justify-center">
          <p className="text-[var(--color-text-muted)]">Recent Activity Placeholder</p>
        </Card>
      </div>
    </div>
  );
};
