import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Trash2, Building2 } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useAdminHotels, useToggleVisibility, useDeleteHotel } from '../../hooks/useAdminHooks';

export const Hotels: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useAdminHotels(params);
  const toggleVisibility = useToggleVisibility();
  const deleteHotel = useDeleteHotel();

  const handleToggle = (e: React.MouseEvent, id: number, current: boolean) => {
    e.stopPropagation();
    toggleVisibility.mutate({ id, isVisible: !current });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Delete this hotel? All associated room types and inventory will be lost.')) {
      deleteHotel.mutate(id);
    }
  };

  const columns = [
    { 
      header: 'Hotel Name', 
      accessorKey: 'name',
      cell: (h: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="font-bold">{h.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{h.location}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Owner', 
      accessorKey: 'owner',
      cell: (h: any) => (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/owners/${h.owner_id}`); }}
          className="text-blue-500 hover:underline font-medium"
        >
          {h.owner_name}
        </button>
      )
    },
    {
      header: 'Status',
      accessorKey: 'is_visible',
      cell: (h: any) => (
        <Badge variant={h.is_visible ? 'success' : 'warning'}>
          {h.is_visible ? 'Live' : 'Hidden'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (h: any) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => handleToggle(e, h.id, h.is_visible)}
            title={h.is_visible ? 'Hide from public' : 'Make live'}
          >
            {h.is_visible ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => handleDelete(e, h.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Hotels Directory</h1>
        <p className="text-[var(--color-text-muted)] text-sm">Monitor and manage platform hotels</p>
      </div>

      <div className="space-y-4">
        <Table 
          columns={columns} 
          data={data?.data || []} 
          isLoading={isLoading}
          onRowClick={(h) => navigate(`/admin/hotels/${h.id}`)}
          emptyMessage="No hotels found on the platform."
        />

        {data?.pagination && (
          <Pagination 
            currentPage={data.pagination.page}
            totalPages={Math.ceil(data.pagination.total / data.pagination.limit)}
            onPageChange={(page) => setParams({ ...params, page })}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
