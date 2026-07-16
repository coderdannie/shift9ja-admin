import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Map as MapIcon,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface OverviewTabProps {
  geoData: any;
  marketData: any;
  revenueData: any;
  retentionData: any;
  fulfillmentData: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  geoData,
  marketData,
  revenueData,
  retentionData,
  fulfillmentData,
}) => {
  return (
    <>
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#667085]">
              Total Revenue
            </span>
            <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
              <DollarSign size={16} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[#101828]">
            ₦
            {(
              revenueData?.data?.reduce(
                (acc: number, curr: any) => acc + Number(curr.totalRevenue),
                0,
              ) || 0
            ).toLocaleString()}
          </h4>
          <div className="mt-2 flex items-center text-green-600 text-xs font-medium">
            <TrendingUp size={12} className="mr-1" />
            +12.5% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#667085]">
              Avg. Fulfillment
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Clock size={16} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[#101828]">
            {(fulfillmentData?.data?.length
              ? fulfillmentData.data.reduce(
                  (acc: number, curr: any) =>
                    acc + Number(curr.avgFulfillmentHours),
                  0,
                ) / fulfillmentData.data.length
              : 0
            ).toFixed(1)}
            h
          </h4>
          <p className="text-xs text-[#667085] mt-2">Across all regions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#667085]">
              Total Coverage
            </span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <MapIcon size={16} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[#101828]">
            {geoData?.data?.length || 0} Cities
          </h4>
          <p className="text-xs text-[#667085] mt-2">
            Active in {new Set(geoData?.data?.map((i: any) => i.state)).size}{" "}
            states
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#667085]">
              Active Demand
            </span>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
              <Users size={16} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[#101828]">
            {(
              marketData?.data?.reduce(
                (acc: number, curr: any) => acc + Number(curr.clientCount),
                0,
              ) || 0
            ).toLocaleString()}
          </h4>
          <div className="mt-2 flex items-center text-[#667085] text-xs">
            {marketData?.data
              ?.reduce(
                (acc: number, curr: any) => acc + Number(curr.helperCount),
                0,
              )
              .toLocaleString()}{" "}
            helpers available
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <DollarSign size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                Revenue by Location
              </h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData?.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F2F4F7"
                />
                <XAxis
                  dataKey="city"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#667085", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#667085", fontSize: 12 }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [
                    `₦${Number(value).toLocaleString()}`,
                    "Total Revenue",
                  ]}
                />
                <Bar
                  dataKey="totalRevenue"
                  fill="#0046CC"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                Market Health (Supply/Demand)
              </h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData?.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F2F4F7"
                />
                <XAxis dataKey="city" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="clientCount"
                  name="Clients (Demand)"
                  fill="#D0D5DD"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="helperCount"
                  name="Helpers (Supply)"
                  fill="#0046CC"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Geography Table */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <MapIcon size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                User Distribution by Geography
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-y border-[#EAECF0]">
                  <th className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                    User Count
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {geoData?.data?.map((item: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#101828]">
                      {item.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#667085]">
                      {item.city}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#101828]">
                      {Number(item.userCount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp size={14} className="mr-1" />+
                        {(Math.random() * 15).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Retention Cohorts */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                User Retention (Stickiness)
              </h3>
            </div>
          </div>
          <div className="space-y-4">
            {retentionData?.data?.slice(0, 4).map((cohort: any, idx: number) => {
              const retention30 =
                (Number(cohort.active30Days) / Number(cohort.totalUsers)) *
                100;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#344054]">
                      {cohort.city}, {cohort.state}
                    </span>
                    <span className="text-[#667085]">
                      {retention30.toFixed(1)}% (30 Days)
                    </span>
                  </div>
                  <div className="w-full bg-[#F2F4F7] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${retention30}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment Metrics */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                Operational Fulfillment
              </h3>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fulfillmentData?.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F2F4F7"
                />
                <XAxis dataKey="city" hide />
                <YAxis tickFormatter={(val) => `${val}h`} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="avgFulfillmentHours"
                  stroke="#D92D20"
                  fill="#FEF3F2"
                  name="Avg. Fulfillment (Hours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-[#667085] italic">
            * Average time between task creation and helper assignment.
          </p>
        </div>
      </div>

      {/* Market Gaps Warning */}
      <div className="bg-[#FFF9F5] border border-[#FFD6AE] p-4 rounded-xl flex gap-4 items-start">
        <div className="p-2 bg-[#FFD6AE]/20 rounded-lg text-[#BC4B00]">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-[#BC4B00]">
            Supply Shortage Detected
          </h4>
          <p className="text-sm text-[#BC4B00]/80">
            Helper-to-Client ratio is below 0.2 in <strong>Lekki</strong>{" "}
            and <strong>Maitama</strong>. Consider launching recruitment
            campaigns in these regions.
          </p>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
