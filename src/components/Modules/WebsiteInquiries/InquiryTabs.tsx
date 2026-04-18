import React from 'react';
import { Mail, Clock } from 'lucide-react';

export type InquiryTabType = 'contact' | 'waitlist';

interface InquiryTabsProps {
  activeTab: InquiryTabType;
  onChange: (tab: InquiryTabType) => void;
  contactCount?: number;
  waitlistCount?: number;
}

const InquiryTabs: React.FC<InquiryTabsProps> = ({ 
  activeTab, 
  onChange, 
  contactCount = 0, 
  waitlistCount = 0 
}) => {
  const tabs = [
    { id: 'contact', label: 'Contact Submissions', icon: Mail, count: contactCount },
    { id: 'waitlist', label: 'Waiting List', icon: Clock, count: waitlistCount },
  ];

  return (
    <div className="flex border-b border-[#EAECF0] mb-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as InquiryTabType)}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap
              ${isActive 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-[#667085] hover:text-[#101828] hover:bg-gray-50'}
            `}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`
                ml-1 px-2 py-0.5 rounded-full text-[10px] 
                ${isActive ? 'bg-primary text-white' : 'bg-[#F2F4F7] text-[#344054]'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default InquiryTabs;
