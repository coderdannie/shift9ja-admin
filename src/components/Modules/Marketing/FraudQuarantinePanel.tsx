import React, { useState } from "react";
import { RefreshCw, XCircle, ShieldCheck, Search, X, Eye } from "lucide-react";
import type { QuarantineFilters, QuarantinedReferralItem } from "../../../types/marketing";
import { useGetCampaigns, useGetFraudQuarantine } from "../../../services/query/marketing";
import ResolveQuarantineDrawer from "./ResolveQuarantineDrawer";
import { formatDate, formatNaira, shortName } from "./marketingHelpers";

const inputCls =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

const FraudQuarantinePanel: React.FC = () => {
  const [draft, setDraft] = useState<QuarantineFilters>({});
  const [filters, setFilters] = useState<QuarantineFilters>({});
  const [selected, setSelected] = useState<QuarantinedReferralItem | null>(null);

  const { data, isPending, isError, refetch, isFetching } = useGetFraudQuarantine(filters);
  const { data: campaignsData } = useGetCampaigns();

  const items: QuarantinedReferralItem[] = data?.data ?? [];
  const campaigns = campaignsData?.data ?? [];
  const hasFilters = Object.values(filters).some(Boolean);

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    setFilters({
      campaignUuid: draft.campaignUuid || undefined,
      referrerUuid: draft.referrerUuid?.trim() || undefined,
      refereeUuid: draft.refereeUuid?.trim() || undefined,
    });
  };

  const clearFilters = () => {
    setDraft({});
    setFilters({});
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row lg:items-end gap-3"
      >
        <label className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Campaign</span>
          <select
            id="quarantine-filter-campaign"
            className={inputCls}
            value={draft.campaignUuid ?? ""}
            onChange={(e) => {
              const campaignUuid = e.target.value || undefined;
              setDraft((d) => ({ ...d, campaignUuid }));
              setFilters((f) => ({ ...f, campaignUuid }));
            }}
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.uuid} value={c.uuid}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Referrer UUID</span>
          <input
            id="quarantine-filter-referrer"
            className={`${inputCls} font-mono text-xs`}
            placeholder="Paste referrer user UUID"
            value={draft.referrerUuid ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, referrerUuid: e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Referee UUID</span>
          <input
            id="quarantine-filter-referee"
            className={`${inputCls} font-mono text-xs`}
            placeholder="Paste referee user UUID"
            value={draft.refereeUuid ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, refereeUuid: e.target.value }))}
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-[#0F6E2F]"
          >
            <Search size={14} /> Filter
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              <X size={14} /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <RefreshCw size={28} className="animate-spin" />
            <span className="text-sm">Loading quarantined referrals…</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <XCircle size={28} />
            <span className="text-sm">Failed to load quarantine desk.</span>
            <button onClick={() => refetch()} className="text-xs text-primary underline">
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={28} />
            </div>
            <span className="text-sm font-medium text-gray-700">Quarantine desk is clear</span>
            <span className="text-xs text-gray-400">
              {hasFilters ? "No flagged referrals match these filters." : "No referrals are awaiting review."}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Referee", "Referrer", "Trigger Reason", "Task Budget", "Campaign", "Flagged", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr
                    key={r.uuid}
                    onClick={() => setSelected(r)}
                    className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{shortName(r.referee)}</p>
                      <p className="text-[11px] text-gray-400">{r.referee?.email}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-800">{shortName(r.referrer)}</p>
                      <code className="text-[10px] font-mono text-gray-400">{r.codeUsed}</code>
                    </td>
                    <td className="px-5 py-4 max-w-[320px]">
                      <span className="inline-flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2 py-1 line-clamp-2">
                        {r.fraudReason || "Flagged by anti-fraud heuristics"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {r.qualifyingTask ? formatNaira(r.qualifyingTask.budget) : <span className="text-gray-400 font-normal">—</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      {r.campaign?.name || "Platform default"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">{formatDate(r.updatedAt, true)}</td>
                    <td className="px-5 py-4">
                      <button
                        id={`quarantine-review-${r.uuid}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(r);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        <Eye size={13} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ResolveQuarantineDrawer referral={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default FraudQuarantinePanel;
