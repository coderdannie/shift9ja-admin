import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ChatInterface from '../../components/Modules/AdminChats/ChatInterface';
import { PRIVATE_PATHS } from '../../routes/constants';

const ChatRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] p-6">
      <div className="mb-4">
        <button 
          onClick={() => navigate(PRIVATE_PATHS.ADMIN_CHATS)}
          className="flex items-center gap-2 text-sm font-semibold text-[#475467] hover:text-primary transition-colors group"
        >
          <div className="p-1 rounded-lg group-hover:bg-primary/5">
            <ChevronLeft size={20} />
          </div>
          Back to Conversations
        </button>
      </div>
      
      <div className="flex-1 min-h-0">
        <ChatInterface 
          conversationUuid={id} 
          title="Conversation Room"
        />
      </div>
    </div>
  );
};

export default ChatRoom;
