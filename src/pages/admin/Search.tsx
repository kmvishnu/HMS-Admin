import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, Building2, CalendarCheck, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAdminSearch } from '../../hooks/useAdminHooks';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  
  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        setSearchParams({ q: inputValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, query, setSearchParams]);

  const { data: results, isLoading } = useAdminSearch(query);

  const renderSection = (title: string, icon: any, items: any[], type: 'user' | 'hotel' | 'booking') => {
    if (!items || items.length === 0) return null;
    const Icon = icon;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[var(--color-text-muted)] border-b border-[var(--color-border)] pb-2">
          <Icon className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
          <Badge variant="info" className="ml-2">{items.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <Card 
              key={item.id} 
              className="p-4 hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer group"
              onClick={() => {
                if (type === 'user') navigate(`/admin/users?search=${item.email}`);
                if (type === 'hotel') navigate(`/admin/hotels/${item.id}`);
                if (type === 'booking') navigate(`/admin/bookings?hotelId=${item.hotel_id}`);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[var(--color-text)]">
                    {type === 'booking' ? `Booking #${item.id}` : item.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {type === 'user' ? item.email : type === 'hotel' ? item.location : `Customer: ${item.user_name}`}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <h1 className="text-3xl font-bold">Global System Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <Input 
            className="pl-12 h-14 text-lg rounded-2xl shadow-lg border-none glass" 
            placeholder="Search users, hotels, or bookings..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 animate-pulse text-[var(--color-text-muted)]">
          Searching through platform data...
        </div>
      ) : query.length < 2 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          Enter at least 2 characters to start searching.
        </div>
      ) : (
        <div className="space-y-12">
          {renderSection('Users', Users, results?.users || [], 'user')}
          {renderSection('Hotels', Building2, results?.hotels || [], 'hotel')}
          {renderSection('Bookings', CalendarCheck, results?.bookings || [], 'booking')}
          
          {(!results?.users?.length && !results?.hotels?.length && !results?.bookings?.length) && (
            <div className="text-center py-12 glass rounded-3xl border border-dashed border-[var(--color-border)]">
              <p className="text-[var(--color-text-muted)] font-medium">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
