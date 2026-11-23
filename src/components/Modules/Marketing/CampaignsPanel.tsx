import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  XCircle,
  Megaphone,
  Pencil,
  Pause,
  Play,
  Ban,
  BarChart3,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import type { AdminCampaign, CampaignStatus } from "../../../types/marketing";
import { CAMPAIGN_STATUSES } from "../../../types/marketing";
import { useGetCampaigns, useUpdateCampaignStatus } from "../../../services/query/marketing";
import CampaignFormModal from "./CampaignFormModal";
import {
  CAMPAIGN_STATUS_STYLES,
  CAMPAIGN_TYPE_STYLES,
  computeUnitEconomics,
  formatCompactNaira,
  formatDate,
  formatNaira,
  humanize,
} from "./marketingHelpers";

interface Props {
  onViewAnalytics: (campaign: AdminCampaign) => void;
}

const ConfirmExpireModal: React.FC<{
  campaign: AdminCampaign | null;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ campaign, onCancel, onConfirm, isLoading }) => {
  if (!campaign) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Expire Campaign?</h2>
            <p className="text-sm text-gray-500 mt-0.5">{campaign.name}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          Expiring stops new referrals from being attributed to this campaign. Pending referees will fall back
          to the platform standard reward.
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Ban size={14} />}
            Expire Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignsPanel: React.FC<Props> = ({ onViewAnalytics }) => {
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCampaign | null>(null);
  const [toExpire, setToExpire] = useState<AdminCampaign | null>(null);

  const { data, isPending, isError, refetch, isFetching } = useGetCampaigns(statusFilter);
  const { mutate: changeStatus, isPending: isChanging, variables: changingVars } = useUpdateCampaignStatus();

  const campaigns: AdminCampaign[] = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: AdminCampaign) => {
    setEditing(c);
    setFormOpen(true);
  };

  const filters: { label: string; value: CampaignStatus | undefined }[] = [
    { label: "All", value: undefined },
    ...CAMPAIGN_STATUSES.map((s) => ({ label: humanize(s), value: s })),
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.label}
                id={`campaign-filter-${f.label.toLowerCase()}`}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </button>
          <button
            id="create-campaign-btn"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-[#0F6E2F] shadow-sm transition-colors"
          >
            <Plus size={16} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <RefreshCw size={28} className="animate-spin" />
            <span className="text-sm">Loading campaigns…</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <XCircle size={28} />
            <span className="text-sm">Failed to load campaigns.</span>
            <button onClick={() => refetch()} className="text-xs text-primary underline">
              Retry
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="p-4 rounded-2xl bg-[#E7F3EC] text-primary">
              <Megaphone size={26} />
            </div>
            <span className="text-sm font-medium text-gray-600">No campaigns found</span>
            <span className="text-xs">
              {statusFilter ? "Try a different status filter." : "Create your first growth campaign."}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Campaign", "Status", "Budget Utilisation", "Reward / Min Task", "Claims", "Window", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const statusStyle = CAMPAIGN_STATUS_STYLES[c.status] ?? CAMPAIGN_STATUS_STYLES.EXPIRED;
                  const used = c.totalBudget > 0 ? Math.min(100, (c.spentBudget / c.totalBudget) * 100) : 0;
                  const econ = computeUnitEconomics(c.minQualifyingTaskAmount, c.referrerReward);
                  const busy = isChanging && changingVars?.uuid === c.uuid;
                  const claimsPct =
                    c.maxClaimsTotal && c.maxClaimsTotal > 0
                      ? Math.min(100, (c.claimsCount / c.maxClaimsTotal) * 100)
                      : null;

                  return (
                    <tr key={c.uuid} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                      {/* Campaign */}
                      <td className="px-5 py-4 min-w-[220px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {c.code && (
                              <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                                {c.code}
                              </code>
                            )}
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                CAMPAIGN_TYPE_STYLES[c.type] ?? "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {humanize(c.type)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* Budget */}
                      <td className="px-5 py-4 min-w-[190px]">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-gray-900">{formatCompactNaira(c.spentBudget)}</span>
                          <span className="text-gray-400">of {formatCompactNaira(c.totalBudget)}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              used >= 90 ? "bg-orange-500" : used >= 70 ? "bg-amber-400" : "bg-primary"
                            }`}
                            style={{ width: `${used}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 block">{used.toFixed(1)}% used</span>
                      </td>

                      {/* Reward / Min Task */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatNaira(c.referrerReward)}</div>
                        <div className="text-xs text-gray-500">min task {formatNaira(c.minQualifyingTaskAmount)}</div>
                        <div
                          className={`text-[10px] font-semibold mt-0.5 ${
                            econ.isProfitable ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {formatNaira(econ.netMargin, { signed: true })} margin ({econ.marginPercent.toFixed(0)}%)
                        </div>
                      </td>

                      {/* Claims */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {c.claimsCount}
                          <span className="text-gray-400 font-normal"> / {c.maxClaimsTotal ?? "∞"}</span>
                        </div>
                        {claimsPct !== null && (
                          <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden mt-1.5">
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${claimsPct}%` }} />
                          </div>
                        )}
                      </td>

                      {/* Window */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          {formatDate(c.startDate)} – {formatDate(c.endDate)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {c.qualificationWindowDays}d qualify • {c.holdPeriodHours}h hold
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`campaign-analytics-${c.uuid}`}
                            onClick={() => onViewAnalytics(c)}
                            title="View analytics"
                            className="p-2 rounded-lg text-gray-500 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                          >
                            <BarChart3 size={15} />
                          </button>
                          <button
                            id={`campaign-edit-${c.uuid}`}
                            onClick={() => openEdit(c)}
                            title="Edit / top up budget"
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          {c.status === "ACTIVE" && (
                            <button
                              id={`campaign-pause-${c.uuid}`}
                              onClick={() => changeStatus({ uuid: c.uuid, status: "PAUSED" })}
                              disabled={busy}
                              title="Pause campaign"
                              className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
                            >
                              {busy ? <RefreshCw size={15} className="animate-spin" /> : <Pause size={15} />}
                            </button>
                          )}
                          {c.status === "PAUSED" && (
                            <button
                              id={`campaign-resume-${c.uuid}`}
                              onClick={() => changeStatus({ uuid: c.uuid, status: "ACTIVE" })}
                              disabled={busy}
                              title="Resume campaign"
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                            >
                              {busy ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
                            </button>
                          )}
                          {c.status !== "EXPIRED" && (
                            <button
                              id={`campaign-expire-${c.uuid}`}
                              onClick={() => setToExpire(c)}
                              disabled={busy}
                              title="Expire campaign"
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CampaignFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} campaign={editing} />

      <ConfirmExpireModal
        campaign={toExpire}
        onCancel={() => setToExpire(null)}
        isLoading={isChanging}
        onConfirm={() =>
          toExpire &&
          changeStatus({ uuid: toExpire.uuid, status: "EXPIRED" }, { onSettled: () => setToExpire(null) })
        }
      />
    </div>
  );
};

export default CampaignsPanel;
