import axiosInstance from '../axiosInstance';
import * as API from '../url';
import type {
  SupportSessionsResponse,
  SupportMessagesResponse,
  SupportSessionListParams,
  FAQListParams,
  FAQListResponse,
  FAQResponse,
  UnansweredQueueResponse,
  SuggestReplyResponse,
  SessionDetailResponse,
  CreateFAQPayload,
  UpdateFAQPayload,
} from '../../types/support';
import type { ApiResponse } from '../../types/api';

// ── Sessions ───────────────────────────────────────────────────────────────────
export const getSupportSessions = async (
  params: SupportSessionListParams = {},
): Promise<SupportSessionsResponse> => {
  const res = await axiosInstance.get(API.GET_SUPPORT_SESSIONS, { params });
  const raw = res.data;

  // Normalize: backend may return a raw array OR { data: [], meta: {} } OR
  // the standard { success, message, data, meta } envelope
  if (Array.isArray(raw)) {
    return {
      data: raw,
      meta: {
        page: params.page || 1,
        limit: params.limit || 20,
        totalItems: raw.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  // Wrapped envelope: { data: { data: [], meta: {} } } or { data: [], meta: {} }
  if (raw?.data && Array.isArray(raw.data)) {
    return { data: raw.data, meta: raw.meta ?? raw.data.meta ?? {} };
  }

  // Fallback — return as-is and hope for the best
  return raw;
};

export const getSupportSession = async (uuid: string): Promise<SessionDetailResponse> => {
  const res = await axiosInstance.get(API.GET_SUPPORT_SESSION(uuid));
  const raw = res.data;

  // If backend returns the session directly (not wrapped in ApiResponse)
  if (raw && !raw.data && raw.uuid) {
    return { data: raw, message: 'ok', success: true } as any;
  }

  return raw;
};

export const getSupportMessages = async (
  uuid: string,
  params: { before?: string | number | null; limit?: number } = {},
): Promise<SupportMessagesResponse> => {
  const res = await axiosInstance.get(API.GET_SUPPORT_MESSAGES(uuid), { params });
  return res.data;
};

export const sendSupportMessage = async (
  uuid: string,
  payload: { content: string; type?: 'text' | 'image'; tempId?: string },
): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.SEND_SUPPORT_MESSAGE(uuid), payload);
  return res.data;
};

export const claimSession = async (uuid: string): Promise<SessionDetailResponse> => {
  const res = await axiosInstance.patch(API.CLAIM_SUPPORT_SESSION(uuid));
  return res.data;
};

export const resolveSession = async (
  uuid: string,
  payload?: { summary?: string },
): Promise<SessionDetailResponse> => {
  const res = await axiosInstance.patch(API.RESOLVE_SUPPORT_SESSION(uuid), payload);
  return res.data;
};

export const returnSessionToBot = async (uuid: string): Promise<SessionDetailResponse> => {
  const res = await axiosInstance.patch(API.RETURN_SUPPORT_SESSION_TO_BOT(uuid));
  return res.data;
};

export const suggestReply = async (uuid: string): Promise<SuggestReplyResponse> => {
  const res = await axiosInstance.post(API.SUGGEST_SUPPORT_REPLY(uuid));
  return res.data;
};

// ── FAQs ───────────────────────────────────────────────────────────────────────
export const getSupportFAQs = async (params: FAQListParams = {}): Promise<FAQListResponse> => {
  const res = await axiosInstance.get(API.GET_SUPPORT_FAQS, { params });
  return res.data;
};

export const createSupportFAQ = async (payload: CreateFAQPayload): Promise<FAQResponse> => {
  const res = await axiosInstance.post(API.CREATE_SUPPORT_FAQ, payload);
  return res.data;
};

export const updateSupportFAQ = async (
  uuid: string,
  payload: UpdateFAQPayload,
): Promise<FAQResponse> => {
  const res = await axiosInstance.patch(API.UPDATE_SUPPORT_FAQ(uuid), payload);
  return res.data;
};

export const deleteSupportFAQ = async (uuid: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.delete(API.DELETE_SUPPORT_FAQ(uuid));
  return res.data;
};

// ── Unanswered Queue ───────────────────────────────────────────────────────────
export const getUnansweredQueue = async (): Promise<UnansweredQueueResponse> => {
  const res = await axiosInstance.get(API.GET_UNANSWERED_QUEUE);
  return res.data;
};

export const promoteToFAQ = async (
  uuid: string,
  payload: CreateFAQPayload,
): Promise<FAQResponse> => {
  const res = await axiosInstance.post(API.PROMOTE_UNANSWERED_TO_FAQ(uuid), payload);
  return res.data;
};

// ── Analytics & Config ────────────────────────────────────────────────────────
export const getAiConfig = async (): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.get(API.GET_AI_CONFIG);
  return res.data;
};

export const updateAiConfig = async (payload: any): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.put(API.UPDATE_AI_CONFIG, payload);
  return res.data;
};

export const getSupportAnalytics = async (params: { from?: string; to?: string } = {}): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.get(API.GET_SUPPORT_ANALYTICS_COSTS, { params });
  return res.data;
};
