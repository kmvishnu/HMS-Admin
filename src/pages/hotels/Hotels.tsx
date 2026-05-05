import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
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
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', location: '', ownerId: '' });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

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

  const openEditModal = (hotel: any) => {
    setEditingHotel(hotel);
    setEditFormData({ 
      name: hotel.name, 
      location: hotel.location, 
      ownerId: hotel.owner_id ? String(hotel.owner_id) : '' 
    });
    setNewImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: editFormData.name,
        location: editFormData.location,
      };
      if (editFormData.ownerId) {
        payload.ownerId = parseInt(editFormData.ownerId, 10);
      }
      await apiClient.put(`/hotels/${editingHotel.id}`, payload);
      setIsEditModalOpen(false);
      fetchHotels();
    } catch (error) {
      console.error("Failed to update hotel", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await apiClient.delete(`/hotels/${id}`);
      fetchHotels();
    } catch (error) {
      console.error("Failed to delete hotel", error);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await apiClient.delete(`/hotels/${editingHotel.id}/images`, { data: { imageUrl } });
      setEditingHotel({
        ...editingHotel,
        image_urls: editingHotel.image_urls.filter((url: string) => url !== imageUrl)
      });
      fetchHotels();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handleAddImage = async () => {
    if (!newImageFile) return;
    const formData = new FormData();
    formData.append('image', newImageFile);
    try {
      await apiClient.post(`/hotels/${editingHotel.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewImageFile(null);
      setIsEditModalOpen(false); // Close modal to refresh data cleanly
      fetchHotels();
    } catch (error) {
      console.error("Failed to add image", error);
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
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (hotel: any) => (
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0" title="Edit" onClick={() => openEditModal(hotel)}>
            <Edit className="w-5 h-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={() => handleDeleteHotel(hotel.id)} title="Delete">
            <Trash2 className="w-5 h-5 text-red-500" />
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Hotel">
        <div className="space-y-6">
          <form onSubmit={handleUpdateHotel} className="space-y-4">
            <Input 
              label="Hotel Name" 
              value={editFormData.name} 
              onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} 
              required 
            />
            <Input 
              label="Location" 
              value={editFormData.location} 
              onChange={e => setEditFormData({ ...editFormData, location: e.target.value })} 
              required 
            />
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Assign Owner
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                value={editFormData.ownerId}
                onChange={e => setEditFormData({ ...editFormData, ownerId: e.target.value })}
              >
                <option value="">Select an owner</option>
                {owners.map((owner: any) => (
                  <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Update Hotel</Button>
            </div>
          </form>

          <div className="border-t border-[var(--color-border)] pt-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Manage Images</h3>
            
            {editingHotel?.image_urls && editingHotel.image_urls.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {editingHotel.image_urls.map((url: string, index: number) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--color-border)]">
                    <img src={url} alt={`Image ${index}`} className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button variant="danger" size="sm" onClick={() => handleDeleteImage(url)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] mb-4">No images available.</p>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Add New Image
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewImageFile(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-[var(--color-text-muted)]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[var(--color-primary)] file:text-white
                    hover:file:opacity-90"
                />
              </div>
              <Button type="button" onClick={handleAddImage} disabled={!newImageFile}>Upload</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
