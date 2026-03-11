import React from 'react';

export type EscrowTabType = 'all' | 'in_dispute' | 'completed' | 'pending_release';

interface EscrowTabsProps {
  activeTab: EscrowTabType;
  onChange: (tab: EscrowTabType) => void;
}

const TABS: { key: EscrowTabType; label: string }[] = [
  { key: 'all', label: 'All Transactions' },
  { key: 'in_dispute', label: 'In dispute' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending_release', label: 'Pending Release' },
];

const EscrowTabs: React.FC<EscrowTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex flex-wrap items-center border-b border-[#F2F4F7] bg-white px-2">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`relative px-6 py-4 text-sm font-bold transition-all duration-200 
          ${activeTab === tab.key
            ? 'text-[#101828]'
            : 'text-[#667085] hover:text-[#101828]'
          }`}
      >
        <span className="relative z-10">{tab.label}</span>
        {activeTab === tab.key && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-700 rounded-t-full shadow-[0_-2px_8px_rgba(21,128,61,0.2)]" />
        )}
      </button>
    ))}
  </div>
);

export default EscrowTabs;
