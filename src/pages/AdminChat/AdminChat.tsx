import React from 'react';
import { useParams } from 'react-router-dom';
import AdminChatList from '../../components/Modules/AdminChats/AdminChatList';
import ChatInterface from '../../components/Modules/AdminChats/ChatInterface';
import { MessageCircle } from 'lucide-react';

const AdminChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex bg-[#F2F4F7] h-[calc(100vh-100px)] -m-6 overflow-hidden relative">
      {/* Sidebar - Chat List */}
      <div className={`
        ${id ? 'hidden md:block' : 'block'} 
        w-full md:w-[380px] h-full flex-shrink-0
      `}>
        <AdminChatList activeId={id} />
      </div>

      {/* Main Content - Chat Interface */}
      <div className={`
        ${id ? 'block' : 'hidden md:flex'} 
        flex-1 h-full flex flex-col min-w-0
      `}>
        {id ? (
          <div className="flex-1 p-0 md:p-4 h-full overflow-hidden">
             <ChatInterface 
               conversationUuid={id} 
             />
          </div>
        ) : (
          <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
              <MessageCircle size={40} />
            </div>
            <h2 className="text-xl font-bold text-[#101828] mb-2">Select a conversation</h2>
            <p className="text-sm text-[#475467] max-w-xs mx-auto leading-relaxed">
              Choose a message from the list on the left to view the conversation history and start responding.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
