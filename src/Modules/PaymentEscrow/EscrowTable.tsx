import React from 'react';
import { Eye } from 'lucide-react';
import CustomTable from '../../components/common/CustomTable';

export interface EscrowTransaction {
  id: string;
  taskId: string;
  taskTitle: string;
  amount: string;
  client: string;
  helper: string;
  status: 'in_dispute' | 'completed' | 'pending_release';
}

interface EscrowTableProps {
  transactions: EscrowTransaction[];
  isLoading?: boolean;
  onReview: (transaction: EscrowTransaction) => void;
}

const statusMap = {
  in_dispute: { label: 'In dispute', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  completed: { label: 'Completed', dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  pending_release: { label: 'Pending Release', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const StatusBadge: React.FC<{ status: EscrowTransaction['status'] }> = ({ status }) => {
  const s = statusMap[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const HEADERS = ['Task ID', 'Task Title', 'Amount', 'Client', 'Helper', 'Status', 'Actions'];

const EscrowTable: React.FC<EscrowTableProps> = ({ transactions, isLoading = false, onReview }) => {
  return (
    <CustomTable headers={HEADERS} isLoading={isLoading}>
      {transactions.length === 0 && !isLoading ? (
        <tr>
          <td colSpan={HEADERS.length} className="px-6 py-16 text-center text-[#98A2B3] text-sm font-medium italic">
            No transactions found matching your criteria.
          </td>
        </tr>
      ) : (
        transactions.map((tx) => (
          <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
            <td className="px-6 py-5 text-[#101828] font-bold text-sm">{tx.taskId}</td>
            <td className="px-6 py-5 text-[#344054] font-medium text-sm">{tx.taskTitle}</td>
            <td className="px-6 py-5 text-[#101828] font-bold text-sm whitespace-nowrap">{tx.amount}</td>
            <td className="px-6 py-5 text-[#475467] font-medium text-sm whitespace-nowrap">{tx.client}</td>
            <td className="px-6 py-5 text-[#475467] font-medium text-sm whitespace-nowrap">{tx.helper}</td>
            <td className="px-6 py-5"><StatusBadge status={tx.status} /></td>
            <td className="px-6 py-5 whitespace-nowrap">
              <button 
                onClick={() => onReview(tx)}
                className="flex items-center gap-2 text-green-700 font-bold text-xs hover:text-green-800 transition-colors py-1 px-3 rounded-md hover:bg-green-50"
              >
                <Eye size={16} />
                Review
              </button>
            </td>
          </tr>
        ))
      )}
    </CustomTable>
  );
};

export default EscrowTable;
