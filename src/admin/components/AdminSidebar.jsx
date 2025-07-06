import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/admin/users',
      label: 'User Management',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      path: '/admin/dashboard',
      label: 'Papers & Reports',
      icon: BarChart3,
      description: 'Stats, GPT reports & cite checks'
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            IntelliCite Admin
          </h2>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                      isActive 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors mt-0.5 flex-shrink-0",
                      isActive 
                        ? "text-blue-600" 
                        : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar; 