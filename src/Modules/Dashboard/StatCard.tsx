import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}>
        <Icon className={iconColor} size={24} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[#667085] text-sm font-medium">{title}</p>
        <h3 className="text-[#101828] text-[28px] font-bold leading-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
