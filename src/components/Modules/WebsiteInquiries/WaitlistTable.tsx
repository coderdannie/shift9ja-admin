import React from "react";
import type { WaitlistEntry } from "../../../types/websiteInquiries";
import { Users } from "lucide-react";
import CustomTable from "../../common/CustomTable";

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  isLoading?: boolean;
}

const WaitlistTable: React.FC<WaitlistTableProps> = ({
  entries,
  isLoading,
}) => {
  if (!isLoading && entries.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#EAECF0] overflow-hidden p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Users size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[#101828]">
          No entries in waitlist
        </h3>
        <p className="text-[#475467]">
          There are no waitlist signups to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <CustomTable
      headers={["Email Address", "Source", "Joined Date"]}
      isLoading={isLoading}
      skeletonRows={3}
    >
      {entries.map((entry) => (
        <tr key={entry.uuid} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm font-medium text-[#101828]">
              {entry.email}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-[#475467] capitalize">
              {entry.metadata?.source || "Unknown"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-[#475467]">
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
          </td>
        </tr>
      ))}
    </CustomTable>
  );
};

export default WaitlistTable;
