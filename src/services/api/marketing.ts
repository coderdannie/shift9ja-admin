import * as API from "../url";
import axiosInstance from "../axiosInstance";
import type { ApiResponse } from "../../types/api";
import type {
  AdminCampaign,
  AdminReferralAnalytics,
  CampaignStatus,
  CreateCampaignPayload,
  QuarantineFilters,
  QuarantinedReferralItem,
  ResolveQuarantinePayload,
  UpdateCampaignPayload,
} from "../../types/marketing";

/** Strips empty values so they are not sent as query params */
const cleanParams = (params?: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );

// ── Campaigns ──────────────────────────────────────────────────────────────

export const getCampaigns = async (
  status?: CampaignStatus,
): Promise<ApiResponse<AdminCampaign[]>> => {
  const res = await axiosInstance.get(API.GET_MARKETING_CAMPAIGNS, {
    params: cleanParams({ status }),
  });
  return res.data;
};

export const getCampaign = async (uuid: string): Promise<ApiResponse<AdminCampaign>> => {
  const res = await axiosInstance.get(API.GET_MARKETING_CAMPAIGN(uuid));
  return res.data;
};

export const createCampaign = async (
  payload: CreateCampaignPayload,
): Promise<ApiResponse<AdminCampaign>> => {
  const res = await axiosInstance.post(API.CREATE_MARKETING_CAMPAIGN, payload);
  return res.data;
};

export const updateCampaign = async (
  uuid: string,
  payload: UpdateCampaignPayload,
): Promise<ApiResponse<AdminCampaign>> => {
  const res = await axiosInstance.patch(API.UPDATE_MARKETING_CAMPAIGN(uuid), payload);
  return res.data;
};

export const updateCampaignStatus = async (
  uuid: string,
  status: CampaignStatus,
): Promise<ApiResponse<AdminCampaign>> => {
  const res = await axiosInstance.patch(API.UPDATE_MARKETING_CAMPAIGN_STATUS(uuid), { status });
  return res.data;
};

// ── Referral Analytics ─────────────────────────────────────────────────────

export const getReferralAnalytics = async (
  campaignUuid?: string,
): Promise<ApiResponse<AdminReferralAnalytics>> => {
  const res = await axiosInstance.get(API.GET_REFERRAL_ANALYTICS, {
    params: cleanParams({ campaignUuid }),
  });
  return res.data;
};

// ── Anti-Fraud Quarantine ──────────────────────────────────────────────────

export const getFraudQuarantine = async (
  filters?: QuarantineFilters,
): Promise<ApiResponse<QuarantinedReferralItem[]>> => {
  const res = await axiosInstance.get(API.GET_REFERRAL_FRAUD_QUARANTINE, {
    params: cleanParams(filters),
  });
  return res.data;
};

export const resolveQuarantine = async (
  uuid: string,
  payload: ResolveQuarantinePayload,
): Promise<ApiResponse<QuarantinedReferralItem>> => {
  const res = await axiosInstance.post(API.RESOLVE_REFERRAL_QUARANTINE(uuid), payload);
  return res.data;
};

// ── CSV Export ─────────────────────────────────────────────────────────────

/**
 * Downloads the referral ledger CSV. Fetched via axios (not window.open)
 * so the admin Bearer token is attached to the request.
 */
export const exportReferralsCsv = async (campaignUuid?: string): Promise<void> => {
  const res = await axiosInstance.get(API.EXPORT_REFERRALS, {
    params: cleanParams({ campaignUuid }),
    responseType: "blob",
    headers: { Accept: "text/csv" },
  });

  const disposition: string | undefined = res.headers?.["content-disposition"];
  const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match?.[1]
    ? decodeURIComponent(match[1])
    : `referrals-export-${Date.now()}.csv`;

  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
