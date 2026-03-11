import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface UserStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

const UserStatCard: React.FC<UserStatCardProps> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-[#F2F4F7] flex flex-col gap-4 shadow-sm flex-1">
    <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">
      <Icon className="text-green-600" size={22} />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-[#667085] text-sm font-medium">{title}</p>
      <h3 className="text-[#101828] text-[26px] font-bold leading-tight">{value}</h3>
    </div>
  </div>
);

interface UserStatsBarProps {
  stats: { title: string; value: string; icon: LucideIcon }[];
}

const UserStatsBar: React.FC<UserStatsBarProps> = ({ stats }) => (
  <div className="flex flex-col sm:flex-row gap-5">
    {stats.map((stat) => (
      <UserStatCard key={stat.title} {...stat} />
    ))}
  </div>
);

export default UserStatsBar;
