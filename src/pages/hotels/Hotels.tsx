import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../api/client';

export const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', location: '', ownerId: '' });
  const [images, setImages] = useState<File[]>([]);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/hotels');
      setHotels(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await apiClient.get('/users?role=HOTEL_OWNER');
      setOwners(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch owners", error);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchOwners();
  }, []);

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('location', formData.location);
    if (formData.ownerId) payload.append('ownerId', formData.ownerId);
    
    images.forEach((file) => {
      payload.append('images', file);
    });

    try {
      await apiClient.post('/hotels', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setFormData({ name: '', location: '', ownerId: '' });
      setImages([]);
      fetchHotels();
    } catch (error) {
      console.error("Failed to create hotel", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Image', 
      accessorKey: 'images', 
      cell: (hotel: any) => (
        hotel.image_urls && hotel.image_urls.length > 0 ? (
          <img src={hotel.image_urls[0]} alt={hotel.name} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--color-border)] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
          </div>
        )
      )
    },
    { header: 'Name', accessorKey: 'name', cell: (hotel: any) => <span className="font-medium text-[var(--color-text)]">{hotel.name}</span> },
    { header: 'Location', accessorKey: 'location' },
    { header: 'Owner ID', accessorKey: 'owner_id', cell: (hotel: any) => hotel.owner_id || <span className="text-[var(--color-text-muted)] text-xs italic">Unassigned</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Hotels Directory</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Manage hotels and assignments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      <Table columns={columns} data={hotels} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Hotel">
        <form onSubmit={handleCreateHotel} className="space-y-4">
          <Input 
            label="Hotel Name" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
          <Input 
            label="Location" 
            value={formData.location} 
            onChange={e => setFormData({ ...formData, location: e.target.value })} 
            required 
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Assign Owner (Optional)
            </label>
            <select
              className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              value={formData.ownerId}
              onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
            >
              <option value="">Select an owner</option>
              {owners.map((owner: any) => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Images
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) setImages(Array.from(e.target.files));
              }}
              className="block w-full text-sm text-[var(--color-text-muted)]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[var(--color-primary)] file:text-white
                hover:file:opacity-90"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Hotel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
