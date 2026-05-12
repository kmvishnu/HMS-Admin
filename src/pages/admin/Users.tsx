import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useAdminHooks';
import { useState } from 'react';

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 10, role: '', search: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'HOTEL_OWNER' });

  const { data, isLoading } = useAdminUsers(params);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const openEditModal = (user: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'HOTEL_OWNER' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await updateUser.mutateAsync({ id: editingUser.id, data: formData });
    } else {
      await createUser.mutateAsync({ ...formData, role: 'HOTEL_OWNER' });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser.mutate(id);
    }
  };

  // Filter out ADMIN users from display
  const filteredUsers = (data?.data || []).filter((u: any) => u.role !== 'ADMIN');

  const columns = [
    { header: 'Name', accessorKey: 'name', cell: (u: any) => <span className="font-bold">{u.name}</span> },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (u: any) => (
        <Badge variant={u.role === 'HOTEL_OWNER' ? 'success' : 'default'}>
          {u.role}
        </Badge>
      )
    },
    { header: 'Joined', accessorKey: 'created_at', cell: (u: any) => new Date(u.created_at).toLocaleDateString() },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (u: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => openEditModal(u, e)} className="p-2 h-9 w-9">
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => handleDelete(u.id, e)} className="p-2 h-9 w-9">
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
          <h1 className="text-2xl font-bold text-[var(--color-text)]">User Management</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Manage platform users and roles</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Create Owner</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 glass rounded-xl border border-[var(--color-border)]">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 pr-10 w-full text-text"
            value={params.search}
            onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
          />
          {params.search && (
            <button
              onClick={() => setParams({ ...params, search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Select
          className="w-full md:w-48"
          options={[
            { value: '', label: 'All Roles' },
            { value: 'HOTEL_OWNER', label: 'Owner' },
            { value: 'STAFF', label: 'Staff' },
            { value: 'CUSTOMER', label: 'Customer' },
          ]}
          value={params.role}
          onChange={(e) => setParams({ ...params, role: e.target.value, page: 1 })}
        />
      </div>

      <div className="space-y-4">
        <Table
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          onRowClick={(u) => navigate(`/admin/users/${u.id}`)}
          emptyMessage="No users found matching your criteria."
        />

        {data?.pagination && (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={Math.ceil(data.pagination.total / data.pagination.limit)}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit Owner' : 'Create New Owner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="text-text"
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="text-text"
          />
          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="text-text"
            />
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" isLoading={createUser.isPending || updateUser.isPending}>
              {editingUser ? 'Update Owner' : 'Create Owner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
