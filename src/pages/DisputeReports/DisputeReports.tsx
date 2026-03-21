import React, { useState } from 'react';
import { Search, AlertCircle, Clock } from 'lucide-react';
import StatCard from '../../Modules/Dashboard/StatCard';
import DisputeTable from '../../Modules/DisputeReports/DisputeTable';
import { useGetDisputeStats, useGetDisputes } from '../../services/query/dispute';
import type { Dispute } from '../../types/dispute';

const DisputeReports = () => {
  const [activeTab, setActiveTab] = useState<'in-review' | 'urgent'>('in-review');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: statsData, isPending: isLoadingStats } = useGetDisputeStats();
  const { data: disputesData, isPending: isLoadingDisputes } = useGetDisputes({ 
    status: activeTab,
    search: searchQuery 
  });

  const stats = statsData?.data;
  const disputes = disputesData?.data || [];

  // Mock data for demonstration as per Screenshot 1
  const mockDisputes: Dispute[] = [
    {
      uuid: '1',
      taskTitle: 'Inspect Family House - Bodija',
      disputeType: 'Client',
      reason: 'Incomplete report',
      openedAt: '3 hrs ago',
      evidenceCount: 6,
      status: 'in-review',
    },
    {
      uuid: '2',
      taskTitle: 'Shop Inspection - Dugbe',
      disputeType: 'Helper',
      reason: 'Client unresponsive',
      openedAt: '8 hrs ago',
      evidenceCount: 6,
      status: 'in-review',
    },
    {
      uuid: '3',
      taskTitle: 'Apartment Check - Akobo',
      disputeType: 'Client',
      reason: 'Late delivery',
      openedAt: '1 day ago',
      evidenceCount: 6,
      status: 'in-review',
    },
    {
      uuid: '4',
      taskTitle: 'Document Pickup - UI Area',
      disputeType: 'Helper',
      reason: 'Client unresponsive',
      openedAt: '2 days ago',
      evidenceCount: 6,
      status: 'in-review',
    },
    {
        uuid: '5',
        taskTitle: 'Property Photo Update - Ring Rd',
        disputeType: 'Client',
        reason: 'Incomplete report',
        openedAt: '2 days ago',
        evidenceCount: 6,
        status: 'in-review',
    },
    {
        uuid: '6',
        taskTitle: 'Apartment Check - Iwo Road',
        disputeType: 'TC-10965',
        reason: 'Late delivery',
        openedAt: '4 days ago',
        evidenceCount: 6,
        status: 'in-review',
    }
  ];

  // Use real data if available, fallback to filtered mock for dev
  const displayDisputes = disputes.length > 0 
    ? disputes 
    : (searchQuery 
        ? mockDisputes.filter(d => d.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) && d.status === activeTab)
        : mockDisputes.filter(d => d.status === activeTab)
      );

  const statCards = [
    {
      title: 'Total Open Disputes',
      value: stats?.totalOpenDisputes || 0,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Urgent Disputes',
      value: stats?.urgentDisputes || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'In-Review Disputes',
      value: stats?.inReviewDisputes || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">Admin Dispute & Reports</h1>
          <p className="text-[#475467] mt-1 text-sm leading-relaxed">Monitor and resolve task-related conflicts across the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingStats ? (
          [...Array(3)].map((_, i) => (
            <StatCard key={i} loading />
          ))
        ) : (
          statCards.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              iconBgColor={stat.bgColor}
            />
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-[#F2F4F7] bg-white sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search task title or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              />
            </div>

            <div className="flex p-1 bg-[#F9FAFB] rounded-xl border border-[#F2F4F7] self-start md:self-auto shadow-inner">
              <button
                onClick={() => setActiveTab('in-review')}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  activeTab === 'in-review' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-gray-100' 
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                In Review
              </button>
              <button
                onClick={() => setActiveTab('urgent')}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  activeTab === 'urgent' 
                    ? 'bg-white text-red-600 shadow-sm ring-1 ring-gray-100' 
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                Urgent
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <DisputeTable disputes={displayDisputes} isLoading={isLoadingDisputes} />
        </div>

        <div className="p-4 border-t border-[#F2F4F7] flex items-center justify-between text-sm text-[#667085]">
             <p>Showing <span className="font-semibold text-gray-900">{displayDisputes.length}</span> results</p>
             <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                <div className="flex items-center gap-1">
                   {[1, 2, 3].map(n => (
                     <button key={n} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${n === 1 ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}>{n}</button>
                   ))}
                   <span className="px-1 text-gray-400">...</span>
                   {[8, 9, 10].map(n => (
                     <button key={n} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold hover:bg-gray-50">{n}</button>
                   ))}
                </div>
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeReports;
