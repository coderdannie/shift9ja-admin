import type { CampaignStatus, CampaignType } from "../../../types/marketing";
import { PLATFORM_FEE_PERCENT } from "../../../types/marketing";

export const formatNaira = (value: number | null | undefined, opts?: { signed?: boolean }) => {
  const n = Number(value ?? 0);
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(n));
  if (opts?.signed) return `${n < 0 ? "-" : "+"}${formatted}`;
  return n < 0 ? `-${formatted}` : formatted;
};

export const formatCompactNaira = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value ?? 0));

export const formatDate = (iso: string | null | undefined, withTime = false) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: true } : {}),
  }).format(d);
};

export const humanize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, { label: string; className: string; dot: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  PAUSED: {
    label: "Paused",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  EXHAUSTED: {
    label: "Exhausted",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  },
};

export const CAMPAIGN_TYPE_STYLES: Record<CampaignType, string> = {
  CLIENT_ACQUISITION: "bg-[#E7F3EC] text-primary",
  SEASONAL: "bg-sky-50 text-sky-700",
  AMBASSADOR: "bg-violet-50 text-violet-700",
};

/**
 * Computes the unit economics for a campaign configuration.
 * A campaign is profitable only when the platform fee on the minimum
 * qualifying task strictly exceeds the referrer reward.
 */
export const computeUnitEconomics = (minQualifyingTaskAmount: number, referrerReward: number) => {
  const minTask = Number(minQualifyingTaskAmount) || 0;
  const reward = Number(referrerReward) || 0;
  const platformFee = (minTask * PLATFORM_FEE_PERCENT) / 100;
  const netMargin = platformFee - reward;
  const marginPercent = platformFee > 0 ? (netMargin / platformFee) * 100 : 0;
  const breakEvenTaskAmount = (reward * 100) / PLATFORM_FEE_PERCENT;
  return {
    platformFee,
    reward,
    netMargin,
    marginPercent,
    breakEvenTaskAmount,
    isProfitable: platformFee > reward,
  };
};

export const fullName = (p?: { firstName?: string; lastName?: string } | null) =>
  p ? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "Unknown" : "Unknown";

export const shortName = (p?: { firstName?: string; lastName?: string } | null) => {
  if (!p) return "Unknown";
  const last = p.lastName ? ` ${p.lastName.charAt(0)}.` : "";
  return `${p.firstName ?? ""}${last}`.trim() || "Unknown";
};
