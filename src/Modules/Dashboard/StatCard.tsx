import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title?: string;
  value?: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6 animate-pulse min-h-[180px]">
        <div className="w-12 h-12 rounded-full bg-gray-100" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-9 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-[#F2F4F7] shadow-sm flex flex-col gap-6 min-h-[180px] hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}>
        {Icon && <Icon className={iconColor} size={24} />}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[#667085] text-sm font-medium truncate">{title}</p>
        <h3 className="text-[#101828] text-2xl lg:text-3xl font-black tracking-tight break-words line-clamp-2">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
