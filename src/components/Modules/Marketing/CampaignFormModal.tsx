import React, { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Info } from "lucide-react";
import type {
  AdminCampaign,
  CampaignStatus,
  CampaignType,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "../../../types/marketing";
import { CAMPAIGN_STATUSES, CAMPAIGN_TYPES, PLATFORM_FEE_PERCENT } from "../../../types/marketing";
import { useCreateCampaign, useUpdateCampaign } from "../../../services/query/marketing";
import { computeUnitEconomics, formatNaira, humanize } from "./marketingHelpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** When provided, the modal operates in edit / top-up mode */
  campaign?: AdminCampaign | null;
}

interface FormState {
  name: string;
  code: string;
  type: CampaignType;
  status: CampaignStatus;
  totalBudget: string;
  referrerReward: string;
  minQualifyingTaskAmount: string;
  qualificationWindowDays: string;
  holdPeriodHours: string;
  maxClaimsTotal: string;
  startDate: string;
  endDate: string;
  metadata: string;
}

const DEFAULTS: FormState = {
  name: "",
  code: "",
  type: "CLIENT_ACQUISITION",
  status: "ACTIVE",
  totalBudget: "",
  referrerReward: "1500",
  minQualifyingTaskAmount: "25000",
  qualificationWindowDays: "90",
  holdPeriodHours: "48",
  maxClaimsTotal: "",
  startDate: "",
  endDate: "",
  metadata: "",
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

const fromCampaign = (c: AdminCampaign): FormState => ({
  name: c.name ?? "",
  code: c.code ?? "",
  type: c.type,
  status: c.status,
  totalBudget: String(c.totalBudget ?? ""),
  referrerReward: String(c.referrerReward ?? ""),
  minQualifyingTaskAmount: String(c.minQualifyingTaskAmount ?? ""),
  qualificationWindowDays: String(c.qualificationWindowDays ?? ""),
  holdPeriodHours: String(c.holdPeriodHours ?? ""),
  maxClaimsTotal: c.maxClaimsTotal != null ? String(c.maxClaimsTotal) : "",
  startDate: toDateInput(c.startDate),
  endDate: toDateInput(c.endDate),
  metadata: c.metadata ? JSON.stringify(c.metadata, null, 2) : "",
});

const num = (v: string) => (v.trim() === "" ? undefined : Number(v.replace(/,/g, "")));

const buildPayloadFrom = (s: FormState): CreateCampaignPayload => ({
  name: s.name.trim(),
  code: s.code.trim() ? s.code.trim().toUpperCase() : undefined,
  type: s.type,
  status: s.status,
  totalBudget: num(s.totalBudget) as number,
  referrerReward: num(s.referrerReward) as number,
  minQualifyingTaskAmount: num(s.minQualifyingTaskAmount) as number,
  qualificationWindowDays: num(s.qualificationWindowDays),
  holdPeriodHours: num(s.holdPeriodHours),
  maxClaimsTotal: num(s.maxClaimsTotal),
  startDate: s.startDate ? `${s.startDate}T00:00:00Z` : undefined,
  endDate: s.endDate ? `${s.endDate}T23:59:59Z` : undefined,
  metadata: s.metadata.trim() ? JSON.parse(s.metadata) : undefined,
});

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400";

const Field: React.FC<{ label: string; hint?: string; error?: string; children: React.ReactNode }> = ({
  label,
  hint,
  error,
  children,
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold text-gray-700">{label}</span>
    {children}
    {error ? (
      <span className="text-[11px] text-red-500">{error}</span>
    ) : hint ? (
      <span className="text-[11px] text-gray-400">{hint}</span>
    ) : null}
  </label>
);

const CampaignFormModal: React.FC<Props> = ({ isOpen, onClose, campaign }) => {
  const isEdit = !!campaign;
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const { mutate: create, isPending: isCreating } = useCreateCampaign();
  const { mutate: update, isPending: isUpdating } = useUpdateCampaign();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setForm(campaign ? fromCampaign(campaign) : DEFAULTS);
      setErrors({});
    }
  }, [isOpen, campaign]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const economics = useMemo(
    () => computeUnitEconomics(num(form.minQualifyingTaskAmount) ?? 0, num(form.referrerReward) ?? 0),
    [form.minQualifyingTaskAmount, form.referrerReward],
  );

  const newBudget = num(form.totalBudget) ?? 0;
  const willReactivate =
    isEdit && campaign?.status === "EXHAUSTED" && newBudget > (campaign?.spentBudget ?? 0);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Campaign name is required.";
    if (form.code && !/^[A-Za-z0-9_-]+$/.test(form.code)) e.code = "Use letters, numbers, - or _ only.";
    if (!newBudget || newBudget <= 0) e.totalBudget = "Enter a budget greater than 0.";
    if (isEdit && campaign && newBudget < campaign.spentBudget)
      e.totalBudget = `Budget cannot be below spent amount (${formatNaira(campaign.spentBudget)}).`;
    if (!num(form.referrerReward) || (num(form.referrerReward) ?? 0) <= 0)
      e.referrerReward = "Enter a reward greater than 0.";
    if (!num(form.minQualifyingTaskAmount)) e.minQualifyingTaskAmount = "Required.";
    else if (!economics.isProfitable)
      e.minQualifyingTaskAmount = `Must exceed ${formatNaira(economics.breakEvenTaskAmount)} to stay profitable.`;
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = "End date must be after start date.";
    if (form.metadata.trim()) {
      try {
        const parsed = JSON.parse(form.metadata);
        if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null)
          e.metadata = "Metadata must be a JSON object.";
      } catch {
        e.metadata = "Invalid JSON.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Only send fields that actually changed for PATCH */
  const buildDiff = (full: CreateCampaignPayload): UpdateCampaignPayload => {
    if (!campaign) return full;
    const original = buildPayloadFrom(fromCampaign(campaign));
    const diff: UpdateCampaignPayload = {};
    (Object.keys(full) as (keyof CreateCampaignPayload)[]).forEach((k) => {
      if (k === "status") return; // status is managed via the dedicated status endpoint
      if (JSON.stringify(full[k]) !== JSON.stringify(original[k])) {
        (diff as any)[k] = full[k];
      }
    });
    return diff;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = buildPayloadFrom(form);

    if (isEdit && campaign) {
      const diff = buildDiff(payload);
      if (Object.keys(diff).length === 0) {
        onClose();
        return;
      }
      update({ uuid: campaign.uuid, payload: diff }, { onSuccess: onClose });
    } else {
      create(payload, { onSuccess: onClose });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E7F3EC] text-primary">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEdit ? "Edit Growth Campaign" : "Create Growth Campaign"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit
                  ? "Update properties or top up the campaign budget."
                  : "Configure a profitable client-acquisition referral campaign."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Field label="Campaign Name" error={errors.name}>
            <input
              id="campaign-name"
              className={inputCls}
              placeholder="Lagos Real Estate Managers 2026"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vanity Promo Code" hint="Optional. e.g. LAGOSBIZ" error={errors.code}>
              <input
                id="campaign-code"
                className={`${inputCls} font-mono uppercase`}
                placeholder="LAGOSBIZ"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Campaign Type">
              <select
                id="campaign-type"
                className={inputCls}
                value={form.type}
                onChange={(e) => set("type", e.target.value as CampaignType)}
              >
                {CAMPAIGN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {humanize(t)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Total Budget Cap (NGN)"
              error={errors.totalBudget}
              hint={isEdit && campaign ? `Spent so far: ${formatNaira(campaign.spentBudget)}` : undefined}
            >
              <input
                id="campaign-total-budget"
                type="number"
                min={0}
                className={inputCls}
                placeholder="1000000"
                value={form.totalBudget}
                onChange={(e) => set("totalBudget", e.target.value)}
              />
            </Field>
            <Field label="Referrer Reward (NGN)" error={errors.referrerReward}>
              <input
                id="campaign-referrer-reward"
                type="number"
                min={0}
                className={inputCls}
                placeholder="2000"
                value={form.referrerReward}
                onChange={(e) => set("referrerReward", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Min Qualifying Task (NGN)" error={errors.minQualifyingTaskAmount}>
              <input
                id="campaign-min-task"
                type="number"
                min={0}
                className={inputCls}
                placeholder="35000"
                value={form.minQualifyingTaskAmount}
                onChange={(e) => set("minQualifyingTaskAmount", e.target.value)}
              />
            </Field>
            <Field label="Hold Period (Hours)">
              <input
                id="campaign-hold-hours"
                type="number"
                min={0}
                className={inputCls}
                placeholder="48"
                value={form.holdPeriodHours}
                onChange={(e) => set("holdPeriodHours", e.target.value)}
              />
            </Field>
          </div>

          {/* Live unit economics */}
          <div
            className={`rounded-xl border p-4 transition-colors ${
              economics.isProfitable
                ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                : "border-red-200 bg-gradient-to-br from-red-50 to-white"
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
              Live Unit Economics &amp; Profit Margin Preview
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Standard Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                <span className="font-semibold text-gray-900">{formatNaira(economics.platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referrer Bonus Payout</span>
                <span className="font-semibold text-gray-900">- {formatNaira(economics.reward)}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-700 font-medium">Net Platform Margin</span>
                <span
                  className={`font-bold ${economics.isProfitable ? "text-emerald-600" : "text-red-600"}`}
                >
                  {formatNaira(economics.netMargin, { signed: true })}{" "}
                  <span className="text-xs font-semibold">({economics.marginPercent.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
            <div className="mt-3">
              {economics.isProfitable ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                  <CheckCircle2 size={12} /> Profitable Guaranteed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                  <AlertTriangle size={12} /> Unprofitable — min task must exceed{" "}
                  {formatNaira(economics.breakEvenTaskAmount)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Qualification Window (Days)" hint="Days a referee has to complete a qualifying task.">
              <input
                id="campaign-window-days"
                type="number"
                min={1}
                className={inputCls}
                placeholder="90"
                value={form.qualificationWindowDays}
                onChange={(e) => set("qualificationWindowDays", e.target.value)}
              />
            </Field>
            <Field label="Max Total Claims" hint="Optional. Leave blank for unlimited.">
              <input
                id="campaign-max-claims"
                type="number"
                min={1}
                className={inputCls}
                placeholder="500"
                value={form.maxClaimsTotal}
                onChange={(e) => set("maxClaimsTotal", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                id="campaign-start-date"
                type="date"
                className={inputCls}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label="End Date" error={errors.endDate}>
              <input
                id="campaign-end-date"
                type="date"
                className={inputCls}
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>

          {!isEdit && (
            <Field label="Initial Status">
              <select
                id="campaign-status"
                className={inputCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value as CampaignStatus)}
              >
                {CAMPAIGN_STATUSES.filter((s) => s === "ACTIVE" || s === "PAUSED").map((s) => (
                  <option key={s} value={s}>
                    {humanize(s)}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Metadata (JSON)" hint='Optional. e.g. { "region": "Lagos" }' error={errors.metadata}>
            <textarea
              id="campaign-metadata"
              rows={3}
              className={`${inputCls} font-mono text-xs`}
              placeholder='{ "region": "Lagos", "targetIndustry": "Real Estate" }'
              value={form.metadata}
              onChange={(e) => set("metadata", e.target.value)}
            />
          </Field>

          {willReactivate && (
            <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3.5 text-xs text-sky-800">
              <Info size={15} className="shrink-0 mt-0.5" />
              <span>
                This campaign is currently <b>Exhausted</b>. Topping up the budget above the spent amount will
                automatically <b>reactivate</b> it.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            id="campaign-save-btn"
            type="submit"
            disabled={isSaving || !economics.isProfitable}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-[#0F6E2F] disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isSaving && <RefreshCw size={14} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Save Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignFormModal;
