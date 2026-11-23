import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { QUERY_KEYS } from "../queryKeys";
import {
  createCampaign,
  exportReferralsCsv,
  getCampaign,
  getCampaigns,
  getFraudQuarantine,
  getReferralAnalytics,
  resolveQuarantine,
  updateCampaign,
  updateCampaignStatus,
} from "../api/marketing";
import type {
  CampaignStatus,
  CreateCampaignPayload,
  QuarantineFilters,
  ResolveQuarantinePayload,
  UpdateCampaignPayload,
} from "../../types/marketing";

const errMsg = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

// ── Queries ────────────────────────────────────────────────────────────────

export const useGetCampaigns = (status?: CampaignStatus) =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_MARKETING_CAMPAIGNS, status ?? "ALL"],
    queryFn: () => getCampaigns(status),
  });

export const useGetCampaign = (uuid?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_MARKETING_CAMPAIGN, uuid],
    queryFn: () => getCampaign(uuid as string),
    enabled: !!uuid,
  });

export const useGetReferralAnalytics = (campaignUuid?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_REFERRAL_ANALYTICS, campaignUuid ?? "ALL"],
    queryFn: () => getReferralAnalytics(campaignUuid),
  });

export const useGetFraudQuarantine = (filters?: QuarantineFilters) =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_REFERRAL_FRAUD_QUARANTINE, filters ?? {}],
    queryFn: () => getFraudQuarantine(filters),
  });

// ── Mutations ──────────────────────────────────────────────────────────────

const useInvalidateCampaigns = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MARKETING_CAMPAIGNS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MARKETING_CAMPAIGN] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REFERRAL_ANALYTICS] });
  };
};

export const useCreateCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Campaign created successfully.");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(errMsg(error, "Failed to create campaign."));
    },
  });
};

export const useUpdateCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateCampaignPayload }) =>
      updateCampaign(uuid, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Campaign updated successfully.");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(errMsg(error, "Failed to update campaign."));
    },
  });
};

export const useUpdateCampaignStatus = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: CampaignStatus }) =>
      updateCampaignStatus(uuid, status),
    onSuccess: (data) => {
      toast.success(data?.message || "Campaign status updated.");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(errMsg(error, "Failed to update campaign status."));
    },
  });
};

export const useResolveQuarantine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: ResolveQuarantinePayload }) =>
      resolveQuarantine(uuid, payload),
    onSuccess: (data, vars) => {
      toast.success(
        data?.message ||
          (vars.payload.action === "APPROVE"
            ? "Referral cleared and returned to pending task."
            : "Referral rejected and expired."),
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REFERRAL_FRAUD_QUARANTINE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REFERRAL_ANALYTICS] });
    },
    onError: (error: any) => {
      toast.error(errMsg(error, "Failed to resolve quarantined referral."));
    },
  });
};

export const useExportReferrals = () =>
  useMutation({
    mutationFn: (campaignUuid?: string) => exportReferralsCsv(campaignUuid),
    onSuccess: () => {
      toast.success("Referral ledger export downloaded.");
    },
    onError: async (error: any) => {
      // Blob responses hide the JSON error message; try to unwrap it
      let message = "Failed to export referral ledger.";
      const data = error?.response?.data;
      if (data instanceof Blob) {
        try {
          const parsed = JSON.parse(await data.text());
          message = parsed?.message || message;
        } catch {
          /* ignore */
        }
      }
      toast.error(message);
    },
  });
