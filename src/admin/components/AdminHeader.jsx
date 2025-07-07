import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { LogOut, User } from 'lucide-react';
import { logout, getProfile, isAuthenticated } from '../../services/authService';
import { isAdmin } from '../../services/adminService';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/login');
          return;
        }

        const userProfile = await getProfile();

        
        const user = userProfile.user || userProfile.data?.user;
        const name = user?.name || 'Admin';
        const role = user?.role || 'user';
        
        setUserName(name);
        setUserRole(role);
        
        if (!isAdmin(userProfile.user)) {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserName('Admin'); 
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                <img 
                  src="/Intellicite-logo.jpg" 
                  alt="IntelliCite Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">IntelliCite</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Welcome {userName}</span>
              {userRole && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {userRole}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 