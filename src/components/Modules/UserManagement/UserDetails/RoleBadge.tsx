import React from "react";

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const isHelper = role.toLowerCase() === "helper";
  const isClient = role.toLowerCase() === "client";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border shadow-sm shrink-0 flex items-center h-fit ${
        isHelper
          ? "bg-[#E05F1B]/10 text-[#E05F1B] border-[#E05F1B]/20"
          : isClient
            ? "bg-[#0D8ABC]/10 text-[#0D8ABC] border-[#0D8ABC]/20"
            : "bg-[#F9FAFB] text-[#475467] border-[#F2F4F7]"
      }`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
