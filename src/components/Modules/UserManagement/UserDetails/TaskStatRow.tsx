import React from "react";

const TaskStatRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  variant?:
    | "blue"
    | "green"
    | "orange"
    | "red"
    | "purple"
    | "gray"
    | "amber"
    | "indigo";
}> = ({ icon, label, count, variant = "green" }) => {
  const variantStyles = {
    blue: {
      iconBg: "bg-[#0086C9]",
      badge: "border-[#B2DDFF] bg-[#EFF8FF] text-[#175CD3]",
    },
    green: {
      iconBg: "bg-[#067647]",
      badge: "border-[#A3E9C9] bg-[#ECFDF3] text-[#067647]",
    },
    orange: {
      iconBg: "bg-[#E05F1B]",
      badge: "border-[#F9DBAF] bg-[#FFF6ED] text-[#C43C00]",
    },
    red: {
      iconBg: "bg-[#D92D20]",
      badge: "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]",
    },
    purple: {
      iconBg: "bg-[#7F56D9]",
      badge: "border-[#E9D7FE] bg-[#F9F5FF] text-[#6941C6]",
    },
    gray: {
      iconBg: "bg-[#475467]",
      badge: "border-[#D0D5DD] bg-[#F9FAFB] text-[#344054]",
    },
    amber: {
      iconBg: "bg-[#D9A70E]",
      badge: "border-[#FDE293] bg-[#FEFDF0] text-[#B58209]",
    },
    indigo: {
      iconBg: "bg-[#3538CD]",
      badge: "border-[#C7D7FE] bg-[#EEF4FF] text-[#312E81]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="bg-white rounded-xl border border-[#F2F4F7] p-3 flex items-center justify-between shadow-sm min-w-0 hover:shadow-md hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center text-white shrink-0`}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, { size: 16 })
            : icon}
        </div>
        <span className="text-[#344054] font-semibold text-xs truncate">
          {label}
        </span>
      </div>
      <div
        className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] shrink-0 ${styles.badge}`}
      >
        {count}
      </div>
    </div>
  );
};

export default TaskStatRow;
