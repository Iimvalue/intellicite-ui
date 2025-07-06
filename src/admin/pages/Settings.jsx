import React from 'react';
import AdminLayout from '../layout/AdminLayout';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure your academic research platform</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-gray-500"></p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings; 