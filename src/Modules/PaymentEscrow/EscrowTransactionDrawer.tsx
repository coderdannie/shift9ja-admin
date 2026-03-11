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

  const statusStyles = {
    in_dispute: { label: 'In Dispute', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    completed: { label: 'Completed', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    pending_release: { label: 'Pending Release', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  };

  const currentStatus = statusStyles[transaction.status];

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
              <span className="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[10px] font-bold text-green-700 uppercase leading-none">Verified</span>
            </div>
            <span className="text-xs text-[#667085]">4.9 rating (12 tasks posted)</span>
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
            <div className="text-lg font-bold text-[#101828] mt-1">NGN {transaction.amount.replace('₦', '').replace('NGN', '').trim()}</div>
          </div>
        </div>

        {/* Task Description */}
        <div className="italic text-sm text-[#475467] leading-[1.8] bg-[#F9FAFB] p-4 rounded-xl border border-[#F2F4F7]">
          "I've been in Canada for two years. I just want to know that the house is still okay and in good condition. Please take clear photos of the outside, inside, roof, and gate, plus a short video."
        </div>

        {/* Variation: In Dispute */}
        {transaction.status === 'in_dispute' && (
          <>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Client Feedback</h4>
              <p className="text-sm text-[#667085] italic leading-relaxed">
                The delivery was unclear and the photos didn't show the back of the house as agreed.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Evidence Submitted</h4>
              <div className="grid grid-cols-1 gap-3">
                <EvidenceItem fileName="IMG_0785.JPG" progress={100} />
                <EvidenceItem fileName="IMG_0786.JPG" progress={100} />
                <EvidenceItem fileName="IMG_0765.JPG" progress={100} />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-[#F2F4F7]">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Admin Resolution Notes</h4>
              <textarea
                className="w-full h-32 p-4 rounded-xl border-2 border-green-200 bg-white text-sm text-[#101828] font-medium focus:outline-none focus:border-green-600 transition-all resize-none italic leading-relaxed"
                defaultValue="Judging from the evidence submitted the pictures uploaded are not clear as agreed between the client and helper so the helper will have to redo the task and provide clear pictures."
              />
              <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-xl bg-white border border-[#D0D5DD] text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all">Cancel</button>
                <button className="flex-1 h-12 rounded-xl bg-[#067647] text-sm font-bold text-white hover:bg-[#05603A] transition-all shadow-sm">Resolve Dispute</button>
              </div>
            </div>
          </>
        )}

        {/* Variation: Completed */}
        {transaction.status === 'completed' && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-green-600" size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-green-900">Release Successful</h4>
                <p className="text-xs text-green-700 leading-relaxed font-medium">Funds have been successfully released to the helper's wallet on March 15th, 2024.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Transaction Timeline</h4>
              <div className="flex flex-col border border-[#F2F4F7] rounded-xl overflow-hidden divide-y divide-[#F2F4F7]">
                <div className="flex items-center justify-between p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#98A2B3]" />
                    <span className="text-xs font-bold text-[#344054]">Funds Escrowed</span>
                  </div>
                  <span className="text-xs text-[#667085] font-medium">Mar 10, 2024 • 02:45 PM</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-[#98A2B3]" />
                    <span className="text-xs font-bold text-[#344054]">Task Completed</span>
                  </div>
                  <span className="text-xs text-[#667085] font-medium">Mar 14, 2024 • 11:30 AM</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-[#344054]">Payment Released</span>
                  </div>
                  <span className="text-xs text-[#667085] font-medium">Mar 15, 2024 • 09:00 AM</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Financial Detail</h4>
              <div className="space-y-3 bg-[#F9FAFB] p-5 rounded-xl border border-[#F2F4F7]">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#667085]">Base Amount</span>
                  <span className="text-[#101828] font-bold">₦5,000.00</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#667085]">Service Fee (10%)</span>
                  <span className="text-[#101828] font-bold">₦500.00</span>
                </div>
                <div className="h-px bg-[#EAECF0] my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#101828] font-bold">Total Dispersed</span>
                  <span className="text-green-700 font-extrabold">₦5,500.00</span>
                </div>
              </div>
            </div>

            <button className="w-full h-12 rounded-xl bg-white border border-[#D0D5DD] text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all">Download Receipt</button>
          </div>
        )}

        {/* Variation: Pending Release */}
        {transaction.status === 'pending_release' && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="text-amber-600" size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-amber-900">Awaiting Confirmation</h4>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">Funds are held until the client confirms the task or the 7-day auto-release period expires.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Escrow Conditions</h4>
              <div className="bg-white border border-[#EAECF0] p-5 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-px bg-amber-200 ml-5 relative">
                    <div className="absolute top-0 -left-[5px] w-[10px] h-[10px] rounded-full bg-amber-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#344054]">Release Date</span>
                    <span className="text-xs text-[#667085]">Auto-releases on Mar 22, 2024</span>
                  </div>
                </div>
                <p className="text-xs text-[#475467] pl-10 border-l border-dashed border-[#EAECF0] ml-5 py-2">
                  Payment will be automatically transferred to the helper if no dispute is raised within the next 4 days.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-[#F2F4F7]">
               <h4 className="text-xs font-bold text-[#101828] uppercase tracking-widest">Administrative Overrides</h4>
               <p className="text-xs text-[#667085] leading-relaxed italic">As an admin, you can manually trigger the release if there is verifiable proof of task completion.</p>
               <div className="flex gap-3 mt-2">
                 <button className="flex-1 h-12 rounded-xl bg-white border border-[#D0D5DD] text-sm font-bold text-red-600 hover:bg-red-50 transition-all">Cancel Escrow</button>
                 <button className="flex-1 h-12 rounded-xl bg-[#067647] text-sm font-bold text-white hover:bg-[#05603A] transition-all shadow-sm">Release Manually</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default EscrowTransactionDrawer;
