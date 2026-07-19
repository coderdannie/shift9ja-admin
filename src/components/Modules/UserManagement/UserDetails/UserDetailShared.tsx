import React from "react";

export const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-[#F2F4F7] last:border-0">
    <span className="text-[#475467] font-medium text-sm pr-4">{label}:</span>
    <span className="text-[#101828] font-bold text-sm text-right">{value}</span>
  </div>
);

export const statusBadgeStyles = {
  verified: "border-green-200 bg-green-50 text-green-700",
  not_verified: "border-red-200 bg-red-50 text-red-700",
  suspended: "border-amber-200 bg-amber-50 text-amber-700",
  pending: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};
