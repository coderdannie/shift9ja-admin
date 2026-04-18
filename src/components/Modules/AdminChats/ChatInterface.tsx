import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Loader2, 
  MessageCircle,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { socketService } from '../../../services/socketService';
import { 
  useGetInfiniteChatMessages, 
  useGetCloudinarySignature
} from '../../../services/query/chat';
import type { ChatMessage } from '../../../types/chat';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  conversationUuid: string;
  title?: string;
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  conversationUuid, 
  title = "Chat Session",
  onBack 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef<number>(0);

  // Get current admin info from session
  const adminUser = JSON.parse(sessionStorage.getItem("user") || "null");
  const { data: signatureData } = useGetCloudinarySignature();

  // History query (infinite scroll)
  const { 
    data: historyData, 
    isLoading: isLoadingHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetInfiniteChatMessages(conversationUuid, 50);

  // Scroll to bottom helper
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
        const messageMap = new Map<string, ChatMessage>();
        historicalMessages.forEach(msg => {
          messageMap.set(msg.uuid || (msg.tempId as string), msg);
        });
        prev.forEach(msg => {
          const id = msg.uuid || (msg.tempId as string);
          if (!messageMap.has(id) || msg.status === 'pending') {
            messageMap.set(id, msg);
          }
        });
        const merged = Array.from(messageMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return merged;
      });

      if (isInitialLoad.current && historicalMessages.length > 0) {
        setTimeout(scrollToBottom, 200);
        isInitialLoad.current = false;
      } else if (scrollRef.current && prevScrollHeight.current > 0) {
        const newScrollHeight = scrollRef.current.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeight.current;
        scrollRef.current.scrollTop = heightDiff;
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

  // Connect to socket
  useEffect(() => {
    if (!conversationUuid) return;
    
    socketService.connect();
    socketService.joinRoom(conversationUuid);

    const handleIncomingMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        const uuidIndex = prev.findIndex((m) => m.uuid === msg.uuid);
        if (uuidIndex !== -1) {
          const next = [...prev];
          next[uuidIndex] = msg;
          return next;
        }
        const pendingIndex = prev.findIndex(
          (m) => (msg.tempId && m.tempId === msg.tempId) || (m.status === "pending" && m.content === msg.content)
        );
        if (pendingIndex !== -1) {
          const next = [...prev];
          next[pendingIndex] = { ...msg };
          return next;
        }
        if (prev.some(m => m.uuid === msg.uuid)) return prev;
        return [...prev, msg];
      });
      setTimeout(scrollToBottom, 50);
    };

    const handleTyping = ({ conversationUuid: msgUuid, isTyping: typingStatus }: any) => {
      if (msgUuid === conversationUuid) setIsTyping(typingStatus);
    };

    socketService.on("new_message", handleIncomingMessage);
    socketService.on("messageSent", handleIncomingMessage);
    socketService.on("typing", handleTyping);

    return () => {
      socketService.off("new_message", handleIncomingMessage);
      socketService.off("messageSent", handleIncomingMessage);
      socketService.off("typing", handleTyping);
    };
  }, [conversationUuid]);

  const handleSend = () => {
    if (!inputText.trim() || !conversationUuid) return;
    const content = inputText.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: any = {
      uuid: tempId,
      tempId,
      content,
      type: "text",
      createdAt: new Date().toISOString(),
      senderType: "ADMIN",
      senderAdmin: { firstName: adminUser?.firstName || "Admin", lastName: adminUser?.lastName || "" },
      status: "pending",
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);
    setInputText("");
    socketService.sendMessage({ conversationUuid, content, type: "text", tempId });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationUuid || !signatureData?.data) return;
    setIsUploading(true);
    const { signature, timestamp, api_key, cloud_name } = signatureData.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "chats");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        socketService.sendMessage({ conversationUuid, content: data.secure_url, type: "image", tempId: `temp-img-${Date.now()}` });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50/30">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-[#475467]">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB] rounded-2xl border border-[#F2F4F7] h-full shadow-sm">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-[#F2F4F7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101828]">{title}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE SESSION
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4">
        {isFetchingNextPage && <div className="flex justify-center py-2"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>}
        {messages.map((msg) => {
          const isMe = msg.senderType === "ADMIN";
          const senderName = msg.adminSender ? `${msg.adminSender.firstName} ${msg.adminSender.lastName}` : 
                            msg.senderAdmin ? `${msg.senderAdmin.firstName} ${msg.senderAdmin.lastName}` : 
                            msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : "User";
          return (
            <div key={msg.uuid || msg.tempId} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[70%] flex flex-col gap-1">
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-[#475467] border border-[#F2F4F7] rounded-tl-none'}`}>
                  {msg.type === 'image' ? <img src={msg.content} alt="Attachment" className="max-w-full rounded-lg cursor-pointer" onClick={() => window.open(msg.content, '_blank')} /> : <p className="leading-relaxed">{msg.content}</p>}
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] text-[#98A2B3] font-medium ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {format(new Date(msg.createdAt), 'HH:mm')}
                  {isMe && <CheckCheck size={12} className="text-primary" />}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl border border-[#F2F4F7] flex gap-1 items-center">
              {[0, 1, 2].map(i => <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#F2F4F7]">
        <div className="flex items-center gap-2 bg-[#F9FAFB] p-1.5 pr-2 rounded-2xl border border-[#EAECF0]">
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-2.5 text-[#667085] hover:text-primary rounded-xl">
            {isUploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <Paperclip size={18} />}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          <input type="text" placeholder="Type your message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-transparent border-none outline-none text-sm py-2" />
          <button onClick={handleSend} disabled={!inputText.trim()} className={`p-2.5 rounded-xl transition-all ${inputText.trim() ? 'bg-primary text-white' : 'bg-[#F2F4F7] text-[#D0D5DD]'}`}>
            <Send size={18} fill={inputText.trim() ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
