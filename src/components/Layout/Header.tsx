import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import HeaderActivityDropdown from './HeaderActivityDropdown';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarCollapsed }) => {
  return (
    <header className={`h-[80px] bg-white border-b border-[#EAECF0] flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:left-[80px]' : 'lg:left-[280px]'} right-0 z-40`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={onMenuToggle}
        >
          <Menu size={24} />
        </button>
        
        <div className="flex-1 max-w-xl relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search here..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Mobile Search Icon only */}
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Search size={24} />
        </button>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <HeaderActivityDropdown />
        {(() => {
          const [user, setUser] = React.useState(JSON.parse(sessionStorage.getItem('user') || 'null'));
          
          React.useEffect(() => {
            const handleStorageChange = () => {
              setUser(JSON.parse(sessionStorage.getItem('user') || 'null'));
            };
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
          }, []);

          return (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-white ring-offset-2 ring-gray-100 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'D'}`
              )}
            </div>
          );
        })()}
      </div>
    </header>
  );
};

export default Header;
