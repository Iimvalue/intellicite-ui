import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className='w-72 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto'>
      <div className='p-4'>
        <div className='mb-6'>
          <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
            IntelliCite Admin
          </h2>
        </div>

        <nav>
          <ul className='space-y-2'>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-start space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group ${
                      active
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}>
                    <Icon
                      className={`w-5 h-5 transition-colors mt-0.5 flex-shrink-0 ${
                        active
                          ? 'text-gray-700'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium'>{item.label}</div>
                      <div className='text-xs text-gray-500 mt-0.5'>
                        {item.description}
                      </div>
                    </div>
                    {active && (
                      <ChevronRight className='w-4 h-4 text-gray-600 mt-0.5' />
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
