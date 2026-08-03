import React, { useState } from "react";
import { format } from "date-fns";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Headphones,
  MessageSquareDashed,
  Search,
  User as UserIcon,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRIVATE_PATHS } from "../../../routes/constants";
import { useGetSupportSessions } from "../../../services/query/support";
import type { SessionStatus, SupportSession } from "../../../types/support";

interface Props {
  activeId?: string;
}

const statusConfig: Record<
  SessionStatus,
  { label: string; color: string; icon: React.ReactNode; sortPriority: number }
> = {
  ESCALATED: {
    label: "Escalated",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <AlertTriangle size={10} />,
    sortPriority: 0,
  },
  BOT_ACTIVE: {
    label: "AI Active",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Bot size={10} />,
    sortPriority: 1,
  },
  ADMIN_ACTIVE: {
    label: "Admin Active",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <UserCheck size={10} />,
    sortPriority: 2,
  },
  RESOLVED: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={10} />,
    sortPriority: 3,
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    icon: <CheckCircle2 size={10} />,
    sortPriority: 4,
  },
};

const filterTabs: { label: string; value: SessionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Escalated", value: "ESCALATED" },
  { label: "AI Active", value: "BOT_ACTIVE" },
  { label: "Admin", value: "ADMIN_ACTIVE" },
  { label: "Closed", value: "CLOSED" },
];

const SupportSessionList: React.FC<Props> = ({ activeId }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSupportSessions({
    limit: 20,
  });

  const sessions: SupportSession[] = React.useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.data) ?? [];
    const unique = new Map<string, SupportSession>();
    // Guard against undefined entries if page shape is unexpected
    flat.filter(Boolean).forEach((s) => unique.set(s.uuid, s));

    return Array.from(unique.values())
      .filter((s) => {
        // Status filter — applied client-side to avoid backend param issues
        if (statusFilter !== "all" && s.status !== statusFilter) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const name = `${s.userName || ''}`.toLowerCase();
        return (
          name.includes(q) ||
          s.sessionId?.toLowerCase().includes(q) ||
          s.lastMessage?.content?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const pa = statusConfig[a.status]?.sortPriority ?? 99;
        const pb = statusConfig[b.status]?.sortPriority ?? 99;
        if (pa !== pb) return pa - pb;
        return (
          new Date(b.lastMessageAt || b.createdAt).getTime() -
          new Date(a.lastMessageAt || a.createdAt).getTime()
        );
      });
  }, [data, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full bg-white border-r border-[#EAECF0]">
        {/* Keep the header visible so layout doesn't collapse */}
        <div className="p-4 border-b border-[#F2F4F7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Headphones size={18} />
            </div>
            <h2 className="text-sm font-bold text-[#101828]">
              Support Sessions
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-3">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Headphones size={22} />
          </div>
          <p className="text-sm font-semibold text-[#101828]">
            Endpoint not yet available
          </p>
          <p className="text-xs text-[#475467] max-w-[200px] leading-relaxed">
            The{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">
              GET /admin/support/sessions
            </code>{" "}
            backend endpoint is pending implementation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#EAECF0]">
      {/* Header */}
      <div className="p-4 border-b border-[#F2F4F7] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Headphones size={18} />
          </div>
          <h2 className="text-sm font-bold text-[#101828]">Support Sessions</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-[#EAECF0] rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                statusFilter === tab.value
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {sessions.length > 0 ? (
          <div className="divide-y divide-[#F2F4F7]">
            {sessions.map((session) => {
              const cfg = statusConfig[session.status];
              const isEscalated = session.status === "ESCALATED";
              const isActive = activeId === session.uuid;

              return (
                <div
                  key={session.uuid}
                  onClick={() =>
                    navigate(
                      `${PRIVATE_PATHS.SUPPORT_SESSIONS}/${session.uuid}`,
                    )
                  }
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-all group border-l-4 ${
                    isActive
                      ? "bg-white border-primary shadow-sm"
                      : isEscalated
                        ? "border-red-400 bg-red-50/40 hover:bg-red-50/70 animate-[pulse_2s_ease-in-out_infinite]"
                        : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm border-2 border-white shadow-sm">
                      {session?.userAvatar ? (
                        <img
                          src={session.userAvatar}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        session?.userName?.[0] || <UserIcon size={16} />
                      )}
                    </div>
                    {(session.unreadCount || 0) > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-[#101828]"}`}
                      >
                        {session?.userName || 'Unknown User'}
                      </h4>
                      <span className="text-[10px] text-[#98A2B3] whitespace-nowrap ml-1">
                        {session.lastMessageAt
                          ? format(new Date(session.lastMessageAt), "HH:mm")
                          : format(new Date(session.createdAt), "HH:mm")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${cfg.color}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                      {session.sessionId && (
                        <span className="text-[9px] text-gray-400 font-mono">
                          {session.sessionId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <p
                        className={`text-[11px] truncate flex-1 ${
                          (session.unreadCount || 0) > 0
                            ? "text-[#101828] font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {session.lastMessage?.content || "Session started..."}
                      </p>
                      {isActive && (
                        <ChevronRight
                          size={13}
                          className="text-primary shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <MessageSquareDashed size={28} />
            </div>
            <h3 className="text-sm font-semibold text-[#101828]">
              No sessions found
            </h3>
            <p className="text-xs text-[#475467] mt-1">
              {searchQuery
                ? "Try a different search term."
                : "No support sessions in this category."}
            </p>
          </div>
        )}

        {hasNextPage && (
          <div className="p-4 flex justify-center border-t border-[#F2F4F7]">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-white border border-[#EAECF0] text-[11px] font-bold rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportSessionList;
