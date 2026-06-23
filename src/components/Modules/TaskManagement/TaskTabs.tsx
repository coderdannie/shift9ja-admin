import React from 'react';

export type TaskTabType = 'open' | 'assigned' | 'in_progress' | 'completed' | 'disputed';

interface TaskTabsProps {
  activeTab: TaskTabType;
  onChange: (tab: TaskTabType) => void;
}

const TABS: { key: TaskTabType; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'disputed', label: 'Disputed' },
];

const TaskTabs: React.FC<TaskTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex border-b border-[#F2F4F7] mt-6">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`flex-1 md:flex-none px-8 py-3 text-base font-semibold transition-all relative
          ${activeTab === tab.key
            ? 'text-[#101828]'
            : 'text-[#98A2B3] hover:text-[#475467]'
          }`}
      >
        {tab.label}
        {activeTab === tab.key && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);

export default TaskTabs;
