import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Loader2,
  PanelRightOpen,
  Send,
  Sparkles,
  UserCheck,
  UserX,
  X,
  XCircle,
} from 'lucide-react';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../../routes/constants';
import { supportSocketService } from '../../../services/supportSocketService';
import {
  useGetInfiniteSupportMessages,
  useGetSupportSession,
  useSuggestReply,
  useClaimSession,
  useResolveSession,
  useReturnSessionToBot,
} from '../../../services/query/support';
import type { SessionStatus, SupportMessage, SupportSession } from '../../../types/support';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../services/queryKeys';

interface Props {
  sessionUuid: string;
  onBack?: () => void;
}

const statusConfig: Record<
  SessionStatus,
  { label: string; bgColor: string; textColor: string; borderColor: string; icon: React.ReactNode }
> = {
  BOT_ACTIVE: {
    label: 'AI Handling',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: <Bot size={16} />,
  },
  ESCALATED: {
    label: 'Escalated — Needs Admin',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: <AlertTriangle size={16} />,
  },
  ADMIN_ACTIVE: {
    label: 'Admin Active',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: <UserCheck size={16} />,
  },
  RESOLVED: {
    label: 'Resolved',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: <CheckCircle2 size={16} />,
  },
  CLOSED: {
    label: 'Session Closed',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-200',
    icon: <CheckCircle2 size={16} />,
  },
};

const SupportSessionInterface: React.FC<Props> = ({ sessionUuid, onBack }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showCopilot, setShowCopilot] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [isTypingBot, setIsTypingBot] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // ── Remote data ─────────────────────────────────────────────────────────────
  const { data: sessionData, isLoading: isLoadingSession } = useGetSupportSession(sessionUuid);
  const session = (sessionData as any)?.data as SupportSession | undefined;

  const adminUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  // Clear pending action when session status changes from backend/socket
  useEffect(() => {
    setPendingAction(null);
  }, [session?.status]);

  const {
    data: historyData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteSupportMessages(sessionUuid, 30);

  const { mutate: claimSession } = useClaimSession();
  const { mutate: resolveSession } = useResolveSession();
  const { mutate: returnSessionToBot } = useReturnSessionToBot();
  const { mutate: suggestReply, isPending: isSuggesting } = useSuggestReply();

  // ── Scroll helpers ──────────────────────────────────────────────────────────
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // ── Sync history to local state ─────────────────────────────────────────────
  useEffect(() => {
    if (historyData?.pages) {
      const historical = historyData.pages.flatMap((p) => p.data);
      setMessages((prev) => {
        const map = new Map<string, SupportMessage>();
        historical.forEach((m) => map.set(m.uuid || (m.tempId as string), m));
        prev.forEach((m) => {
          const id = m.uuid || (m.tempId as string);
          if (!map.has(id) || m.status === 'pending') map.set(id, m);
        });
        return Array.from(map.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });

      if (isInitialLoad.current && historical.length > 0) {
        setTimeout(scrollToBottom, 200);
        isInitialLoad.current = false;
      } else if (scrollRef.current && prevScrollHeight.current > 0) {
        const diff = scrollRef.current.scrollHeight - prevScrollHeight.current;
        scrollRef.current.scrollTop = diff;
        prevScrollHeight.current = 0;
      }
    }
  }, [historyData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const t = e.currentTarget;
    if (t.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      prevScrollHeight.current = t.scrollHeight;
      fetchNextPage();
    }
  };

  // ── Socket ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionUuid) return;
    supportSocketService.connect();
    supportSocketService.joinSession(sessionUuid);

    const handleNewMessage = (msg: SupportMessage) => {
      setIsTypingBot(false);
      setMessages((prev) => {
        const uuidIdx = prev.findIndex((m) => m.uuid === msg.uuid);
        if (uuidIdx !== -1) {
          const next = [...prev];
          next[uuidIdx] = msg;
          return next;
        }
        const pendingIdx = prev.findIndex(
          (m) =>
            (msg.tempId && m.tempId === msg.tempId) ||
            (m.status === 'pending' && m.content === msg.content),
        );
        if (pendingIdx !== -1) {
          const next = [...prev];
          next[pendingIdx] = { ...msg };
          return next;
        }
        if (prev.some((m) => m.uuid === msg.uuid)) return prev;
        return [...prev, msg];
      });
      setTimeout(scrollToBottom, 50);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS] });
    };

    const handleSessionUpdated = () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SUPPORT_SESSION, sessionUuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS] });
    };

    // Listen with correct spec event names
    supportSocketService.on('new_message', handleNewMessage);
    supportSocketService.on('session_updated', handleSessionUpdated);

    return () => {
      supportSocketService.off('new_message', handleNewMessage);
      supportSocketService.off('session_updated', handleSessionUpdated);
      supportSocketService.leaveSession?.(sessionUuid);
    };
  }, [sessionUuid, queryClient]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!inputText.trim()) return;
    const content = inputText.trim();
    const tempId = `temp-${Date.now()}`;
    const optimistic: SupportMessage = {
      uuid: tempId,
      tempId,
      content,
      type: 'text',
      senderType: 'ADMIN',
      adminSender: {
        uuid: adminUser?.uuid || '',
        firstName: adminUser?.firstName || 'Admin',
        lastName: adminUser?.lastName || '',
      },
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setMessages((prev) => [...prev, optimistic]);
    setInputText('');
    setTimeout(scrollToBottom, 50);
    // Use spec-correct event: admin_message
    supportSocketService.sendAdminMessage(
      sessionUuid,
      content,
    );
  };

  const handleTakeover = async () => {
    setPendingAction('takeover');
    claimSession(sessionUuid, {
      onSuccess: () => {
        toast.success('Taking over session...');
        setPendingAction(null);
      },
      onError: () => {
        toast.error('Failed to take over session');
        setPendingAction(null);
      }
    });
  };

  const handleClose = async () => {
    setPendingAction('close');
    resolveSession({ uuid: sessionUuid, summary: resolution }, {
      onSuccess: () => {
        toast.success('Session closed successfully.');
        setShowCloseModal(false);
        setPendingAction(null);
      },
      onError: () => {
        toast.error('Failed to close session');
        setPendingAction(null);
      }
    });
  };

  const handleReturnToBot = async () => {
    setPendingAction('return_to_bot');
    returnSessionToBot(sessionUuid, {
      onSuccess: () => {
        toast.success('Returning session to Bot...');
        setPendingAction(null);
      },
      onError: () => {
        toast.error('Failed to return session to bot');
        setPendingAction(null);
      }
    });
  };

  const handleSuggest = () => {
    suggestReply(sessionUuid, {
      onSuccess: (data: any) => {
        const draft = data?.data?.draft;
        if (draft) {
          setInputText(draft);
          setShowCopilot(false);
          toast.success('Draft suggestion ready!');
        }
      },
      onError: () => toast.error('Could not generate suggestion.'),
    });
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const isClosed = session?.status === 'CLOSED';
  const isAdminActive = session?.status === 'ADMIN_ACTIVE';
  const isEscalated = session?.status === 'ESCALATED';
  const isBotActive = session?.status === 'BOT_ACTIVE';
  const canSend = isAdminActive;
  const canTakeover = isEscalated || isBotActive;
  const canClose = isEscalated || isAdminActive;

  if (isLoadingSession || isLoadingMessages) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50/30">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-[#475467]">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50/30">
        <XCircle className="w-12 h-12 text-gray-300" />
        <p className="text-sm font-medium text-[#475467]">Session not found.</p>
      </div>
    );
  }

  const cfg = statusConfig[session.status];

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* ── Main chat area ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">

        {/* Header */}
        <div className="px-4 md:px-5 py-3 bg-white border-b border-[#F2F4F7] flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onBack ? onBack() : navigate(PRIVATE_PATHS.SUPPORT_SESSIONS)
              }
              className="md:hidden p-1 -ml-1 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 font-bold text-sm">
              {session.userAvatar ? (
                <img
                  src={session.userAvatar}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              ) : (
                session.userName?.[0] || '?'
              )}
            </div>
            <div>
              <h3
                onClick={() =>
                  session.userUuid && navigate(`/user-management/${session.userUuid}`)
                }
                className="text-sm font-bold text-[#101828] cursor-pointer hover:underline hover:text-primary transition-colors"
              >
                {session.userName || 'Unknown User'}
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}`}
                >
                  {cfg.icon}
                  {cfg.label}
                </span>
                {session.sessionId && (
                  <span className="text-[10px] text-gray-400 font-mono">
                    {session.sessionId}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {canTakeover && (
              <button
                onClick={handleTakeover}
                disabled={pendingAction === 'takeover'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white text-xs font-bold rounded-xl transition-all shadow-sm min-w-[100px] justify-center"
              >
                {pendingAction === 'takeover' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <UserX size={13} />
                )}
                {pendingAction === 'takeover' ? 'Taking Over...' : 'Take Over'}
              </button>
            )}
            {(isAdminActive || isEscalated) && (
              <button
                onClick={handleReturnToBot}
                disabled={pendingAction === 'return_to_bot'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-xs font-bold rounded-xl transition-all shadow-sm min-w-[110px] justify-center"
              >
                {pendingAction === 'return_to_bot' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Bot size={13} />
                )}
                {pendingAction === 'return_to_bot' ? 'Returning...' : 'Return to Bot'}
              </button>
            )}
            {canClose && (
              <button
                onClick={() => setShowCloseModal(true)}
                disabled={pendingAction === 'close'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-70 text-white text-xs font-bold rounded-xl transition-all shadow-sm min-w-[80px] justify-center"
              >
                {pendingAction === 'close' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <XCircle size={13} />
                )}
                {pendingAction === 'close' ? 'Closing...' : 'Close'}
              </button>
            )}
            <button
              onClick={() => setShowCopilot(!showCopilot)}
              className={`p-2 rounded-xl border transition-all ${
                showCopilot
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
              title="Admin Copilot"
            >
              <PanelRightOpen size={16} />
            </button>
          </div>
        </div>

        {/* Escalation banner */}
        {isEscalated && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center gap-3 z-10">
            <div className="p-1.5 bg-red-100 rounded-lg text-red-600 animate-bounce">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-red-700">User requested human support</p>
              <p className="text-[10px] text-red-500">
                Click "Take Over" to mute the AI and start responding directly.
              </p>
            </div>
          </div>
        )}

        {/* Closed banner */}
        {isClosed && (
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-gray-400" />
            <p className="text-xs text-gray-500 font-medium">
              This session was closed on{' '}
              {session.closedAt
                ? format(new Date(session.closedAt), 'MMM d, yyyy HH:mm')
                : 'N/A'}
            </p>
          </div>
        )}

        {/* AI summary banner (if available after escalation) */}
        {session.aiSummary && (isEscalated || isAdminActive) && (
          <div className="bg-purple-50 border-b border-purple-100 px-5 py-3 flex items-start gap-3">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600 shrink-0 mt-0.5">
              <Sparkles size={14} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wide mb-0.5">
                AI Session Summary
              </p>
              <p className="text-xs text-purple-800 leading-relaxed">{session.aiSummary}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
          style={{
            backgroundImage: `radial-gradient(#d1d1d1 0.5px, transparent 0.5px)`,
            backgroundSize: '20px 20px',
          }}
        >
          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          )}

          {messages.map((msg, index) => {
            const isMe = msg.senderType === 'ADMIN';
            const isBot = msg.senderType === 'BOT';
            const isSystem = msg.senderType === 'SYSTEM';

            const senderName = msg.adminSender
              ? `Admin Agent (${msg.adminSender.firstName})`
              : msg.sender
                ? `${msg.sender.firstName} ${msg.sender.lastName}`
                : isBot
                  ? 'AI Support Bot'
                  : 'User';

            // Date divider
            let dateDivider: React.ReactNode = null;
            const currentDate = msg.createdAt;
            const prevDate = index > 0 ? messages[index - 1].createdAt : null;
            if (currentDate) {
              const current = new Date(currentDate);
              const prev = prevDate ? new Date(prevDate) : null;
              if (!prev || !isSameDay(current, prev)) {
                let label = format(current, 'MMMM d, yyyy');
                if (isToday(current)) label = 'Today';
                else if (isYesterday(current)) label = 'Yesterday';
                dateDivider = (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/80 backdrop-blur-sm border border-gray-200 text-[#4a4a4a] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                      {label}
                    </span>
                  </div>
                );
              }
            }

            // System message style
            if (isSystem) {
              return (
                <React.Fragment key={msg.uuid || msg.tempId}>
                  {dateDivider}
                  <div className="flex justify-center">
                    <span className="bg-[#F1F5F9] border border-gray-200 text-gray-500 text-[10px] font-semibold px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={msg.uuid || msg.tempId}>
                {dateDivider}
                <div
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div
                    className={`max-w-[78%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && (
                      <div className="flex items-center gap-1.5 ml-1">
                        {isBot && (
                          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bot size={10} className="text-blue-600" />
                          </div>
                        )}
                        <span className="text-[10px] text-gray-500 font-bold">
                          {senderName}
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-[13px] shadow-sm relative group ${
                        isMe
                          ? 'bg-[#EFF6FF] text-[#101828] rounded-tr-none border border-blue-100' // Admin: Light Blue
                          : isBot
                            ? 'bg-[#F1F5F9] text-[#101828] border border-gray-200 rounded-tl-none' // Bot: Neutral Grey
                            : 'bg-[#008751] text-white rounded-tl-none' // User: Green
                      }`}
                    >
                      <p
                        className="leading-relaxed whitespace-pre-wrap"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {msg.content}
                      </p>
                      <div
                        className={`flex items-center gap-1.5 text-[9px] mt-1 font-medium ${
                          isMe || isBot ? 'justify-end text-[#667781]' : 'justify-start text-white/80'
                        }`}
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            toast.success('Copied!');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/5 rounded text-gray-400"
                          title="Copy"
                        >
                          <Copy size={11} />
                        </button>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Bot typing indicator */}
          {isTypingBot && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 ml-1 mb-1">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot size={10} className="text-blue-600" />
                </div>
                <span className="text-[10px] text-gray-500 font-bold">AI Support Bot</span>
              </div>
              <div className="bg-[#F1F5F9] border border-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none ml-1 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#f0f2f5] border-t border-[#F2F4F7] z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {isClosed ? (
            <div className="flex items-center justify-center p-3 bg-gray-100 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                This session is closed
              </p>
            </div>
          ) : !canSend ? (
            <div className="flex items-center justify-center p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-700 font-bold flex items-center gap-1.5">
                <UserX size={14} />
                {isEscalated ? 'Take over the session to reply' : 'AI is handling this session'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-transparent focus-within:border-primary/20 transition-all flex items-center px-4">
                <input
                  type="text"
                  placeholder="Type your response..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-3"
                  spellCheck
                  autoCorrect="on"
                  autoCapitalize="sentences"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`p-3 rounded-full transition-all shadow-md shrink-0 flex items-center justify-center ${
                  inputText.trim()
                    ? 'bg-primary text-white hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send
                  size={20}
                  fill={inputText.trim() ? 'currentColor' : 'none'}
                  className="pointer-events-none"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Copilot Panel ────────────────────────────────────────────────────── */}
      {showCopilot && (
        <div className="w-[300px] border-l border-[#EAECF0] bg-white flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-[#F2F4F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles size={14} />
              </div>
              <span className="text-sm font-bold text-[#101828]">Admin Copilot</span>
            </div>
            <button
              onClick={() => setShowCopilot(false)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* AI Summary section */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                Session Summary
              </p>
              {session.aiSummary ? (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                  <p className="text-xs text-purple-800 leading-relaxed">{session.aiSummary}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">
                    Summary available after escalation.
                  </p>
                </div>
              )}
            </div>

            {/* User context */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                User Context
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold text-[#101828]">
                    {session.userName || 'Unknown User'}
                  </span>
                </div>
                {session.escalatedAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Escalated</span>
                    <span className="font-semibold text-red-600">
                      {format(new Date(session.escalatedAt), 'HH:mm')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Suggest reply */}
            {canSend && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                  Suggest Reply
                </p>
                <button
                  onClick={handleSuggest}
                  disabled={isSuggesting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {isSuggesting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Generate Draft Response
                    </>
                  )}
                </button>
                <p className="text-[9px] text-gray-400 mt-1 text-center">
                  AI will analyze context and suggest a response
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Close Session Modal ─────────────────────────────────────────────── */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <XCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Close Support Session</h3>
                <p className="text-xs text-[#475467]">
                  {session.sessionId} — {session.userName || 'Unknown User'}
                </p>
              </div>
            </div>

            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Resolution Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe how this issue was resolved..."
              rows={4}
              className="w-full border border-[#EAECF0] rounded-xl px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-2.5 border border-[#EAECF0] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} />
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportSessionInterface;
