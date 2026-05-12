import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Trash2, Building2, Plus, Edit, X, Upload } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { useAdminHotels, useToggleVisibility, useDeleteHotel, useCreateHotel, useUpdateHotel, useAdminUsers } from '../../hooks/useAdminHooks';

export const Hotels: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', location: '', ownerId: '' });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const { data, isLoading } = useAdminHotels(params);
  const { data: ownersData } = useAdminUsers({ role: 'HOTEL_OWNER', limit: 100 });
  
  const toggleVisibility = useToggleVisibility();
  const deleteHotel = useDeleteHotel();
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();

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

  const handleOpenCreateModal = () => {
    setEditingHotel(null);
    setFormData({ name: '', location: '', ownerId: '' });
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, hotel: any) => {
    e.stopPropagation();
    setEditingHotel(hotel);
    setFormData({ 
      name: hotel.name, 
      location: hotel.location, 
      ownerId: hotel.owner_id.toString() 
    });
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHotel) {
      await updateHotel.mutateAsync({ 
        id: editingHotel.id, 
        data: { 
          name: formData.name, 
          location: formData.location, 
          ownerId: parseInt(formData.ownerId) 
        } 
      });
    } else {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('ownerId', formData.ownerId);
      selectedImages.forEach(file => data.append('images', file));
      
      await createHotel.mutateAsync(data);
    }
    
    handleCloseModal();
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
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${h.owner_id}`); }}
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
            onClick={(e) => handleOpenEditModal(e, h)}
            title="Edit hotel details"
          >
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Hotels Directory</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Monitor and manage platform hotels</p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Create Hotel</span>
        </Button>
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Hotel Name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="text-text"
          />
          <Input 
            label="Location" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="text-text"
          />
          <Select 
            label="Assign Owner"
            options={[
              { value: '', label: 'Select an owner' },
              ...(ownersData?.data?.map((u: any) => ({ value: u.id.toString(), label: u.name })) || [])
            ]}
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            required
          />

          {!editingHotel && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">Hotel Images</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-border)] border-dashed rounded-xl cursor-pointer bg-[var(--color-background)]/50 hover:bg-[var(--color-background)] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[var(--color-text-muted)]" />
                    <p className="text-xs text-[var(--color-text-muted)]">Click to upload images (up to 5)</p>
                  </div>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              {selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedImages.map((file, i) => (
                    <div key={i} className="px-2 py-1 bg-[var(--color-primary)]/10 rounded text-[10px] text-[var(--color-primary)] flex items-center gap-1">
                      {file.name}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" isLoading={createHotel.isPending || updateHotel.isPending}>
              {editingHotel ? 'Update Hotel' : 'Create Hotel'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
