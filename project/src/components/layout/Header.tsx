import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsMobileOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          className="p-1 text-gray-500 lg:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 lg:ml-8">
          <h1 className="text-xl font-semibold text-gray-800 lg:hidden">Point do Pastel II</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;