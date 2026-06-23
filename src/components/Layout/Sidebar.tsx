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
  Shield,
  Mail,
  Activity,
  Terminal,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';
import { checkPermission } from '../../utils/permissionUtils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: PRIVATE_PATHS.DASHBOARD },
    { label: 'Analytics', icon: BarChart3, path: PRIVATE_PATHS.ANALYTICS },
    { label: 'User Management', icon: Users, path: PRIVATE_PATHS.USER_MANAGEMENT, permission: 'user_management.view_users' },
    { label: 'Payment & Escrow', icon: Wallet, path: PRIVATE_PATHS.PAYMENT_ESCROW, permission: 'finance_escrow.view_escrow' },
    { label: 'Task Management', icon: Briefcase, path: PRIVATE_PATHS.TASK_MANAGEMENT, permission: 'task_management.view_tasks' },
    { label: 'Admins', icon: Shield, path: PRIVATE_PATHS.ADMINS, permission: 'admin_management.manage_admins' },
    { label: 'Dispute & Reports', icon: AlertCircle, path: PRIVATE_PATHS.DISPUTE_REPORTS, permission: 'dispute_management.view_reports' },
    { label: 'Safety & SOS', icon: ShieldAlert, path: PRIVATE_PATHS.SOS_ALERTS, permission: 'task_management.view_tasks' },
    { label: 'Admin Chat', icon: MessageSquare, path: PRIVATE_PATHS.ADMIN_CHATS, permission: 'chats.view_chats' },
    { label: 'System Messages', icon: Bell, path: PRIVATE_PATHS.SYSTEM_MESSAGES, permission: 'system_communications.view_messages' },
    { label: 'Webhooks', icon: Terminal, path: PRIVATE_PATHS.WEBHOOKS, permission: 'webhook_management.view_webhooks' },
    { label: 'Website Inquiries', icon: Mail, path: PRIVATE_PATHS.WEBSITE_INQUIRIES, permission: 'website.view_inquiries' },
    { label: 'Settings', icon: Settings, path: PRIVATE_PATHS.SETTINGS, permission: 'settings.view_settings' },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || checkPermission(item.permission)
  );

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
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className={`p-6 flex items-center relative ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
          {!isCollapsed ? (
            <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-10 w-auto object-contain transition-all" />
          ) : (
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">S</div>
          )}
          
          <button 
            className="hidden lg:flex items-center justify-center p-1 text-gray-500 hover:text-gray-700 bg-white border border-[#EAECF0] hover:bg-gray-50 shadow-sm rounded-full absolute -right-3 top-8 z-10 transition-colors"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <div
              key={item.path}
              title={isCollapsed ? item.label : undefined}
              onClick={() => handleNavigate(item.path)}
              className={`sidebar-item ${isCollapsed ? 'px-0! justify-center' : ''} ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EAECF0]">
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
              <div className={`flex items-center ${isCollapsed ? 'justify-center p-0' : 'gap-3 p-2'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                   {user?.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {user?.firstName?.[0] || 'A'}
                     </div>
                   )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@shift9ja.com'}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
