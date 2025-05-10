import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Package, Coffee, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home size={20} />,
    },
    {
      name: 'Produtos',
      path: '/products',
      icon: <Package size={20} />,
    },
    {
      name: 'Fornecedores',
      path: '/suppliers',
      icon: <Users size={20} />,
    },
  ];

  const baseItemClass = 'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150';
  const activeItemClass = 'bg-orange-100 text-orange-700';
  const inactiveItemClass = 'text-gray-600 hover:bg-gray-100';

  const handleCloseMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={handleCloseMobileSidebar}
        ></div>
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee size={24} className="text-orange-500" />
              <h1 className="text-xl font-bold text-gray-800">Pastelaria</h1>
            </div>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={handleCloseMobileSidebar}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${baseItemClass} ${
                  isActive(item.path) ? activeItemClass : inactiveItemClass
                }`}
                onClick={handleCloseMobileSidebar}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => {
                logout();
                handleCloseMobileSidebar();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;