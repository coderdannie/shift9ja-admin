import React from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../common/CustomTable";
import { PRIVATE_PATHS } from "../../../routes/constants";
import type { Dispute } from "../../../types/dispute";

interface DisputeTableProps {
  disputes: Dispute[];
  isLoading: boolean;
}

const HEADERS = [
  "Task Title",
  "Dispute type",
  "Reason",
  "Opened",
  "Evidence",
  "Status",
  "Actions",
];

const DisputeTable: React.FC<DisputeTableProps> = ({ disputes, isLoading }) => {
  const navigate = useNavigate();

  return (
    <CustomTable headers={HEADERS} isLoading={isLoading}>
      {disputes.length === 0 && !isLoading ? (
        <tr>
          <td
            colSpan={HEADERS.length}
            className="px-6 py-16 text-center text-[#98A2B3] text-sm font-medium"
          >
            No dispute cases found. There are currently no active disputes matching your filters.
          </td>
        </tr>
      ) : (
        disputes.map((dispute) => (
          <tr
            key={dispute.uuid}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="px-6 py-4 text-[#101828] font-semibold whitespace-nowrap">
              {dispute.task?.title || "N/A"}
            </td>
            <td className="px-6 py-4 text-[#475467]">
              <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100 capitalize">
                {dispute.reporter?.activeRole || "N/A"}
              </span>
            </td>
            <td className="px-6 py-4 text-[#475467] max-w-[200px] truncate">
              {dispute.reason}
            </td>
            <td className="px-6 py-4 text-[#475467] whitespace-nowrap">
              {new Date(dispute.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-center">
              <span className="text-xs font-semibold text-primary">
                {dispute.evidence ? dispute.evidence.length : 0} files
              </span>
            </td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                  dispute.status === "open"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : dispute.status === "in_progress"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : dispute.status === "resolved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    dispute.status === "open"
                      ? "bg-blue-500"
                      : dispute.status === "in_progress"
                        ? "bg-orange-500"
                        : dispute.status === "resolved"
                          ? "bg-green-500"
                          : "bg-gray-500"
                  }`}
                ></span>
                {dispute.status.charAt(0).toUpperCase() +
                  dispute.status.slice(1).replace("_", " ")}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => navigate(PRIVATE_PATHS.DISPUTE_DETAIL.replace(':id', dispute.uuid))}
                className="text-primary font-bold text-sm hover:text-green-700 transition-colors px-3 py-1.5 hover:bg-primary/5 rounded-lg active:scale-95"
              >
                Review
              </button>
            </td>
          </tr>
        ))
      )}
    </CustomTable>
  );
};

export default DisputeTable;
