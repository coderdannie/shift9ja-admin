import React, { useState, useMemo } from "react";
import { Filter, Download } from "lucide-react";
import {
  useGetUserGeography,
  useGetMarketHealth,
  useGetRevenueAnalytics,
  useGetRetentionCohorts,
  useGetFulfillmentMetrics,
  useGetUserCategoryDistribution,
} from "../../services/query/dashboard";
import type { AnalyticsFilter } from "../../types/dashboard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OverviewTab from "../../components/Modules/Analytics/OverviewTab";
import DistributionTab from "../../components/Modules/Analytics/DistributionTab";

const mockCategoryDistribution = [
  { categoryName: "Cleaning", state: "Lagos", city: "Ikeja", userCount: 45 },
  { categoryName: "Cleaning", state: "Lagos", city: "Lekki", userCount: 22 },
  { categoryName: "Cleaning", state: "FCT", city: "Gwarinpa", userCount: 19 },
  { categoryName: "Cleaning", state: "Rivers", city: "Port Harcourt", userCount: 14 },
  { categoryName: "Plumbing", state: "Lagos", city: "Lekki", userCount: 32 },
  { categoryName: "Plumbing", state: "Lagos", city: "Surulere", userCount: 18 },
  { categoryName: "Plumbing", state: "FCT", city: "Wuse", userCount: 11 },
  { categoryName: "Electrical Work", state: "FCT", city: "Wuse", userCount: 28 },
  { categoryName: "Electrical Work", state: "Lagos", city: "Ikeja", userCount: 25 },
  { categoryName: "Electrical Work", state: "Rivers", city: "Port Harcourt", userCount: 9 },
  { categoryName: "Moving Help", state: "Lagos", city: "Ikeja", userCount: 15 },
  { categoryName: "Moving Help", state: "Lagos", city: "Surulere", userCount: 12 },
  { categoryName: "Moving Help", state: "FCT", city: "Gwarinpa", userCount: 7 },
  { categoryName: "IT Support", state: "Lagos", city: "Lekki", userCount: 20 },
  { categoryName: "IT Support", state: "FCT", city: "Wuse", userCount: 16 },
];

type ActiveTab = "overview" | "distribution";

const Analytics: React.FC = () => {
  const [filter, setFilter] = useState<AnalyticsFilter>("THIS_MONTH");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // API Queries
  const { data: geoData, isLoading: isGeoLoading } = useGetUserGeography();
  const { data: marketData, isLoading: isMarketLoading } = useGetMarketHealth({ filter });
  const { data: revenueData, isLoading: isRevenueLoading } = useGetRevenueAnalytics({ filter });
  const { data: retentionData, isLoading: isRetentionLoading } = useGetRetentionCohorts({ filter });
  const { data: fulfillmentData, isLoading: isFulfillmentLoading } = useGetFulfillmentMetrics({ filter });
  const { data: categoryDistData, isLoading: isCategoryDistLoading } = useGetUserCategoryDistribution();

  const isLoading =
    isGeoLoading ||
    isMarketLoading ||
    isRevenueLoading ||
    isRetentionLoading ||
    isFulfillmentLoading ||
    isCategoryDistLoading;

  const distributionData = useMemo(() => {
    return categoryDistData?.data && categoryDistData.data.length > 0
      ? categoryDistData.data
      : mockCategoryDistribution;
  }, [categoryDistData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101828]">
            Analytics Insights
          </h1>
          <p className="text-[#667085]">
            Monitor platform growth, market health, and operational performance.
          </p>
        </div>

        {activeTab === "overview" && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 shadow-sm">
              <Filter size={18} className="text-[#667085]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as AnalyticsFilter)}
                className="bg-transparent border-none outline-none text-sm font-medium text-[#344054] cursor-pointer"
              >
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="THIS_YEAR">This Year</option>
              </select>
            </div>

            <button className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors">
              <Download size={18} />
              Export Report
            </button>
          </div>
        )}
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-[#EAECF0] gap-4 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-[#667085] hover:text-[#344054]"
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab("distribution")}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "distribution"
              ? "border-primary text-primary"
              : "border-transparent text-[#667085] hover:text-[#344054]"
          }`}
        >
          Helper Category Distribution
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <OverviewTab
          geoData={geoData}
          marketData={marketData}
          revenueData={revenueData}
          retentionData={retentionData}
          fulfillmentData={fulfillmentData}
        />
      ) : (
        <DistributionTab distributionData={distributionData} />
      )}
    </div>
  );
};

export default Analytics;
