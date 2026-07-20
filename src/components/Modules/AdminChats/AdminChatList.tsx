import { format } from "date-fns";
import {
  AlertCircle,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Search,
  User as UserIcon,
  UserX,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PRIVATE_PATHS } from "../../../routes/constants";
import {
  useGetInfiniteAdminChats,
  useMarkChatAsRead,
} from "../../../services/query/chat";
import type { Chat } from "../../../types/chat";

interface AdminChatListProps {
  activeId?: string;
}

const AdminChatList: React.FC<AdminChatListProps> = ({ activeId }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as "all" | "task" | "dispute" | "support") || "all";
  
  const setActiveTab = (tab: "all" | "task" | "dispute" | "support") => {
    setSearchParams(prev => {
      if (tab === "all") prev.delete("tab");
      else prev.set("tab", tab);
      return prev;
    }, { replace: true });
  };

  const [assignmentTab, setAssignmentTab] = useState<'unassigned' | 'my_chats' | 'all'>('unassigned');
  const [searchQuery, setSearchQuery] = useState("");

  const isAll = activeTab === "all";

  const { 
    data: chatsData, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetInfiniteAdminChats(
    { 
      type: isAll ? undefined : activeTab, 
      assignment: activeTab === 'support' ? assignmentTab : undefined,
      limit: 15 
    }
  );

  const { mutate: markAsRead } = useMarkChatAsRead();

  const handleChatClick = (chat: Chat) => {
    if (chat.unreadCount > 0) {
      markAsRead(chat.uuid);
    }
    // Pass the full chat object as router state so ChatInterface can use it
    navigate(`${PRIVATE_PATHS.ADMIN_CHATS}/${chat.uuid}?${searchParams.toString()}`, {
      state: { chat },
    });
  };

  const getMergedChats = (): Chat[] => {
    const allList = chatsData?.pages.flatMap(page => page.data) || [];

    const uniqueMap = new Map<string, Chat>();
    allList.forEach((chat: Chat) => {
      uniqueMap.set(chat.uuid, chat);
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : (a.client?.lastSeen ? new Date(a.client.lastSeen).getTime() : 0);
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : (b.client?.lastSeen ? new Date(b.client.lastSeen).getTime() : 0);
      return timeB - timeA;
    });
  };

  const chatsList = getMergedChats();

  const filteredChats =
    chatsList.filter((chat: Chat) => {
      const searchLower = searchQuery.toLowerCase();
      const clientName = chat.client
        ? `${chat.client.firstName} ${chat.client.lastName}`.toLowerCase()
        : "";
      const helperName = chat.helper
        ? `${chat.helper.firstName} ${chat.helper.lastName}`.toLowerCase()
        : "";
      const reason = chat.dispute?.reason?.toLowerCase() || "";
      const taskTitle = chat.task?.title?.toLowerCase() || "";

      return (
        clientName.includes(searchLower) ||
        helperName.includes(searchLower) ||
        reason.includes(searchLower) ||
        taskTitle.includes(searchLower)
      );
    }) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dispute":
        return <AlertCircle className="text-red-500" size={16} />;
      case "support":
        return <HelpCircle className="text-blue-500" size={16} />;
      default:
        return <MessageCircle className="text-green-500" size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dispute":
        return "Dispute";
      case "support":
        return "Support";
      case "task":
        return "Task";
      default:
        return type;
    }
  };

  // A chat is "unassigned" when it has no admin and is a claimable type
  const isUnassigned = (chat: Chat) =>
    !chat.admin && (chat.type === "support" || chat.type === "dispute");

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      const savedScroll = sessionStorage.getItem("adminChatListScroll");
      if (savedScroll) {
        scrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, []); // Run once on mount

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem("adminChatListScroll", e.currentTarget.scrollTop.toString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#EAECF0]">
      {/* Search and Tabs */}
      <div className="p-4 space-y-4 border-b border-[#F2F4F7]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#EAECF0] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {(["all", "dispute", "support", "task"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize whitespace-nowrap transition-all
                ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab === "all" ? "All" : tab}
            </button>
          ))}
        </div>

        {activeTab === 'support' && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F2F4F7]">
            {(['unassigned', 'my_chats', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAssignmentTab(tab)}
                className={`
                  flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold capitalize transition-all border
                  ${
                    assignmentTab === tab
                      ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat History List */}
      <div 
        ref={scrollRef}
        onScroll={handleListScroll}
        className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/30 flex flex-col"
      >
        {filteredChats.length > 0 ? (
          <div className="divide-y divide-[#F2F4F7]">
            {filteredChats.map((chat) => {
              const unassigned = isUnassigned(chat);
              return (
                <div
                  key={chat.uuid}
                  onClick={() => handleChatClick(chat)}
                  className={`
                    p-4 flex items-center justify-between hover:bg-white cursor-pointer transition-all group border-l-4
                    ${
                      activeId === chat.uuid
                        ? "bg-white border-primary shadow-sm"
                        : unassigned
                        ? "border-amber-400 bg-amber-50/40 hover:bg-amber-50/70"
                        : "border-transparent hover:border-gray-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-base border-2 border-white shadow-sm">
                        {chat.client?.avatarUrl ? (
                          <img
                            src={chat.client.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          chat.client?.firstName?.[0] || <UserIcon size={18} />
                        )}
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4
                          className={`text-xs font-bold truncate ${activeId === chat.uuid ? "text-primary" : "text-[#101828]"}`}
                        >
                          {chat.client
                            ? `${chat.client.firstName} ${chat.client.lastName}`
                            : "System Chat"}
                        </h4>
                        <span className="text-[10px] text-[#98A2B3] font-medium whitespace-nowrap">
                          {chat.lastMessageAt ? format(new Date(chat.lastMessageAt), "HH:mm") : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        {getTypeIcon(chat.type)}
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                          {getTypeLabel(chat.type)}
                        </span>
                        {/* Unassigned badge */}
                        {unassigned && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wide border border-amber-200">
                            <UserX size={9} />
                            Unassigned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <p
                          className={`text-[11px] truncate flex-1 ${chat.unreadCount > 0 ? "text-[#101828] font-bold" : "text-gray-500"}`}
                        >
                          {chat.lastMessage?.content ||
                            (chat.dispute?.reason
                              ? `Re: ${chat.dispute.reason}`
                              : "Start the conversation...")}
                        </p>
                        {activeId === chat.uuid && (
                          <ChevronRight
                            size={14}
                            className="text-primary shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-semibold text-[#101828]">
              No conversations found
            </h3>
            <p className="text-sm text-[#475467] max-w-sm mt-1">
              {searchQuery
                ? "We couldn't find any chats matching your search. Try a different query."
                : "There are currently no active conversations in this category."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {hasNextPage && (
          <div className="p-4 flex justify-center mt-auto border-t border-[#F2F4F7]">
            <button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-white border border-[#EAECF0] text-[11px] font-bold rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
                  Loading...
                </>
              ) : 'Load older chats'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatList;
