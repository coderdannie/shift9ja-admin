import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import authBg from '../../assets/auth-bg.png';
import notificationSocketService from '../../services/notificationSocketService';
import { socketService } from '../../services/socketService';
import { supportSocketService } from '../../services/supportSocketService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { QUERY_KEYS } from '../../services/queryKeys';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';
import { useAdminPushNotifications } from '../../hooks/useAdminPushNotifications';

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ── FCM Web Push: active for the full authenticated session ─────────────────
  // AuthLayout is only mounted when sessionStorage has a valid user token,
  // so isAuthenticated=true is safe. Token cleanup happens on unmount (logout).
  useAdminPushNotifications(true);

  useEffect(() => {
    notificationSocketService.connect();
    socketService.connect();
    supportSocketService.connect();

    const handleNotification = (notification: any) => {
      console.log('Real-time admin alert:', notification);
      
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_CHATS] });

      toast((t) => (
        <div className="flex flex-col gap-1.5 p-0.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <p className="font-bold text-sm text-[#101828] leading-tight">
              {notification.title}
            </p>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed pl-7">
            {notification.body}
          </p>
        </div>
      ), {
        duration: 5000,
        position: 'top-right',
      });
    };

    const handleChatsUpdated = (payload: { chatUuid?: string; type?: string }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_CHATS] });

      switch (payload.type) {
        case 'new_support_ticket':
          toast('New support ticket opened', { icon: 'ℹ️' });
          break;
        case 'new_dispute_ticket':
          toast.error('New dispute ticket raised');
          break;
        case 'ticket_claimed':
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_CHATS] });
          break;
        default:
          break;
      }
    };

    // Spec payload: { sessionUuid: string, userId: number, reason: string }
    const handleEscalationAlert = (payload: { sessionUuid?: string; userId?: number; reason?: string }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS] });

      toast(
        (t) => (
          <div className="flex flex-col gap-1.5 p-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg animate-bounce">🚨</span>
              <p className="font-bold text-sm text-[#101828] leading-tight">
                Session Escalated
              </p>
            </div>
            <p className="text-xs text-[#475467] leading-relaxed pl-7">
              {payload.reason || 'A user requested human support assistance.'}
            </p>
            {payload.sessionUuid && (
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(`${PRIVATE_PATHS.SUPPORT_SESSIONS}/${payload.sessionUuid}`);
                }}
                className="ml-7 mt-1 text-xs font-bold text-red-600 hover:underline text-left"
              >
                View session →
              </button>
            )}
          </div>
        ),
        {
          duration: 10000,
          position: 'top-right',
          style: { borderLeft: '4px solid #ef4444' },
        },
      );
    };

    notificationSocketService.on('admin_notification', handleNotification);
    socketService.on('chats_updated', handleChatsUpdated);
    supportSocketService.on('session_escalated', handleEscalationAlert);

    return () => {
      notificationSocketService.off('admin_notification', handleNotification);
      notificationSocketService.disconnect();
      socketService.off('chats_updated', handleChatsUpdated);
      socketService.disconnect();
      supportSocketService.off('session_escalated', handleEscalationAlert);
      supportSocketService.disconnect();
    };
  }, [queryClient, navigate]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <main className={`transition-all duration-300 ease-in-out pt-[80px] ${isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'}`}>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export const NonAuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:block relative overflow-hidden bg-primary">
        <img 
          src={authBg} 
          alt="Shift9ja Auth Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        
        {/* Branding Overlay */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-12 w-auto object-contain mb-6 brightness-0 invert" />
          <h2 className="text-4xl font-extrabold leading-tight">
            Your Premium Service <br /> Admin Dashboard
          </h2>
          <p className="mt-4 text-primary-50/90 text-lg max-w-md">
            Manage everything with ease and precision. Secure, reliable, and powerful dashboard for the Shift9ja ecosystem.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white overflow-y-auto">
        <div className="w-full max-w-[480px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <img src="/assets/shift-logo-2.svg" alt="Shift9ja Logo" className="h-10 w-auto object-contain" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
