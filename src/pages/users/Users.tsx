import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { apiClient } from '../../api/client';

export const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users?role=HOTEL_OWNER');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/users', {
        ...formData,
        role: 'HOTEL_OWNER'
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name', cell: (user: any) => <span className="font-medium">{user.name}</span> },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role', cell: (user: any) => <Badge variant="info">{user.role}</Badge> },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (user: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(user.id)} title="Delete">
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
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Hotel Owners</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Manage hotel owners and their accounts</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Owner
        </Button>
      </div>

      <Table columns={columns} data={users} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Owner">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input 
            label="Name" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password} 
            onChange={e => setFormData({ ...formData, password: e.target.value })} 
            required 
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Owner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
