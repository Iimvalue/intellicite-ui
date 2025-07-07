import { BarChart3, Users, Settings } from 'lucide-react';

export const NAV_ITEMS = [
  {
    path: '/admin/dashboard',
    label: 'Papers & Reports',
    description: 'Stats & GPT reports',
    icon: BarChart3,
  },
  {
    path: '/admin/users',
    label: 'User Management',
    description: 'Manage user accounts',
    icon: Users,
  },

  {
    path: '/admin/settings',
    label: 'Settings',
    description: 'System configuration',
    icon: Settings,
  },
];

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const FILTERS = ['all', 'admin', 'user'];

export const DEFAULT_STATS = {
  userStats: { total: 0 },
  paperStats: { total: 0 },
  reportStats: { total: 0 },
  recentCounts: { users: 0, papers: 0, reports: 0 },
  recentUsers: [],
  recentPapers: [],
  recentReports: [],
};

export const ERRORS = {
  AUTH_REQUIRED: 'Authentication required. Please login as an admin.',
  ACCESS_DENIED: 'Access denied. You need admin privileges to view this page.',
  FETCH_USERS_FAILED: 'Failed to fetch users',
  DELETE_USER_FAILED: 'Failed to delete user',
  CREATE_USER_FAILED: 'Failed to create user',
  UPDATE_USER_FAILED: 'Failed to update user',
  FETCH_DASHBOARD_FAILED: 'Failed to load dashboard data',
};
