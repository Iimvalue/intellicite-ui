import AdminLayout from '../layout/AdminLayout';
import { Button } from '../../components/ui/button';
import {
  Settings as SettingsIcon,
  Database,
  Shield,
  Globe,
  Bell,
} from 'lucide-react';

const SettingsSection = ({ icon: Icon, title, description, children }) => (
  <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
    <div className='p-6 border-b border-gray-200'>
      <div className='flex items-center space-x-3'>
        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
          {Icon && <Icon className='w-5 h-5 text-blue-600' />}
        </div>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>
    </div>
    <div className='p-6'>{children}</div>
  </div>
);

const Settings = () => {
  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              System Settings
            </h1>
            <p className='text-gray-600 mt-1'>Configure platform</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <SettingsSection
            icon={Database}
            title='Database Configuration'
            description='Manage database connections and performance'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Database Connection Status
                </label>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  <span className='text-sm text-gray-600'>Connected</span>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Shield}
            title='Security Settings'
            description='Configure authentication and access controls'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  Two-Factor Authentication
                </span>
                <Button variant='outline' size='sm'>
                  Configure
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  Session Timeout
                </span>
                <span className='text-sm text-gray-600'>24 hours</span>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Globe}
            title='API Configuration'
            description='Manage external API integrations'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  OpenAI API
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  <span className='text-sm text-gray-600'>Active</span>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  Semantic Scholar API
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  <span className='text-sm text-gray-600'>Active</span>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Bell}
            title='Notification Settings'
            description='Configure system notifications and alerts'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  Email Notifications
                </span>
                <Button variant='outline' size='sm'>
                  Enable
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  System Alerts
                </span>
                <Button variant='outline' size='sm'>
                  Configure
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
