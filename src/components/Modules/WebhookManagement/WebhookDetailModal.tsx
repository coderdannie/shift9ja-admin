import React from 'react';
import { X, Copy, Check, Terminal, RotateCcw } from 'lucide-react';
import type { Webhook } from '../../../types';
import { format } from 'date-fns';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useState } from 'react';
import PermissionGuard from '../../common/PermissionGuard';

interface WebhookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhook: Webhook | null;
  onRetry: (uuid: string) => void;
  isRetrying: boolean;
}

const WebhookDetailModal: React.FC<WebhookDetailModalProps> = ({ isOpen, onClose, webhook, onRetry, isRetrying }) => {
  const [copied, setCopied] = useState(false);

  if (!webhook) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(webhook.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <DialogTitle as="h3" className="text-2xl font-bold text-[#101828] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Terminal size={24} />
                    </div>
                    Webhook Details
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Name</p>
                    <p className="text-lg font-bold text-[#101828]">{webhook.event}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</p>
                    <p className="text-lg font-bold text-[#101828] capitalize">{webhook.provider}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</p>
                    <p className="text-lg font-bold text-[#101828]">
                      {format(new Date(webhook.createdAt), 'MMMM d, yyyy • HH:mm:ss')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                    <div className="flex items-center gap-2">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                         webhook.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' :
                         webhook.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' :
                         'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         {webhook.status}
                       </span>
                       {webhook.retryCount > 0 && (
                         <span className="text-xs text-gray-500 font-medium">({webhook.retryCount} retries)</span>
                       )}
                    </div>
                  </div>
                </div>

                {webhook.errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Error Message</p>
                    <p className="text-sm text-red-700 font-mono break-all">{webhook.errorMessage}</p>
                  </div>
                )}

                <div className="relative group">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      Payload
                    </p>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy Payload'}
                    </button>
                  </div>
                  <div className="max-h-[350px] overflow-auto rounded-2xl bg-[#1e293b] p-6 font-mono text-sm leading-relaxed text-[#94a3b8] custom-scrollbar">
                    <pre className="text-[#38bdf8]">
                      {JSON.stringify(webhook.payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
                  >
                    Close
                  </button>
                  {webhook.status === 'FAILED' && (
                    <PermissionGuard permission="webhook_management.retry_webhooks">
                      <button
                        onClick={() => onRetry(webhook.uuid)}
                        disabled={isRetrying}
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRetrying ? <RotateCcw size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                        {isRetrying ? 'Retrying...' : 'Retry Webhook'}
                      </button>
                    </PermissionGuard>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WebhookDetailModal;
