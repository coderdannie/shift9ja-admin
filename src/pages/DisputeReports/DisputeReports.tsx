import React, { useState } from "react";
import { Search, AlertCircle, Clock } from "lucide-react";
import StatCard from "../../components/Modules/Dashboard/StatCard";
import DisputeTable from "../../components/Modules/DisputeReports/DisputeTable";
import Pagination from "../../components/common/Pagination";
import {
  useGetDisputeStats,
  useGetDisputes,
} from "../../services/query/dispute";
import type { Dispute } from "../../types/dispute";

const DisputeReports = () => {
  const [activeTab, setActiveTab] = useState<"in_progress" | "open">(
    "open",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: statsData, isPending: isLoadingStats } = useGetDisputeStats();
  const { data: disputesData, isPending: isLoadingDisputes } = useGetDisputes({
    status: activeTab,
    search: searchQuery,
    page: currentPage,
  });

  const handleTabChange = (tab: "in_progress" | "open") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const stats = statsData?.data;
  const displayDisputes: Dispute[] = disputesData?.data?.items || [];
  const meta = disputesData?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  const statCards = [
    {
      title: "Total Open Disputes",
      value: stats?.totalOpenDisputes || 0,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Urgent Disputes",
      value: stats?.urgentDisputes || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "In-Review Disputes",
      value: stats?.inReviewDisputes || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">
            Admin Dispute & Reports
          </h1>
          <p className="text-[#475467] mt-1 text-sm leading-relaxed">
            Monitor and resolve task-related conflicts across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingStats
          ? [...Array(3)].map((_, i) => <StatCard key={i} loading />)
          : statCards.map((stat, i) => (
              <StatCard
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconColor={stat.color}
                iconBgColor={stat.bgColor}
              />
            ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#F2F4F7] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-[#F2F4F7] bg-white sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-[400px]">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search task title or reason..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#D0D5DD] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              />
            </div>

            <div className="flex p-1 bg-[#F9FAFB] rounded-xl border border-[#F2F4F7] self-start md:self-auto shadow-inner">
              <button
                onClick={() => handleTabChange("in_progress")}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "in_progress"
                    ? "bg-white text-primary shadow-sm ring-1 ring-gray-100"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleTabChange("open")}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "open"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <DisputeTable
            disputes={displayDisputes}
            isLoading={isLoadingDisputes}
          />
        </div>

        <div className="p-4 border-t border-[#F2F4F7] flex items-center justify-between text-sm text-[#667085]">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {displayDisputes.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {meta?.totalItems || displayDisputes.length}
            </span>{" "}
            results
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DisputeReports;
