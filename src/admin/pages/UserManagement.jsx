import React, { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Button } from '../../components/ui/button';
import UserModal from '../components/UserModal';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Mail,
  Calendar,
  Plus
} from 'lucide-react';
import { LoadingState, ErrorState, StatsGrid } from '../components/shared/SharedComponents';
import { useUsers } from '../hooks/getData';
import { FILTERS } from '../constants';
import { prepareUserStats, filterUsers, getUserInitials, formatDate } from '../utils/helpers';

const Header = ({ onCreateUser }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
    </div>
    <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreateUser}>
      <Plus className="w-4 h-4 mr-2" />
      Add New User
    </Button>
  </div>
);

const SearchFilter = ({ searchTerm, onSearchChange, roleFilter, onFilterClick }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <Button variant="outline" onClick={onFilterClick}>
        <Filter className="w-4 h-4 mr-2" />
        {roleFilter === 'all' ? 'Filter: All' : roleFilter === 'admin' ? 'Filter: Admins' : 'Filter: Users'}
      </Button>
    </div>
  </div>
);

const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="py-4 px-6">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
          {getUserInitials(user.name)}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-xs text-blue-600">{user.role}</div>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="space-y-1">
        <div className="flex items-center text-sm text-gray-900">
          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
          Joined {formatDate(user.createdAt)}
        </div>
        <div className="text-sm text-gray-500">Active user</div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="space-y-1">
        <div className="text-sm text-gray-900">Role: {user.role}</div>
        <div className="text-sm text-gray-500">User ID: {user._id || user.id}</div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          title="Edit User"
          onClick={() => onEdit(user)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" title="Send Email">
          <Mail className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-700" 
          title="Delete User"
          onClick={() => onDelete(user._id || user.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </td>
  </tr>
);

const UsersTable = ({ users, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">User</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Join Date</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Usage Stats</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow 
              key={user._id || user.id} 
              user={user} 
              onEdit={onEdit} 
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    deleteUser, 
    createUser, 
    updateUser 
  } = useUsers();

  const handleFilterClick = () => {
    const currentIndex = FILTERS.indexOf(roleFilter);
    const nextIndex = (currentIndex + 1) % FILTERS.length;
    setRoleFilter(FILTERS[nextIndex]);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = async (userData) => {
    if (editingUser) {
      await updateUser(editingUser._id || editingUser.id, userData);
    } else {
      await createUser(userData);
    }
    setModalOpen(false);
    setEditingUser(null);
  };

  if (loading) return <LoadingState message="Loading users..." />;
  if (error) return <ErrorState error={error} onRetry={fetchUsers} />;

  const stats = prepareUserStats(users);
  const filteredUsers = filterUsers(users, searchTerm, roleFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Header onCreateUser={handleCreate} />
        
        <StatsGrid stats={stats} />
        
        <SearchFilter 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onFilterClick={handleFilterClick}
        />
        
        <UsersTable 
          users={filteredUsers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

        <UserModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSubmit}
          user={editingUser}
          title={editingUser ? 'Edit User' : 'Create New User'}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement; 