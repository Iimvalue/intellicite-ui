import React from 'react';
import { Link } from 'react-router';

const Footer = ({
  navigationItems = [],
  copyrightText = "© 2025 IntelliCite. All rights reserved.",
  className = ""
}) => {
  return (
    <footer className={`bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Navigation Links */}
          {navigationItems.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Logo - Moved here */}
          <img
            src="./public/logo.png"
            className="h-10 w-10 rounded-full"

            alt="Company Logo" // Always add alt text for accessibility
          />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {copyrightText}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;