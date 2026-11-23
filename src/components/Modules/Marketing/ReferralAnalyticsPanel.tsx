import React from "react";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  ShieldAlert,
  XCircle,
  TrendingUp,
  Wallet,
  Gift,
  PiggyBank,
  Percent,
  RefreshCw,
} from "lucide-react";
import { useGetReferralAnalytics } from "../../../services/query/marketing";
import { formatNaira } from "./marketingHelpers";

interface Props {
  campaignUuid?: string;
}

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
);

const ReferralAnalyticsPanel: React.FC<Props> = ({ campaignUuid }) => {
  const { data, isPending, isError, refetch, isFetching } = useGetReferralAnalytics(campaignUuid);
  const analytics = data?.data;
  const funnel = analytics?.funnel;
  const fin = analytics?.financials;

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3 text-red-400">
        <XCircle size={28} />
        <span className="text-sm">Failed to load referral analytics.</span>
        <button onClick={() => refetch()} className="text-xs text-primary underline">
          Retry
        </button>
      </div>
    );
  }

  const total = funnel?.totalReferrals ?? 0;
  const pct = (n?: number) => (total > 0 ? ((n ?? 0) / total) * 100 : 0);

  const funnelStages = [
    { key: "kyc", label: "Joined • Needs KYC", value: funnel?.pendingKycCount, icon: Users, bar: "bg-gray-400", tint: "bg-gray-50 text-gray-600" },
    { key: "task", label: "Verified • Needs Task", value: funnel?.pendingTaskCount, icon: Clock, bar: "bg-sky-500", tint: "bg-sky-50 text-sky-600" },
    { key: "done", label: "Rewarded / Completed", value: funnel?.completedCount, icon: CheckCircle2, bar: "bg-emerald-500", tint: "bg-emerald-50 text-emerald-600" },
    { key: "fraud", label: "Under Security Review", value: funnel?.fraudCount, icon: ShieldAlert, bar: "bg-rose-400", tint: "bg-rose-50 text-rose-600" },
    { key: "expired", label: "Expired", value: funnel?.expiredCount, icon: XCircle, bar: "bg-red-300", tint: "bg-red-50 text-red-500" },
  ];

  const finCards = [
    { label: "Gross Client Volume (GMV)", value: formatNaira(fin?.totalGMVGenerated), icon: TrendingUp, tint: "bg-sky-50 text-sky-600" },
    { label: "Platform Revenue (10%)", value: formatNaira(fin?.totalPlatformRevenue), icon: Wallet, tint: "bg-[#E7F3EC] text-primary" },
    { label: "Referral Bonuses Paid", value: formatNaira(fin?.totalBonusesPaid), icon: Gift, tint: "bg-amber-50 text-amber-600" },
  ];

  const net = fin?.netPlatformProfit ?? 0;

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversion */}
        <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-sm bg-gradient-to-br from-[#14863A] via-[#0F6E2F] to-[#0A4F22]">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                Acquisition Conversion Rate
              </p>
              {isPending ? (
                <Skeleton className="h-10 w-28 mt-3 bg-white/20" />
              ) : (
                <p className="text-4xl font-bold mt-2">{funnel?.conversionRate ?? "0%"}</p>
              )}
              <p className="text-xs text-white/70 mt-2">
                {funnel?.completedCount ?? 0} of {total} referred clients completed a qualifying task
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/15">
              <UserCheck size={20} />
            </div>
          </div>
        </div>

        {/* Net profit */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Net Platform Profit
              </p>
              {isPending ? (
                <Skeleton className="h-10 w-48 mt-3" />
              ) : (
                <p className={`text-4xl font-bold mt-2 ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatNaira(net, { signed: true })}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Platform revenue minus referral bonuses paid out
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <PiggyBank size={20} />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Percent size={11} />
                Gross margin {fin?.grossProfitMargin ?? "0%"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {finCards.map((c) => (
              <div key={c.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${c.tint}`}>
                  <c.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 font-medium truncate">{c.label}</p>
                  {isPending ? (
                    <Skeleton className="h-5 w-24 mt-1" />
                  ) : (
                    <p className="text-sm font-bold text-gray-900 truncate">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Referral Acquisition Funnel</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {total} total referrals tracked{campaignUuid ? " for this campaign" : " across all campaigns"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh analytics"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="space-y-4">
          {funnelStages.map((s) => (
            <div key={s.key} className="flex items-center gap-4">
              <div className={`p-2 rounded-lg shrink-0 ${s.tint}`}>
                <s.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{s.label}</span>
                  {isPending ? (
                    <Skeleton className="h-4 w-14" />
                  ) : (
                    <span className="text-sm text-gray-900 font-semibold">
                      {s.value ?? 0}
                      <span className="text-xs text-gray-400 font-normal ml-1.5">
                        {pct(s.value).toFixed(1)}%
                      </span>
                    </span>
                  )}
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${isPending ? 0 : pct(s.value)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralAnalyticsPanel;
