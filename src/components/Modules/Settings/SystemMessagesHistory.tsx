import React, { useState, useMemo } from 'react';
import { useGetSystemMessagesHistory } from '../../../services/query/notifications';
import { format } from 'date-fns';
import { History, Search, Eye, Copy, Check, X, Megaphone } from 'lucide-react';
import CustomTable from '../../common/CustomTable';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import type { SystemMessage } from '../../../types/notifications';

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const HEADERS = [
  'Date Published',
  'Title',
  'Content Preview',
  'Segment',
  'Priority',
  'Action',
];

const SystemMessagesHistory: React.FC = () => {
  const { data: historyData, isLoading } = useGetSystemMessagesHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<SystemMessage | null>(null);
  const [copied, setCopied] = useState(false);

  const messages = historyData?.data || [];

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    const term = searchTerm.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.title?.toLowerCase().includes(term) ||
        msg.content?.toLowerCase().includes(term) ||
        msg.targetGroup?.toLowerCase().includes(term)
    );
  }, [messages, searchTerm]);

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none text-sm w-full md:w-64 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Custom Table */}
      <CustomTable headers={HEADERS} isLoading={isLoading}>
        {filteredMessages.length === 0 && !isLoading ? (
          <tr>
            <td
              colSpan={HEADERS.length}
              className="px-6 py-20 text-center text-gray-400 font-medium"
            >
              {searchTerm ? 'No system messages match your search.' : 'No system messages found in history.'}
            </td>
          </tr>
        ) : (
          filteredMessages.map((msg) => (
            <tr key={msg.uuid} className="hover:bg-[#F9FAFB] transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#101828]">
                    {format(new Date(msg.publishedAt || msg.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="text-[10px] text-[#667085] font-medium tracking-tight uppercase">
                    {format(new Date(msg.publishedAt || msg.createdAt), 'hh:mm a')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span 
                  onClick={() => setSelectedMsg(msg)}
                  className="text-sm font-semibold text-[#101828] line-clamp-1 hover:text-primary cursor-pointer transition-colors"
                  title="Click to view details"
                >
                  {msg.title}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="relative group/tooltip max-w-xs">
                  <p 
                    onClick={() => setSelectedMsg(msg)}
                    className="text-sm text-[#667085] font-normal line-clamp-1 group-hover/tooltip:text-gray-900 transition-colors cursor-pointer hover:underline"
                    title="Click to view full message"
                  >
                    {msg.content}
                  </p>

                  {/* Interactive Scrollable Hover Tooltip */}
                  <div className="invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all duration-150 absolute left-0 top-full pt-1.5 z-50 pointer-events-auto">
                    <div className="w-80 sm:w-96 p-4 bg-gray-900 text-white text-xs rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-md">
                      <div className="font-semibold text-gray-200 mb-2 pb-1.5 border-b border-gray-800 flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Full Message</span>
                        <button
                          type="button"
                          onClick={() => setSelectedMsg(msg)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                        >
                          Open Modal
                        </button>
                      </div>
                      <div className="text-gray-300 font-normal leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto pr-1 select-text">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={classNames(
                    'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border',
                    msg.targetGroup === 'all'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : msg.targetGroup === 'clients'
                      ? 'bg-purple-50 text-purple-700 border-purple-100'
                      : 'bg-orange-50 text-orange-700 border-orange-100'
                  )}
                >
                  {msg.targetGroup}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span
                    className={classNames(
                      'w-2 h-2 rounded-full ring-2 ring-white',
                      msg.priority === 'high'
                        ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                        : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                    )}
                  />
                  <span
                    className={classNames(
                      'text-xs font-semibold',
                      msg.priority === 'high' ? 'text-orange-700' : 'text-green-700'
                    )}
                  >
                    {msg.priority === 'high' ? 'High' : 'Normal'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => setSelectedMsg(msg)}
                  className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
                  title="View Full Content"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))
        )}
      </CustomTable>

      {/* Full Content Modal */}
      <Transition show={!!selectedMsg} as={React.Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedMsg(null)}>
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-2xl transition-all border border-[#EAECF0]">
                  <div className="flex items-center justify-between mb-6">
                    <DialogTitle as="h3" className="text-xl font-bold text-[#101828] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <Megaphone size={20} />
                      </div>
                      System Broadcast Details
                    </DialogTitle>
                    <button
                      onClick={() => setSelectedMsg(null)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {selectedMsg && (
                    <div className="space-y-6">
                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Target Segment</span>
                          <span
                            className={classNames(
                              'inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider border',
                              selectedMsg.targetGroup === 'all'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : selectedMsg.targetGroup === 'clients'
                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                : 'bg-orange-50 text-orange-700 border-orange-100'
                            )}
                          >
                            {selectedMsg.targetGroup}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Priority</span>
                          <span
                            className={classNames(
                              'inline-flex items-center gap-1.5 mt-1 text-xs font-bold',
                              selectedMsg.priority === 'high' ? 'text-orange-700' : 'text-green-700'
                            )}
                          >
                            <span
                              className={classNames(
                                'w-2 h-2 rounded-full',
                                selectedMsg.priority === 'high' ? 'bg-orange-500' : 'bg-green-500'
                              )}
                            />
                            {selectedMsg.priority === 'high' ? 'High Priority' : 'Normal Priority'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Published At</span>
                          <span className="text-sm font-semibold text-[#101828]">
                            {format(new Date(selectedMsg.publishedAt || selectedMsg.createdAt), 'MMMM dd, yyyy • hh:mm a')}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Subject / Title
                        </label>
                        <p className="text-base font-bold text-[#101828] bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          {selectedMsg.title}
                        </p>
                      </div>

                      {/* Full Content */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Full Message Content
                          </label>
                          <button
                            type="button"
                            onClick={() => handleCopyContent(selectedMsg.content)}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 max-h-64 overflow-y-auto text-sm text-[#344054] leading-relaxed whitespace-pre-wrap select-text">
                          {selectedMsg.content}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedMsg(null)}
                          className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SystemMessagesHistory;

