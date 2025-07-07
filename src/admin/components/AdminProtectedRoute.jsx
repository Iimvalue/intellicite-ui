import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { getProfile, isAuthenticated } from '../../services/authService';
import { isAdmin } from '../../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!isAuthenticated()) {
          setLoading(false);
          return;
        }

        const userProfile = await getProfile();
        setUser(userProfile.user);
      } catch (error) {
        console.error('Failed to verify admin access:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
