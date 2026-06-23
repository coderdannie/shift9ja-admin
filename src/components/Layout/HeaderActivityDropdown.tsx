import React, { useMemo } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { 
  Bell, 
  Clock, 
  ChevronRight, 
  Check, 
  ShieldAlert, 
  MapPin, 
  AlertCircle, 
  MessageSquare, 
  Info, 
  DollarSign 
} from 'lucide-react';
import { 
  useGetAdminNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from '../../services/query/notifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../routes/constants';

const typeConfigs: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  SOS_ALERT: { icon: ShieldAlert, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-100' },
  DEVIATION_ALERT: { icon: MapPin, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-100' },
  NEW_DISPUTE: { icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-100' },
  NEW_SUPPORT_CHAT: { icon: MessageSquare, color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-100' },
  SYSTEM_ALERT: { icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
  LARGE_TRANSACTION: { icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-100' },
};

const HeaderActivityDropdown = () => {
  const navigate = useNavigate();
  
  // Fetch latest notifications
  const { data: notificationsResponse, isLoading } = useGetAdminNotifications({ limit: 10 });
  const notifications = useMemo(() => notificationsResponse?.data?.data || [], [notificationsResponse]);

  // Fetch unread notifications to get total unread count
  const { data: unreadResponse } = useGetAdminNotifications({ isRead: false, limit: 1 });
  const unreadCount = unreadResponse?.data?.meta?.totalItems || 0;

  // Mutations
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markRead(notification.uuid);
    }

    const typeKey = String(notification.type).toUpperCase();

    // Direct routing based on type
    if (typeKey === 'SOS_ALERT') {
      navigate(PRIVATE_PATHS.SOS_ALERTS);
    } else if (typeKey === 'NEW_DISPUTE') {
      if (notification.data?.disputeUuid) {
        navigate(`${PRIVATE_PATHS.DISPUTE_REPORTS}/${notification.data.disputeUuid}`);
      } else {
        navigate(PRIVATE_PATHS.DISPUTE_REPORTS);
      }
    } else if (typeKey === 'DEVIATION_ALERT' && (notification.data?.taskId || notification.data?.taskUuid)) {
      const taskId = notification.data.taskId || notification.data.taskUuid;
      navigate(`${PRIVATE_PATHS.TASK_MANAGEMENT}/${taskId}`);
    } else if (typeKey === 'NEW_SUPPORT_CHAT') {
      if (notification.data?.chatUuid) {
        navigate(`${PRIVATE_PATHS.ADMIN_CHATS}/${notification.data.chatUuid}`);
      } else {
        navigate(PRIVATE_PATHS.ADMIN_CHATS);
      }
    } else {
      navigate('/notifications');
    }
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="p-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full relative transition-all active:scale-95">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </MenuButton>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <MenuItems className="absolute right-0 mt-3 w-80 md:w-96 origin-top-right rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 focus:outline-none overflow-hidden z-50 border border-gray-100">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-base font-extrabold text-[#101828] flex items-center gap-2">
                Notifications
              </h3>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                You have {unreadCount} unread administrative alerts
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  markAllRead();
                }}
                className="text-[11px] font-bold text-primary hover:text-green-700 flex items-center gap-1 bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 transition-colors active:scale-95"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/20">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-gray-400 font-medium tracking-wide">Syncing notification channel...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const typeConfig = typeConfigs[String(notification.type).toUpperCase()] || { icon: Bell, color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-100' };
                  const Icon = typeConfig.icon;

                  return (
                    <MenuItem key={notification.uuid}>
                      {({ active }) => (
                        <div
                          className={`p-4 flex gap-4 transition-colors cursor-pointer relative ${
                            !notification.isRead ? 'bg-primary/[0.02]' : 'bg-white'
                          } ${active ? 'bg-gray-50' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {/* Unread indicator dot */}
                          {!notification.isRead && (
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                          )}

                          <div className={`w-10 h-10 rounded-2xl ${typeConfig.bgColor} border flex items-center justify-center shrink-0`}>
                             <Icon size={18} className={typeConfig.color} />
                          </div>
                          
                          <div className="flex-1 space-y-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <p className={`text-xs font-black truncate ${!notification.isRead ? 'text-[#101828]' : 'text-gray-500'}`}>
                                {notification.title}
                              </p>
                              <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 shrink-0 whitespace-nowrap">
                                <Clock size={10} />
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-gray-500 leading-normal line-clamp-2">
                              {notification.body}
                            </p>
                          </div>
                        </div>
                      )}
                    </MenuItem>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center gap-3 bg-white">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-gray-300">
                   <Bell size={24} />
                </div>
                <p className="text-sm font-extrabold text-[#101828]">No Alerts Found</p>
                <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed font-semibold">Your workspace is clean. Active threats or reports will appear here.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <button 
              onClick={() => navigate('/notifications')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#475467] bg-white border border-gray-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow active:scale-[0.99]"
            >
              View All Notifications
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default HeaderActivityDropdown;
