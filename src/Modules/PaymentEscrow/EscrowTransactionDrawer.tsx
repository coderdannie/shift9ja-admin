import React from 'react';
import { FileText, CheckCircle2, Clock, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import Drawer from '../../components/common/Drawer';
import type { EscrowTransaction } from './EscrowTable';

interface EvidenceItemProps {
  fileName: string;
  progress: number;
}

const EvidenceItem: React.FC<EvidenceItemProps> = ({ fileName, progress }) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#EAECF0] bg-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#F2F4F7] flex items-center justify-center text-[#667085]">
          <FileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#344054] uppercase tracking-wider">{fileName}</span>
          <span className="text-[11px] text-[#067647] font-semibold">Upload Successful!</span>
        </div>
      </div>
      <CheckCircle2 size={16} className="text-[#067647]" />
    </div>
    <div className="flex flex-col gap-1">
      <div className="h-2 w-full bg-[#F2F4F7] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#067647] rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="flex justify-end">
        <span className="text-[10px] font-bold text-[#475467]">{progress}%</span>
      </div>
    </div>
  </div>
);

interface EscrowTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: EscrowTransaction | null;
}

const EscrowTransactionDrawer: React.FC<EscrowTransactionDrawerProps> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const statusStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
    in_dispute: { label: 'In Dispute', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    completed: { label: 'Completed', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    pending_release: { label: 'Pending Release', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    // New API Statuses
    success: { label: 'Success', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    failed: { label: 'Failed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  const currentStatus = statusStyles[transaction.status] || { 
    label: transaction.status, 
    bg: 'bg-gray-50', 
    text: 'text-gray-700', 
    border: 'border-gray-200' 
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Transaction Details" size="lg">
      <div className="flex flex-col gap-8 pb-10">
        {/* User Identity Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#F2F4F7]">
            <img 
              src={`https://ui-avatars.com/api/?name=${transaction.client}&background=random`} 
              alt={transaction.client} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#101828]">{transaction.client}</span>
            </div>
            <span className="text-xs text-[#667085]">User</span>
          </div>
        </div>

        {/* Task Title & Budget */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-[#101828] leading-tight">
              {transaction.taskTitle}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-widest leading-none">Status</span>
              <span className={`px-2 py-0.5 rounded-full ${currentStatus.bg} ${currentStatus.text} border ${currentStatus.border} text-[10px] font-bold uppercase leading-none`}>
                {currentStatus.label}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-widest leading-none">Budget</span>
            <div className="text-lg font-bold text-[#101828] mt-1">₦{transaction.amount.replace('₦', '').replace('NGN', '').trim()}</div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Transaction Info</h4>
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#F2F4F7] space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-xs text-[#667085] font-medium">Reference</span>
                <span className="text-xs text-[#101828] font-bold truncate max-w-[200px]">{transaction.taskId}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-[#667085] font-medium">Type</span>
                <span className="text-xs text-[#101828] font-bold uppercase">{transaction.taskTitle}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-[#667085] font-medium">Second Party</span>
                <span className="text-xs text-[#101828] font-bold italic">Missing from response</span>
             </div>
          </div>
        </div>

        {/* Variation: In Dispute */}
        {transaction.status === 'in_dispute' && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-red-900">In Dispute</h4>
              <p className="text-xs text-red-700 leading-relaxed font-medium">This transaction is currently in dispute. Detailed feedback and evidence will be available once the backend provides these fields.</p>
            </div>
          </div>
        )}

        {/* Variation: Completed / Success */}
        {(transaction.status === 'completed' || transaction.status === 'success') && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-green-600" size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-green-900">Transaction Successful</h4>
                <p className="text-xs text-green-700 leading-relaxed font-medium">This transaction has been successfully processed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Variation: Pending Release / Pending */}
        {(transaction.status === 'pending_release' || transaction.status === 'pending') && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="text-amber-600" size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-amber-900">Awaiting Confirmation</h4>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">Funds are currently being held. Detailed conditions will be visible once provided by the API.</p>
              </div>
            </div>
          </div>
        )}

        {/* Variation: Failed */}
        {transaction.status === 'failed' && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-red-900">Transaction Failed</h4>
                <p className="text-xs text-red-700 leading-relaxed font-medium">This transaction could not be processed. Please check the system logs or contact support for more details.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default EscrowTransactionDrawer;
