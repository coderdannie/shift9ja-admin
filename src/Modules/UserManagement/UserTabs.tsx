import React from 'react';

export type TabType = 'client' | 'helper';

interface UserTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex border-b border-[#F2F4F7] mt-6">
    {(['client', 'helper'] as TabType[]).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-8 py-3 text-base font-semibold capitalize transition-all relative
          ${activeTab === tab
            ? 'text-[#101828]'
            : 'text-[#98A2B3] hover:text-[#475467]'
          }`}
      >
        {tab === 'client' ? 'Client' : 'Helper'}
        {activeTab === tab && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);

export default UserTabs;
