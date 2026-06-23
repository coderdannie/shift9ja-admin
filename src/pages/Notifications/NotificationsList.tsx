import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Clock, 
  Check, 
  ShieldAlert, 
  MapPin, 
  AlertCircle, 
  MessageSquare, 
  Info, 
  DollarSign,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { 
  useGetAdminNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from "../../services/query/notifications";
import { formatDistanceToNow, format } from "date-fns";
import { PRIVATE_PATHS } from "../../routes/constants";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";

const typeConfigs: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; borderColor: string }> = {
  SOS_ALERT: { label: "SOS Triggered", icon: ShieldAlert, color: "text-rose-600", bgColor: "bg-rose-50/50", borderColor: "border-rose-100" },
  DEVIATION_ALERT: { label: "Deviation Alert", icon: MapPin, color: "text-amber-600", bgColor: "bg-amber-50/50", borderColor: "border-amber-100" },
  NEW_DISPUTE: { label: "Dispute Opened", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-50/50", borderColor: "border-orange-100" },
  NEW_SUPPORT_CHAT: { label: "New Support Chat", icon: MessageSquare, color: "text-indigo-600", bgColor: "bg-indigo-50/50", borderColor: "border-indigo-100" },
  SYSTEM_ALERT: { label: "System Message", icon: Info, color: "text-blue-600", bgColor: "bg-blue-50/50", borderColor: "border-blue-100" },
  LARGE_TRANSACTION: { label: "High Value Tx", icon: DollarSign, color: "text-emerald-600", bgColor: "bg-emerald-50/50", borderColor: "border-emerald-100" },
};

const NotificationsList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [selectedType, setSelectedType] = useState<string>("");

  // Filters to query params
  const queryParams = useMemo(() => {
    const params: { page: number; limit: number; type?: string; isRead?: boolean } = {
      page: currentPage,
      limit: 10,
    };
    if (activeTab === "unread") params.isRead = false;
    if (activeTab === "read") params.isRead = true;
    if (selectedType) params.type = selectedType;
    return params;
  }, [currentPage, activeTab, selectedType]);

  // Fetch notifications
  const { data: response, isPending: isLoading } = useGetAdminNotifications(queryParams);
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();

  const notifications = useMemo(() => response?.data?.data || [], [response]);
  const meta = response?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  // Filter local items by search query (for fine local filtering on the active page)
  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return notifications;
    const query = searchQuery.toLowerCase();
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }, [notifications, searchQuery]);

  // Actions
  const handleMarkAsRead = (e: React.MouseEvent, uuid: string) => {
    e.stopPropagation();
    markRead(uuid);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markRead(notification.uuid);
    }

    const typeKey = String(notification.type).toUpperCase();

    // Direct routing based on type
    if (typeKey === "SOS_ALERT") {
      navigate(PRIVATE_PATHS.SOS_ALERTS);
    } else if (typeKey === "NEW_DISPUTE") {
      if (notification.data?.disputeUuid) {
        navigate(`${PRIVATE_PATHS.DISPUTE_REPORTS}/${notification.data.disputeUuid}`);
      } else {
        navigate(PRIVATE_PATHS.DISPUTE_REPORTS);
      }
    } else if (typeKey === "DEVIATION_ALERT" && (notification.data?.taskId || notification.data?.taskUuid)) {
      const taskId = notification.data.taskId || notification.data.taskUuid;
      navigate(`${PRIVATE_PATHS.TASK_MANAGEMENT}/${taskId}`);
    } else if (typeKey === "NEW_SUPPORT_CHAT") {
      if (notification.data?.chatUuid) {
        navigate(`${PRIVATE_PATHS.ADMIN_CHATS}/${notification.data.chatUuid}`);
      } else {
        navigate(PRIVATE_PATHS.ADMIN_CHATS);
      }
    }
  };

  const handleTabChange = (tab: "all" | "unread" | "read") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight flex items-center gap-3">
            <Bell className="text-primary" size={30} />
            Notifications Center
          </h1>
          <p className="text-[#475467] mt-1.5 text-sm max-w-2xl leading-relaxed">
            Real-time audit log of critical events, security reports, disputes, and geofence geotracking alerts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            label="Mark all as read"
            variant="outline"
            fullWidth={false}
            icon={<Check size={16} />}
            onClick={() => markAllRead()}
            className="h-10 text-xs font-bold"
          />
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-3xl border border-[#EAECF0] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters Toolbar */}
        <div className="p-6 border-b border-[#F2F4F7] bg-white sticky top-0 z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch flex-1 max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search alerts content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Type selector */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-11 pr-8 rounded-xl border border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold bg-white text-[#475467] appearance-none"
              >
                <option value="">All Categories</option>
                <option value="SOS_ALERT">Safety & SOS Alerts</option>
                <option value="DEVIATION_ALERT">Location Deviation</option>
                <option value="NEW_DISPUTE">Disputes & Claims</option>
                <option value="NEW_SUPPORT_CHAT">Customer Support Chats</option>
                <option value="SYSTEM_ALERT">System Messages</option>
                <option value="LARGE_TRANSACTION">High-Value Transactions</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex p-1 bg-[#F9FAFB] rounded-xl border border-[#F2F4F7] shadow-inner self-start lg:self-auto shrink-0">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-white text-[#101828] shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => handleTabChange("unread")}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "unread"
                  ? "bg-white text-primary shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-primary"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => handleTabChange("read")}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "read"
                  ? "bg-white text-gray-700 shadow-sm ring-1 ring-gray-100"
                  : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              Archived / Read
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 bg-gray-50/30 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[#475467] font-medium">Syncing database events feed...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white p-8">
              <Check className="text-gray-300 mb-4" size={48} />
              <p className="text-[#101828] text-lg font-bold">Inbox Cleared</p>
              <p className="text-gray-400 text-sm max-w-sm mt-1">
                There are no administrative alerts matching your filtering criteria at the moment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredNotifications.map((notification) => {
                const config = typeConfigs[String(notification.type).toUpperCase()] || {
                  label: "General Alert",
                  icon: Bell,
                  color: "text-gray-600",
                  bgColor: "bg-gray-50",
                  borderColor: "border-gray-100",
                };
                const Icon = config.icon;
                const date = new Date(notification.createdAt);

                return (
                  <div
                    key={notification.uuid}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 cursor-pointer ${
                      !notification.isRead 
                        ? "border-primary/20 bg-primary/[0.01] shadow-sm shadow-primary/5 hover:border-primary/40" 
                        : "border-[#EAECF0] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Icon */}
                      <div className={`w-11 h-11 rounded-2xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center shrink-0`}>
                        <Icon size={20} className={config.color} />
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color}`}>
                            {config.label}
                          </span>
                          {!notification.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                          <span className="text-[11px] font-semibold text-gray-400 font-mono">
                            ID: {notification.uuid}
                          </span>
                        </div>
                        <h3 className={`text-sm font-black leading-snug ${!notification.isRead ? "text-[#101828]" : "text-gray-700"}`}>
                          {notification.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-3xl">
                          {notification.body}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex md:flex-col items-end gap-3 justify-between w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {format(date, "MMM dd, yyyy h:mm a")} ({formatDistanceToNow(date, { addSuffix: true })})
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.uuid)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 border border-gray-200 hover:border-primary/20 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 border border-gray-200 hover:border-primary/20 rounded-lg transition-all"
                          title="View resource details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-[#F2F4F7] flex items-center justify-between text-xs text-[#667085] bg-white">
            <p>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredNotifications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {meta?.totalItems || filteredNotifications.length}
              </span>{" "}
              events
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
