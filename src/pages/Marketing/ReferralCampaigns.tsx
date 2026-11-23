import React from "react";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { BarChart3, Megaphone, ShieldAlert, Download, RefreshCw, Gift, X } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ReferralAnalyticsPanel from "../../components/Modules/Marketing/ReferralAnalyticsPanel";
import CampaignsPanel from "../../components/Modules/Marketing/CampaignsPanel";
import FraudQuarantinePanel from "../../components/Modules/Marketing/FraudQuarantinePanel";
import {
  useExportReferrals,
  useGetCampaigns,
  useGetFraudQuarantine,
} from "../../services/query/marketing";
import { useUpdateSearchParams } from "../../hooks/useUpdateSearchParams";

type TabKey = "analytics" | "campaigns" | "quarantine";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "campaigns", label: "Campaigns", icon: Megaphone },
  { key: "quarantine", label: "Fraud Quarantine", icon: ShieldAlert },
];

const ReferralCampaigns: React.FC = () => {
  const [searchParams] = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const tabParam = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey = TABS.some((t) => t.key === tabParam) ? (tabParam as TabKey) : "analytics";
  const campaignUuid = searchParams.get("campaign") || undefined;

  const { data: campaignsData } = useGetCampaigns();
  const { data: quarantineData } = useGetFraudQuarantine({});
  const { mutate: exportCsv, isPending: isExporting } = useExportReferrals();

  const campaigns = campaignsData?.data ?? [];
  const selectedCampaign = campaigns.find((c) => c.uuid === campaignUuid);
  const quarantineCount = quarantineData?.data?.length ?? 0;

  const setTab = (tab: TabKey) => updateSearchParams({ tab });
  const setCampaign = (uuid?: string) => updateSearchParams({ campaign: uuid });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <PageHeader
        title="Referrals & Campaigns"
        subtitle="Drive profitable client acquisition. Manage growth campaigns, monitor unit economics, and review anti-fraud quarantine."
        icon={<Gift size={24} />}
        rightElement={
          <button
            id="export-referrals-btn"
            onClick={() => exportCsv(campaignUuid)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50 transition-colors"
            title={selectedCampaign ? `Export ledger for ${selectedCampaign.name}` : "Export full referral ledger"}
          >
            {isExporting ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
            Export CSV Ledger
          </button>
        }
      />

      {/* Tabs + campaign scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                id={`marketing-tab-${t.key}`}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <t.icon size={16} />
                {t.label}
                {t.key === "quarantine" && quarantineCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {quarantineCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {activeTab === "analytics" && (
          <div className="flex items-center gap-2 pb-2 md:pb-0">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Scope:</span>
            <select
              id="analytics-campaign-scope"
              value={campaignUuid ?? ""}
              onChange={(e) => setCampaign(e.target.value || undefined)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-w-[260px]"
            >
              <option value="">All campaigns</option>
              {campaigns.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.name}
                </option>
              ))}
            </select>
            {campaignUuid && (
              <button
                onClick={() => setCampaign(undefined)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Clear scope"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === "analytics" && <ReferralAnalyticsPanel campaignUuid={campaignUuid} />}
      {activeTab === "campaigns" && (
        <CampaignsPanel
          onViewAnalytics={(c) => updateSearchParams({ tab: "analytics", campaign: c.uuid })}
        />
      )}
      {activeTab === "quarantine" && <FraudQuarantinePanel />}
    </div>
  );
};

export default ReferralCampaigns;
