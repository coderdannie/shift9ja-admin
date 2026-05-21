import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageCircle, Paperclip, CheckCheck, ChevronLeft, UserX, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PRIVATE_PATHS } from '../../../routes/constants';
import { socketService } from '../../../services/socketService';
import {
  useGetInfiniteChatMessages,
  useGetCloudinarySignature,
  useClaimChat,
  useGetAdminChats,
} from '../../../services/query/chat';
import type { Chat, ChatMessage } from '../../../types/chat';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  conversationUuid: string;
  title?: string;
  onBack?: () => void;
  chat?: Chat;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationUuid, title = 'Chat Session', onBack, chat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to read chat from location state
  const routedChat = (location.state as any)?.chat as Chat | undefined;
  
  // Try to find the chat in the list if not passed via props or state (e.g. on direct page refresh)
  const { data: chatsData } = useGetAdminChats();
  const cachedChat = chatsData?.data?.find(c => c.uuid === conversationUuid);
  
  const activeChat = chat ?? routedChat ?? cachedChat;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef<number>(0);

  const adminUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const { data: signatureData } = useGetCloudinarySignature();

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteChatMessages(conversationUuid, 50);

  const { mutate: claimChat, isPending: isClaiming } = useClaimChat();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Sync history to local state
  useEffect(() => {
    if (historyData?.pages) {
      const historicalMessages = historyData.pages.flatMap(page => page.data);
      setMessages(prev => {
        const map = new Map<string, ChatMessage>();
        historicalMessages.forEach(msg => {
          map.set(msg.uuid || (msg.tempId as string), msg);
        });
        prev.forEach(msg => {
          const id = msg.uuid || (msg.tempId as string);
          if (!map.has(id) || msg.status === 'pending') {
            map.set(id, msg);
          }
        });
        return Array.from(map.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });

      if (isInitialLoad.current && historicalMessages.length > 0) {
        setTimeout(scrollToBottom, 200);
        isInitialLoad.current = false;
      } else if (scrollRef.current && prevScrollHeight.current > 0) {
        const newHeight = scrollRef.current.scrollHeight;
        const diff = newHeight - prevScrollHeight.current;
        scrollRef.current.scrollTop = diff;
        prevScrollHeight.current = 0;
      }
    }
  }, [historyData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      prevScrollHeight.current = target.scrollHeight;
      fetchNextPage();
    }
  };

  // Socket connection
  useEffect(() => {
    if (!conversationUuid) return;
    socketService.connect();
    socketService.joinRoom(conversationUuid);

    const handleIncomingMessage = (msg: ChatMessage) => {
      setMessages(prev => {
        const uuidIdx = prev.findIndex(m => m.uuid === msg.uuid);
        if (uuidIdx !== -1) {
          const next = [...prev];
          next[uuidIdx] = msg;
          return next;
        }
        const pendingIdx = prev.findIndex(
          m => (msg.tempId && m.tempId === msg.tempId) || (m.status === 'pending' && m.content === msg.content)
        );
        if (pendingIdx !== -1) {
          const next = [...prev];
          next[pendingIdx] = { ...msg };
          return next;
        }
        if (prev.some(m => m.uuid === msg.uuid)) return prev;
        return [...prev, msg];
      });
      setTimeout(scrollToBottom, 50);
    };

    const handleTyping = ({ conversationUuid: msgUuid, isTyping: typing }: any) => {
      if (msgUuid === conversationUuid) setIsTyping(typing);
    };

    socketService.on('new_message', handleIncomingMessage);
    socketService.on('messageSent', handleIncomingMessage);
    socketService.on('typing', handleTyping);

    return () => {
      socketService.off('new_message', handleIncomingMessage);
      socketService.off('messageSent', handleIncomingMessage);
      socketService.off('typing', handleTyping);
    };
  }, [conversationUuid]);

  const handleSend = () => {
    if (!inputText.trim() || !conversationUuid) return;
    const content = inputText.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      uuid: tempId,
      tempId,
      content,
      type: 'text',
      createdAt: new Date().toISOString(),
      senderType: 'ADMIN',
      senderAdmin: { firstName: adminUser?.firstName || 'Admin', lastName: adminUser?.lastName || '' },
      status: 'pending',
    } as any;
    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);
    setInputText('');
    socketService.sendMessage({ conversationUuid, content, type: 'text', tempId });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationUuid || !signatureData?.data) return;
    setIsUploading(true);
    const { signature, timestamp, api_key, cloud_name } = signatureData.data;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', 'chats');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        socketService.sendMessage({ conversationUuid, content: data.secure_url, type: 'image', tempId: `temp-img-${Date.now()}` });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClaim = async () => {
    if (!activeChat) return;
    try {
      await claimChat(activeChat.uuid);
    } catch (err) {
      console.error('Failed to claim chat:', err);
    }
  };

  const renderClaimBanner = () => {
    if (!activeChat) return null;
    const unassigned = !activeChat.admin && (activeChat.type === 'support' || activeChat.type === 'dispute');
    if (!unassigned) return null;
    return (
      <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">Unassigned Support Ticket</p>
            <p className="text-xs text-amber-600 font-medium">Claim this ticket to start replying to the user.</p>
          </div>
        </div>
        <button
          onClick={handleClaim}
          disabled={isClaiming}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          {isClaiming ? 'Claiming...' : 'Claim Ticket'}
        </button>
      </div>
    );
  };

  const renderHeader = () => {
    const chatTitle = activeChat?.client ? `${activeChat.client.firstName} ${activeChat.client.lastName}` : title;
    
    let subtitle = 'Active Chat';
    let typeIcon = <MessageCircle size={20} />;
    
    if (activeChat?.type === 'support') {
      subtitle = 'Support Ticket';
      typeIcon = <HelpCircle size={20} />;
    } else if (activeChat?.type === 'dispute') {
      subtitle = 'Dispute Resolution';
      typeIcon = <AlertCircle size={20} />;
    }

    return (
      <div className="px-4 md:px-6 py-3 md:py-3.5 bg-white border-b border-[#F2F4F7] flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => (onBack ? onBack() : navigate(PRIVATE_PATHS.ADMIN_CHATS))} className="md:hidden p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            {typeIcon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101828]">{chatTitle}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50/30">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-[#475467]">Loading conversation...</p>
      </div>
    );
  }

  // A support/dispute chat cannot be replied to until claimed/assigned
  const isReadOnly = activeChat && !activeChat.admin && (activeChat.type === 'support' || activeChat.type === 'dispute');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5] h-full border-l border-[#EAECF0]">
      {renderHeader()}
      {renderClaimBanner()}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ backgroundImage: `radial-gradient(#d1d1d1 0.5px, transparent 0.5px)`, backgroundSize: '20px 20px' }}
      >
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderType === 'ADMIN';
          const senderName = msg.adminSender
            ? `${msg.adminSender.firstName} ${msg.adminSender.lastName}`
            : msg.senderAdmin
            ? `${msg.senderAdmin.firstName} ${msg.senderAdmin.lastName}`
            : msg.sender
            ? `${msg.sender.firstName} ${msg.sender.lastName}`
            : 'User';

          return (
            <div key={msg.uuid || msg.tempId} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-[10px] text-gray-500 font-bold ml-1">{senderName}</span>
                )}
                <div
                  className={`p-3 rounded-2xl text-[13px] shadow-sm relative ${
                    isMe
                      ? 'bg-[#dcf8c6] text-[#101828] rounded-tr-none border border-[#c3e6a0]'
                      : 'bg-white text-[#101828] border border-[#F2F4F7] rounded-tl-none'
                  }`}
                >
                  {msg.type === 'image' ? (
                    <img src={msg.content} alt="Attachment" className="max-w-full rounded-lg cursor-pointer" onClick={() => window.open(msg.content, '_blank')} />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div className={`flex items-center gap-1.5 text-[9px] mt-1 font-medium ${isMe ? 'justify-end text-[#667781]' : 'justify-start text-[#667781]'}`}>
                    {format(new Date(msg.createdAt), 'HH:mm')}
                    {isMe && <CheckCheck size={12} className={msg.status === 'sent' ? 'text-blue-500' : 'text-[#667781]'} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl border border-[#F2F4F7] flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#f0f2f5] border-t border-[#F2F4F7] z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {isReadOnly ? (
          <div className="flex items-center justify-center p-3 bg-gray-100 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <UserX size={14} />
              Claim this ticket to start sending messages
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-2 text-[#667085] hover:text-primary transition-colors shrink-0">
              {isUploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <Paperclip size={22} />}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-transparent focus-within:border-primary/20 transition-all flex items-center px-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none text-sm py-3"
              />
            </div>
            <button onClick={handleSend} disabled={!inputText.trim()} className={`p-3 rounded-full transition-all shadow-md ${inputText.trim() ? 'bg-primary text-white hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400'}`}>
              <Send size={20} fill={inputText.trim() ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
