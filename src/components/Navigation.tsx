import React, { useState } from 'react';
import { ShoppingCart, User, Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme, useUser } from './ThemeContext';
import { useCartLike } from './CartLikeContext';
import UserAuth from './UserAuth';
import AdminPortal from './pages/AdminPortal';

interface NavigationProps {
  onPageChange?: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onPageChange }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useUser();
  const { cart } = useCartLike();
  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const menuItems = [
    { name: 'BEDS', page: 'beds' },
    { name: 'STATIONARY', page: 'stationary' },
    { name: 'BATHWARE', page: 'bathware' },
    { name: 'DORM', page: 'dorm' },
    { name: 'NEW COLLECTIONS', page: 'new-collections' }
  ];

  const handleAdminPortalRequest = () => {
    setIsUserAuthOpen(false);
    setShowAdminPortal(true);
  };

  const handleCartClick = () => {
    onPageChange?.('dashboard');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      } border-b`}>
        {/* Desktop Navigation */}
        <div className="hidden md:grid md:grid-cols-3 h-16">
          {/* Logo */}
          <div className="flex items-center justify-start px-6">
            <button 
              onClick={() => onPageChange?.('home')}
              className={`text-lg font-light tracking-wider transition-colors ${
              isDark ? 'text-white' : 'text-black'
            } hover:opacity-70`}>
              DAYKART
            </button>
          </div>

          {/* Menu */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-sm font-light tracking-wider px-4 py-2 transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              MENU
            </button>
          </div>

          {/* Theme Toggle, Cart, Profile */}
          <div className="flex items-center justify-end px-6 space-x-4">
            
            <button
              className={`relative p-2 transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-black'
              }`}
              onClick={handleCartClick}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  <span className="text-sm">{user.name}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserDropdown && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                      {isAdmin() && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      {isAdmin() && (
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowAdminPortal(true);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Admin Portal
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          isDark 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`p-2 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-black'
                }`}
                onClick={() => setIsUserAuthOpen(true)}
              >
                <User size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between h-16 px-4">
          {/* Mobile Logo */}
          <button 
            onClick={() => onPageChange?.('home')}
            className={`text-lg font-light tracking-wider transition-colors ${
            isDark ? 'text-white' : 'text-black'
          } hover:opacity-70`}>
            DAYKART
          </button>

          {/* Mobile Right Side */}
          <div className="flex items-center space-x-3">
            
            <button
              className={`relative p-2 transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-black'
              }`}
              onClick={handleCartClick}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {user ? (
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`p-2 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <User size={18} />
              </button>
            ) : (
              <button 
                className={`p-2 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-black'
                }`}
                onClick={() => setIsUserAuthOpen(true)}
              >
                <User size={18} />
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Desktop Menu Dropdown */}
        {isMenuOpen && (
          <div className={`absolute top-16 left-0 right-0 transition-all duration-300 ${
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
          } border-b hidden md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange?.(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 text-sm font-light tracking-wider transition-colors border-r last:border-r-0 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-900 border-gray-800' 
                      : 'text-gray-700 hover:text-black hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className={`absolute top-16 left-0 right-0 transition-all duration-300 ${
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
          } border-b md:hidden`}>
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange?.(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 text-sm font-light tracking-wider transition-colors border-b last:border-b-0 text-left ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-900 border-gray-800' 
                      : 'text-gray-700 hover:text-black hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile User Dropdown */}
        {showUserDropdown && user && (
          <div className={`absolute top-16 right-4 w-48 rounded-lg shadow-lg border md:hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {user.email}
              </p>
              {isAdmin() && (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  Admin
                </span>
              )}
            </div>
            <div className="p-2 space-y-1">
              {isAdmin() && (
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowAdminPortal(true);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin Portal
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  setShowUserDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <UserAuth 
        isOpen={isUserAuthOpen} 
        onClose={() => setIsUserAuthOpen(false)} 
        onAdminPortalRequest={handleAdminPortalRequest}
      />
      
      {showAdminPortal && (
        <AdminPortal onClose={() => setShowAdminPortal(false)} />
      )}
    </>
  );
};

export default Navigation;