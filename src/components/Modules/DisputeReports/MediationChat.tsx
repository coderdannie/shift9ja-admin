import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
} from 'lucide-react';
import { 
  useInitiateDisputeChat,
} from '../../../services/query/chat';
import ChatInterface from '../AdminChats/ChatInterface';

interface MediationChatProps {
  disputeUuid: string;
}

const MediationChat: React.FC<MediationChatProps> = ({ disputeUuid }) => {
  const [conversationUuid, setConversationUuid] = useState<string | null>(null);

  const { mutate: initiateChat, isPending: isInitiating } =
    useInitiateDisputeChat();

  // Initial Initiation for disputes
  useEffect(() => {
    initiateChat(disputeUuid, {
      onSuccess: (res) => {
        const uuid = res.data.uuid;
        setConversationUuid(uuid);
        console.log("📨 Mediation Conversation UUID established:", uuid);
      },
    });
  }, [disputeUuid]);

  if (isInitiating || !conversationUuid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50/30 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-[#475467]">Connecting to mediation session...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col">
       <ChatInterface 
         conversationUuid={conversationUuid} 
         title="Mediation Chat"
       />
    </div>
  );
};

export default MediationChat;
