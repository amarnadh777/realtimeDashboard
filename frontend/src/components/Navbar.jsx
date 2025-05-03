import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef();

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Active route helper
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex bg-white w-full h-[4em] justify-between items-center px-8 md:px-14 shadow-md">
      <div className="font-bold text-xl text-blue-600">Realtime Dashboard</div>

      <div className="flex gap-6 items-center">
        <Link
          to="/dashboard"
          className={`text-lg ${isActive('/dashboard') ? 'text-blue-600 font-semibold' : 'text-gray-800'} hover:text-blue-600 transition duration-300`}
        >
          Dashboard
        </Link>
        <Link
          to="/flowchart"
          className={`text-lg ${isActive('/flowchart') ? 'text-blue-600 font-semibold' : 'text-gray-800'} hover:text-blue-600 transition duration-300`}
        >
          Flow Chart
        </Link>

        <div className="relative" ref={dropdownRef}>
          <p
            className="text-lg text-gray-800 hover:text-blue-600 cursor-pointer transition duration-300"
            onClick={toggleDropdown}
          >
            {user ? "Profile" : 'Profile'}
          </p>

          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md w-40 z-50">
              <Link
              
                className="block p-2 text-gray-800 hover:bg-gray-200"
              >
                Profile Settings
              </Link>
              <p
                onClick={handleLogout}
                className="block p-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
