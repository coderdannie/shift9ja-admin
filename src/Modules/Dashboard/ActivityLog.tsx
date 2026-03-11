import React from 'react';

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  statusColor: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    title: 'Task completed',
    subtitle: 'Helper rated 4.5',
    time: '45 minutes ago',
    statusColor: 'bg-green-500',
  },
  {
    id: '2',
    title: 'User suspended',
    subtitle: 'Account ID: SHT9JA45890',
    time: '2 hours ago',
    statusColor: 'bg-red-500',
  },
  {
    id: '3',
    title: 'Dispute opened',
    subtitle: 'Task #83178',
    time: '3 hours ago',
    statusColor: 'bg-[#FFC107]',
  },
  {
    id: '4',
    title: 'Dispute resolved',
    subtitle: 'Task #83178',
    time: '3 hours ago',
    statusColor: 'bg-[#FFC107]',
  },
  {
    id: '5',
    title: 'Helper verified',
    subtitle: 'Chioma J.',
    time: '5 hours ago',
    statusColor: 'bg-green-500',
  },
];

const ActivityLog: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] flex flex-col gap-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#101828]">Recent Platform Activity</h2>
      
      <div className="flex flex-col">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`flex items-start justify-between py-4 ${index !== activities.length - 1 ? 'border-b border-[#F2F4F7]' : ''}`}
          >
            <div className="flex gap-4">
              <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${activity.statusColor}`} />
              <div className="flex flex-col gap-1">
                <h4 className="text-[#101828] font-semibold text-lg">{activity.title}</h4>
                <p className="text-[#667085] text-sm">{activity.subtitle}</p>
              </div>
            </div>
            <span className="text-[#98A2B3] text-sm whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
