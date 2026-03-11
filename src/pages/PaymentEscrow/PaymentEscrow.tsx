import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import EscrowStatsBar from '../../Modules/PaymentEscrow/EscrowStatsBar';
import EscrowTabs from '../../Modules/PaymentEscrow/EscrowTabs';
import type { EscrowTabType } from '../../Modules/PaymentEscrow/EscrowTabs';
import EscrowTable from '../../Modules/PaymentEscrow/EscrowTable';
import type { EscrowTransaction } from '../../Modules/PaymentEscrow/EscrowTable';
import EscrowTransactionDrawer from '../../Modules/PaymentEscrow/EscrowTransactionDrawer';

const MOCK_TRANSACTIONS: EscrowTransaction[] = [
  { id: '1', taskId: 'TC-10982', taskTitle: 'Inspect Family House – Bodija', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '2', taskId: 'TC-10976', taskTitle: 'Shop Inspection – Dugbe', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '3', taskId: 'TC-10971', taskTitle: 'Apartment Check – Akobo', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '4', taskId: 'TC-10965', taskTitle: 'Document Pickup – UI Area', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '5', taskId: 'TC-10965', taskTitle: 'Property Photo Update – Ring Rd', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '6', taskId: 'TC-10965', taskTitle: 'Apartment Check – Iwo Road', amount: '₦5,500', client: 'Seun Adedayo', helper: 'Seun Adedayo', status: 'in_dispute' },
  { id: '7', taskId: 'TC-10950', taskTitle: 'Cleaning Service – Challenge', amount: '₦8,000', client: 'John Doe', helper: 'Jane Smith', status: 'completed' },
  { id: '8', taskId: 'TC-10940', taskTitle: 'AC Repair – Samonda', amount: '₦12,500', client: 'Mike Brown', helper: 'Sam Lee', status: 'pending_release' },
];

const PaymentEscrow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EscrowTabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchesTab = activeTab === 'all' || tx.status === activeTab;
      const matchesSearch = 
        tx.taskId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleReview = (tx: EscrowTransaction) => {
    setSelectedTransaction(tx);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-4 sm:px-6">
      {/* 1. Stats Section */}
      <EscrowStatsBar />

      {/* 2. Search and Filtering Section */}
      <div className="bg-white rounded-3xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[600px]">
        {/* Search Bar Container */}
        <div className="p-6 border-b border-[#F2F4F7]">
          <div className="relative max-w-xl">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" 
            />
            <input
              type="text"
              placeholder="Search task by ID, name or client"
              className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Improved Tabs UI */}
        <EscrowTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Transactions Table */}
        <div className="p-6">
          <EscrowTable 
            transactions={filteredTransactions} 
            onReview={handleReview}
          />
        </div>
      </div>

      {/* Escrow Transaction Drawer */}
      <EscrowTransactionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default PaymentEscrow;
