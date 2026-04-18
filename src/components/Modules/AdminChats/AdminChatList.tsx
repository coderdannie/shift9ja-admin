import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Clock, 
  ChevronRight,
  Filter,
  User as UserIcon,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useGetAdminChats } from '../../../services/query/chat';
import type { Chat } from '../../../types/chat';
import { PRIVATE_PATHS } from '../../../routes/constants';

const AdminChatList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'task' | 'dispute' | 'support'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chatsData, isLoading } = useGetAdminChats({
    type: activeTab === 'all' ? undefined : activeTab,
  });

  const filteredChats = chatsData?.data?.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    const clientName = chat.client ? `${chat.client.firstName} ${chat.client.lastName}`.toLowerCase() : '';
    const helperName = chat.helper ? `${chat.helper.firstName} ${chat.helper.lastName}`.toLowerCase() : '';
    const reason = chat.dispute?.reason?.toLowerCase() || '';
    const taskTitle = chat.task?.title?.toLowerCase() || '';
    
    return clientName.includes(searchLower) || 
           helperName.includes(searchLower) || 
           reason.includes(searchLower) || 
           taskTitle.includes(searchLower);
  }) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dispute': return <AlertCircle className="text-red-500" size={16} />;
      case 'support': return <HelpCircle className="text-blue-500" size={16} />;
      default: return <MessageCircle className="text-green-500" size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dispute': return 'Dispute';
      case 'support': return 'Support';
      case 'task': return 'Task';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, task, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#EAECF0] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {(['all', 'dispute', 'support', 'task'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all
                ${activeTab === tab 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab === 'all' ? 'All Chats' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History List */}
      <div className="bg-white border border-[#EAECF0] rounded-2xl overflow-hidden shadow-sm">
        {filteredChats.length > 0 ? (
          <div className="divide-y divide-[#F2F4F7]">
            {filteredChats.map((chat) => (
              <div
                key={chat.uuid}
                onClick={() => navigate(`${PRIVATE_PATHS.ADMIN_CHATS}/${chat.uuid}`)}
                className="p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg border-2 border-white shadow-sm">
                      {chat.client?.avatarUrl ? (
                         <img src={chat.client.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        chat.client?.firstName?.[0] || <UserIcon size={20} />
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-[#101828] truncate">
                        {chat.client ? `${chat.client.firstName} ${chat.client.lastName}` : 'System Chat'}
                      </h4>
                      <div className={`
                        flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                        ${chat.type === 'dispute' ? 'bg-red-50 text-red-600' : 
                          chat.type === 'support' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}
                      `}>
                        {getTypeIcon(chat.type)}
                        {getTypeLabel(chat.type)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate italic">
                      {chat.lastMessage?.content || (chat.dispute?.reason ? `Re: ${chat.dispute.reason}` : 'Start the conversation...')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#98A2B3]">
                    <Clock size={12} />
                    {format(new Date(chat.lastMessageAt), 'MMM d, HH:mm')}
                  </div>
                  <ChevronRight size={18} className="text-[#D0D5DD] group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-semibold text-[#101828]">No conversations found</h3>
            <p className="text-sm text-[#475467] max-w-sm mt-1">
              {searchQuery ? "We couldn't find any chats matching your search. Try a different query." : "There are currently no active conversations in this category."}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {(chatsData?.meta?.totalPages ?? 0) > 1 && (
         <div className="flex justify-center pt-4">
            <p className="text-xs text-gray-400 font-medium">Pagination logic to be expanded...</p>
         </div>
      )}
    </div>
  );
};

export default AdminChatList;
