import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wallet, 
  AlertCircle, 
  Bell, 
  MessageSquare, 
  Settings,
  LogOut,
  X,
  Shield
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: PRIVATE_PATHS.DASHBOARD },
    { label: 'User Management', icon: Users, path: PRIVATE_PATHS.USER_MANAGEMENT },
    { label: 'Payment & Escrow', icon: Wallet, path: PRIVATE_PATHS.PAYMENT_ESCROW },
    { label: 'Task Management', icon: Briefcase, path: PRIVATE_PATHS.TASK_MANAGEMENT },
    { label: 'Admins', icon: Shield, path: PRIVATE_PATHS.ADMINS },
    { label: 'Dispute & Reports', icon: AlertCircle, path: PRIVATE_PATHS.DISPUTE_REPORTS },
    { label: 'Notifications', icon: Bell, path: PRIVATE_PATHS.NOTIFICATIONS },
    { label: 'System Messages', icon: MessageSquare, path: PRIVATE_PATHS.SYSTEM_MESSAGES },
    { label: 'Settings', icon: Settings, path: PRIVATE_PATHS.SETTINGS },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-[#EAECF0] flex flex-col z-50
        transition-transform duration-300 ease-in-out
        w-[280px]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-10 w-auto object-contain" />
          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EAECF0]">
          {(() => {
            const user = JSON.parse(sessionStorage.getItem('user') || 'null');
            return (
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                   <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                     {user?.firstName?.[0] || 'A'}
                   </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@shift9ja.com'}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            );
          })()}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
