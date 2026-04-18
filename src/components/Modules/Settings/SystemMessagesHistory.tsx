import React from 'react';
import { useGetSystemMessagesHistory } from '../../../services/query/notifications';
import { format } from 'date-fns';
import { History, Search, Filter } from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SystemMessagesHistory: React.FC = () => {
  const { data: historyData, isLoading } = useGetSystemMessagesHistory();
  const messages = historyData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-[#F2F4F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#F2F4F7] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101828]">Broadcast History</h3>
            <p className="text-sm text-[#667085]">Audit log of system-wide notifications.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none text-sm w-full md:w-64 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
           </div>
           <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="px-6 py-4 text-xs font-black text-[#667085] uppercase tracking-widest border-b border-[#F2F4F7]">Date Published</th>
              <th className="px-6 py-4 text-xs font-black text-[#667085] uppercase tracking-widest border-b border-[#F2F4F7]">Title</th>
              <th className="px-6 py-4 text-xs font-black text-[#667085] uppercase tracking-widest border-b border-[#F2F4F7]">Content Preview</th>
              <th className="px-6 py-4 text-xs font-black text-[#667085] uppercase tracking-widest border-b border-[#F2F4F7]">Segment</th>
              <th className="px-6 py-4 text-xs font-black text-[#667085] uppercase tracking-widest border-b border-[#F2F4F7]">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                  No system messages found in history.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.uuid} className="hover:bg-[#F9FAFB]/50 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#101828]">
                        {format(new Date(msg.publishedAt || msg.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-[10px] text-[#667085] font-medium tracking-tight uppercase">
                        {format(new Date(msg.publishedAt || msg.createdAt), 'hh:mm a')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-[#101828] line-clamp-1">{msg.title}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-[#667085] font-medium line-clamp-1 max-w-xs">{msg.content}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={classNames(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      msg.targetGroup === 'all' ? "bg-blue-50 text-blue-700 border-blue-100" :
                      msg.targetGroup === 'clients' ? "bg-purple-50 text-purple-700 border-purple-100" :
                      "bg-orange-50 text-orange-700 border-orange-100"
                    )}>
                      {msg.targetGroup}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <span className={classNames(
                         "w-2 h-2 rounded-full ring-2 ring-white",
                         msg.priority === 'high' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                       )} />
                       <span className={classNames(
                         "text-xs font-bold",
                         msg.priority === 'high' ? "text-orange-700" : "text-green-700"
                       )}>
                         {msg.priority === 'high' ? 'High' : 'Normal'}
                       </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemMessagesHistory;
