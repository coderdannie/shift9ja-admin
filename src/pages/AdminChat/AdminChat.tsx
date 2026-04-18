import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { MessageCircle } from 'lucide-react';
import AdminChatList from '../../components/Modules/AdminChats/AdminChatList';

const AdminChat: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader 
        title="Admin Chat" 
        subtitle="Manage and monitor all active conversations on the platform"
        icon={<MessageCircle className="text-primary" size={24} />}
      />
      
      <div className="mt-8">
        <AdminChatList />
      </div>
    </div>
  );
};

export default AdminChat;
