import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Map as MapIcon,
  Activity,
  Filter,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DistributionItem {
  categoryName: string;
  state: string;
  city: string;
  userCount: number;
}

interface DistributionTabProps {
  distributionData: DistributionItem[];
}

type SortColumn = "categoryName" | "state" | "city" | "userCount";

const DistributionTab: React.FC<DistributionTabProps> = ({
  distributionData,
}) => {
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("userCount");
  const [sortAscending, setSortAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Unique lists for filtering dropdowns
  const stateOptions = useMemo(() => {
    const states = new Set(distributionData.map((item) => item.state));
    return Array.from(states).sort();
  }, [distributionData]);

  const cityOptions = useMemo(() => {
    const filtered =
      selectedState === "ALL"
        ? distributionData
        : distributionData.filter((item) => item.state === selectedState);
    const cities = new Set(filtered.map((item) => item.city));
    return Array.from(cities).sort();
  }, [distributionData, selectedState]);

  const categoryOptions = useMemo(() => {
    const categories = new Set(
      distributionData.map((item) => item.categoryName),
    );
    return Array.from(categories).sort();
  }, [distributionData]);

  // Apply filters
  const filteredDistData = useMemo(() => {
    return distributionData.filter((item) => {
      const matchesState =
        selectedState === "ALL" || item.state === selectedState;
      const matchesCity = selectedCity === "ALL" || item.city === selectedCity;
      const matchesCategory =
        selectedCategory === "ALL" || item.categoryName === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesState && matchesCity && matchesCategory && matchesSearch;
    });
  }, [
    distributionData,
    selectedState,
    selectedCity,
    selectedCategory,
    searchQuery,
  ]);

  // Apply sorting
  const sortedDistData = useMemo(() => {
    const sorted = [...filteredDistData];
    sorted.sort((a, b) => {
      let valueA: string | number = a[sortColumn];
      let valueB: string | number = b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortAscending ? -1 : 1;
      if (valueA > valueB) return sortAscending ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDistData, sortColumn, sortAscending]);

  // Apply pagination
  const paginatedDistData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDistData.slice(start, start + pageSize);
  }, [sortedDistData, currentPage]);

  // KPIs
  const distKPIs = useMemo(() => {
    let total = 0;
    const catCounts: { [key: string]: number } = {};
    const stateCounts: { [key: string]: number } = {};

    filteredDistData.forEach((item) => {
      total += item.userCount;
      catCounts[item.categoryName] =
        (catCounts[item.categoryName] || 0) + item.userCount;
      stateCounts[item.state] = (stateCounts[item.state] || 0) + item.userCount;
    });

    let topCat = "N/A";
    let maxCatCount = 0;
    Object.entries(catCounts).forEach(([cat, count]) => {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCat = cat;
      }
    });

    let topSt = "N/A";
    let maxStateCount = 0;
    Object.entries(stateCounts).forEach(([st, count]) => {
      if (count > maxStateCount) {
        maxStateCount = count;
        topSt = st;
      }
    });

    return { totalHelpers: total, topCategory: topCat, topState: topSt };
  }, [filteredDistData]);

  // Chart data aggregation
  const chartDistData = useMemo(() => {
    const catCounts: { [key: string]: number } = {};
    filteredDistData.forEach((item) => {
      catCounts[item.categoryName] =
        (catCounts[item.categoryName] || 0) + item.userCount;
    });
    return Object.entries(catCounts)
      .map(([categoryName, userCount]) => ({ categoryName, userCount }))
      .sort((a, b) => b.userCount - a.userCount);
  }, [filteredDistData]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(column);
      setSortAscending(true);
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Users size={24} />
          </div>
          <div>
            <span className="text-sm font-medium text-[#667085]">
              Total Active Helpers
            </span>
            <h4 className="text-2xl font-bold text-[#101828] mt-1">
              {distKPIs.totalHelpers.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-sm font-medium text-[#667085]">
              Top Specialty
            </span>
            <h4 className="text-2xl font-bold text-[#101828] mt-1">
              {distKPIs.topCategory}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <MapIcon size={24} />
          </div>
          <div>
            <span className="text-sm font-medium text-[#667085]">
              Top State Hotspot
            </span>
            <h4 className="text-2xl font-bold text-[#101828] mt-1">
              {distKPIs.topState}
            </h4>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[#101828] font-semibold text-base">
          <Filter size={18} />
          <span>Filter Telemetry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("ALL");
                setCurrentPage(1);
              }}
              className="bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-sm font-medium text-[#344054] outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All States</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-sm font-medium text-[#344054] outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Cities</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-sm font-medium text-[#344054] outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
        <h3 className="text-lg font-bold text-[#101828] mb-6">
          Helpers Count by Category
        </h3>
        {chartDistData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-[#667085] italic">
            No data matching the selected filters.
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartDistData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#F2F4F7"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#667085", fontSize: 12 }}
                />
                <YAxis
                  dataKey="categoryName"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#667085", fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="userCount"
                  name="Helpers"
                  fill="#6366F1"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Paginated Data Grid */}
      <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EAECF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-bold text-base text-[#101828]">
            Granular Distribution Breakdown
          </span>
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-2.5 text-[#667085]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories, states, cities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D0D5DD] rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EAECF0]">
                <th
                  onClick={() => handleSort("categoryName")}
                  className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Category Name
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("state")}
                  className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    State
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("city")}
                  className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    City
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("userCount")}
                  className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Helper Count
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {paginatedDistData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-[#667085] italic"
                  >
                    No category distribution records found matching search or
                    filters.
                  </td>
                </tr>
              ) : (
                paginatedDistData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#101828]">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        {item.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#667085]">
                      {item.city}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#101828]">
                      {item.userCount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-sm text-[#475467]">
            Showing{" "}
            {sortedDistData.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}{" "}
            to {Math.min(currentPage * pageSize, sortedDistData.length)} of{" "}
            {sortedDistData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[#D0D5DD] rounded-lg text-[#344054] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * pageSize >= sortedDistData.length}
              className="p-2 border border-[#D0D5DD] rounded-lg text-[#344054] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionTab;
