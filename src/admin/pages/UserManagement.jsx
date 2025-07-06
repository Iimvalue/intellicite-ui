import React, { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Button } from '../../components/ui/button';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@university.edu',
      joinDate: '2024-01-15',
      lastActive: '2024-01-15T10:30:00Z',
      savedPapers: 45,
      citesGenerated: 78
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@institute.org',
      joinDate: '2024-01-10',
      lastActive: '2024-01-14T15:20:00Z',
      savedPapers: 123,
      citesGenerated: 245
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'john.smith@student.edu',
      joinDate: '2024-01-08',
      lastActive: '2024-01-12T09:15:00Z',
      savedPapers: 12,
      citesGenerated: 23
    },
    {
      id: 4,
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@research.org',
      joinDate: '2024-01-05',
      lastActive: '2024-01-15T14:45:00Z',
      savedPapers: 67,
      citesGenerated: 134
    }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '3',
      color: 'text-green-600'
    },
    {
      title: 'New This Week',
      value: '3',
      color: 'text-purple-600'
    },
    {
      title: 'Total Papers Saved',
      value: users.reduce((sum, user) => sum + user.savedPapers, 0).toString(),
      color: 'text-orange-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

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
                {users.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            Joined {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Last active: {new Date(user.lastActive).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">{user.savedPapers} papers saved</div>
                          <div className="text-sm text-gray-500">{user.citesGenerated} citations generated</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" title="Edit User">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Send Email">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="More Options">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement; 