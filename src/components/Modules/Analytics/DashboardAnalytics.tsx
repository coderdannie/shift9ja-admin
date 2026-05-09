import React, { useState } from 'react';
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
  Area
} from 'recharts';
import { 
  DollarSign, 
  Activity, 
  Clock,
  Filter,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  useGetMarketHealth, 
  useGetRevenueAnalytics, 
  useGetFulfillmentMetrics 
} from '../../../services/query/dashboard';
import type { AnalyticsFilter } from '../../../types/dashboard';

const DashboardAnalytics: React.FC = () => {
  const [filter, setFilter] = useState<AnalyticsFilter>("THIS_MONTH");

  const { data: marketData, isLoading: isMarketLoading } = useGetMarketHealth({ filter });
  const { data: revenueData, isLoading: isRevenueLoading } = useGetRevenueAnalytics({ filter });
  const { data: fulfillmentData, isLoading: isFulfillmentLoading } = useGetFulfillmentMetrics({ filter });

  const isLoading = isMarketLoading || isRevenueLoading || isFulfillmentLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-[400px] bg-gray-100 rounded-2xl" />
        <div className="h-[400px] bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#101828]">Growth & Market Insights</h2>
        <div className="flex items-center gap-2 bg-white border border-[#D0D5DD] rounded-lg px-2 py-1 shadow-sm">
          <Filter size={14} className="text-[#667085]" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as AnalyticsFilter)}
            className="bg-transparent border-none outline-none text-xs font-medium text-[#344054] cursor-pointer"
          >
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_YEAR">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <DollarSign size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#101828]">Revenue by City</h3>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData?.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(val) => `₦${val/1000}k`} />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#0046CC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Activity size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#101828]">Supply vs Demand</h3>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData?.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="clientCount" name="Clients" fill="#D0D5DD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="helperCount" name="Helpers" fill="#0046CC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fulfillment Area Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-[#EAECF0] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#101828]">Avg. Fulfillment Time (Hours)</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fulfillmentData?.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                  <XAxis dataKey="city" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="avgFulfillmentHours" stroke="#D92D20" fill="#FEF3F2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats/Alerts */}
          <div className="bg-[#FFF9F5] border border-[#FFD6AE] p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#BC4B00] mb-2">
                <AlertTriangle size={18} />
                <span className="text-sm font-bold">Market Gaps</span>
              </div>
              <p className="text-xs text-[#BC4B00]/80">
                Supply shortage detected in <strong>Lekki</strong>. Helper-to-client ratio is critically low (0.15).
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#FFD6AE]/50">
              <div className="flex items-center gap-2 text-green-700">
                <TrendingUp size={16} />
                <span className="text-xs font-bold">+12.5% Monthly Growth</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
