import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

const Header = ({ 
  logo, 
  navigationItems = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Find active navigation item
  const activeIndex = navigationItems.findIndex(item => item.path === location.pathname);

  return (
    <header className="w-full bg-white border-b" style={{borderColor: '#E5E8EB'}}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ? (
              <Link to="/" className="flex items-center">
                {typeof logo === 'string' ? (
                  <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
                ) : (
                  logo
                )}
              </Link>
            ) : (
              <Link to="/" className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#283646'}}>
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            <div ref={navRef} className="flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-sm font-medium transition-all duration-200 py-2 px-3 rounded-lg relative whitespace-nowrap"
                  style={{
                    color: location.pathname === item.path ? '#1e3b8a' : '#6b7280',
                    backgroundColor: location.pathname === item.path ? 'rgba(60, 131, 246, 0.15)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#1e3b8a';
                      e.target.style.backgroundColor = 'rgba(60, 131, 246, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#6b7280';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Sign In/Sign Up Button */}
            <button
              onClick={handleSignIn}
              className="text-sm font-medium transition-colors duration-200 py-2 whitespace-nowrap"
              style={{ color: '#6b7280' }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1e3b8a';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6b7280';
              }}
            >
              Sign In/Sign Up
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md transition-colors duration-200"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => {
              e.target.style.color = '#1e3b8a';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6b7280';
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t" style={{borderColor: '#E5E8EB'}}>
            <nav className="flex flex-col space-y-4 pt-4">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium transition-all duration-200 py-2 px-3 rounded-lg"
                  style={{
                    color: location.pathname === item.path ? '#1e3b8a' : '#6b7280',
                    backgroundColor: location.pathname === item.path ? 'rgba(60, 131, 246, 0.15)' : 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              <button
                onClick={() => {
                  handleSignIn();
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm font-medium transition-colors duration-200 py-2 px-3 text-left rounded-lg"
                style={{ color: '#6b7280' }}
              >
                Sign In/Sign Up
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;