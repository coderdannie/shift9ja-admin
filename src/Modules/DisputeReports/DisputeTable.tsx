import React from 'react';
import type { Dispute } from '../../types/dispute';

interface DisputeTableProps {
  disputes: Dispute[];
  isLoading: boolean;
}

const DisputeTable: React.FC<DisputeTableProps> = ({ disputes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading disputes...</p>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 min-h-[400px]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
           <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
        </div>
        <p className="text-[#101828] font-bold text-lg">No dispute cases found</p>
        <p className="text-[#475467] mt-1 text-center">There are currently no active disputes matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3 -mt-3">
        <thead>
          <tr className="text-[#667085] text-sm font-medium">
            <th className="px-6 py-3">Task Title</th>
            <th className="px-6 py-3">Dispute type</th>
            <th className="px-6 py-3">Reason</th>
            <th className="px-6 py-3">Opened</th>
            <th className="px-6 py-3 text-center">Evidence</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {disputes.map((dispute) => (
            <tr key={dispute.uuid} className="bg-white border border-[#F2F4F7] shadow-sm hover:shadow-md hover:bg-gray-50/50 transition-all rounded-xl overflow-hidden group">
              <td className="px-6 py-5 first:rounded-l-xl border-y border-l border-transparent group-hover:border-[#E4E7EC]">
                <p className="text-sm font-bold text-[#101828] line-clamp-1">{dispute.taskTitle}</p>
              </td>
              <td className="px-6 py-5 border-y border-transparent group-hover:border-[#E4E7EC]">
                <span className="text-sm text-[#475467] bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{dispute.disputeType}</span>
              </td>
              <td className="px-6 py-5 border-y border-transparent group-hover:border-[#E4E7EC]">
                <p className="text-sm text-[#475467] line-clamp-1 max-w-[200px]">{dispute.reason}</p>
              </td>
              <td className="px-6 py-5 border-y border-transparent group-hover:border-[#E4E7EC]">
                <p className="text-sm text-[#475467]">{dispute.openedAt}</p>
              </td>
              <td className="px-6 py-5 border-y border-transparent group-hover:border-[#E4E7EC] text-center">
                <span className="text-xs font-semibold text-primary">{dispute.evidenceCount} files</span>
              </td>
              <td className="px-6 py-5 border-y border-transparent group-hover:border-[#E4E7EC]">
                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                   dispute.status === 'urgent' 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : dispute.status === 'in-review'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                 }`}>
                   <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                     dispute.status === 'urgent' ? 'bg-red-500' : dispute.status === 'in-review' ? 'bg-orange-500' : 'bg-blue-500'
                   }`}></span>
                   {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1).replace('-', ' ')}
                 </span>
              </td>
              <td className="px-6 py-5 last:rounded-r-xl border-y border-r border-transparent group-hover:border-[#E4E7EC] text-right">
                <button className="text-primary font-bold text-sm hover:text-green-700 transition-colors px-3 py-1.5 hover:bg-primary/5 rounded-lg active:scale-95">
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisputeTable;
