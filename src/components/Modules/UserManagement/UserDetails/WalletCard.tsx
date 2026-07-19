import React from "react";

const WalletCard: React.FC<{
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#F2F4F7] shadow-sm hover:shadow-md transition-shadow min-w-0 flex-1">
    <div className={`p-3 rounded-xl ${color} text-white shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-medium text-[#475467]">{label}</span>
      <span className="text-xl font-bold text-[#101828] break-words">
        {value}
      </span>
    </div>
  </div>
);

export default WalletCard;
