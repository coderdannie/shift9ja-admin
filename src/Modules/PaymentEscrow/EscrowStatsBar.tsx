import React from 'react';
import { Wallet, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EscrowStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const EscrowStatCard: React.FC<EscrowStatCardProps> = ({ title, value, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#F2F4F7] flex flex-col gap-4 shadow-sm flex-1 min-w-[240px]">
    <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center transition-transform hover:scale-105`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-[#667085] text-sm font-semibold tracking-tight">{title}</p>
      <h3 className="text-[#101828] text-3xl font-bold leading-tight">{value}</h3>
    </div>
  </div>
);

const EscrowStatsBar: React.FC = () => {
  const stats = [
    { title: 'Total Funds in Escrow', value: '12,842', icon: Wallet, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Pending Release', value: '9,306', icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'Completed Payouts', value: '8,621', icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Failed Payments', value: '3', icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <EscrowStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default EscrowStatsBar;
