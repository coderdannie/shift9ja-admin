import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createSupportFAQ,
  deleteSupportFAQ,
  getSupportFAQs,
  getSupportMessages,
  getSupportSession,
  getSupportSessions,
  getUnansweredQueue,
  promoteToFAQ,
  sendSupportMessage,
  suggestReply,
  claimSession,
  resolveSession,
  returnSessionToBot,
  updateSupportFAQ,
} from '../api/support';
import { QUERY_KEYS } from '../queryKeys';
import type { InfiniteData } from '@tanstack/react-query';
import type {
  CreateFAQPayload,
  FAQListParams,
  SupportMessagesResponse,
  SupportSessionListParams,
  SupportSessionsResponse,
  UpdateFAQPayload,
} from '../../types/support';

// ── Sessions list (paginated) ──────────────────────────────────────────────────
export const useGetSupportSessions = (
  params: SupportSessionListParams = {},
  options?: any,
) => {
  return useInfiniteQuery<
    SupportSessionsResponse,
    Error,
    InfiniteData<SupportSessionsResponse>,
    any[],
    number
  >({
    queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS, params],
    queryFn: ({ pageParam = 1 }) =>
      getSupportSessions({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.hasNextPage) {
        return (lastPage.meta.page || 1) + 1;
      }
      return undefined;
    },
    retry: false,          // don't hammer a 400 that won't recover
    retryOnMount: false,   // don't re-fire on tab re-focus either
    ...options,
  });
};

// ── Single session detail ──────────────────────────────────────────────────────
export const useGetSupportSession = (uuid: string, options?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SUPPORT_SESSION, uuid],
    queryFn: () => getSupportSession(uuid),
    enabled: !!uuid,
    ...options,
  });
};

// ── Session messages (cursor-based infinite) ───────────────────────────────────
export const useGetInfiniteSupportMessages = (
  uuid: string,
  limit: number = 30,
) => {
  return useInfiniteQuery<
    SupportMessagesResponse,
    Error,
    InfiniteData<SupportMessagesResponse>,
    (string | undefined)[],
    string | number | null
  >({
    queryKey: [QUERY_KEYS.GET_SUPPORT_MESSAGES, 'infinite', uuid],
    queryFn: ({ pageParam }) =>
      getSupportMessages(uuid, { before: pageParam, limit }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    enabled: false, // Backend does not have a history endpoint yet, so this avoids 404 errors
  });
};

// ── Send message ───────────────────────────────────────────────────────────────
export const useSendSupportMessage = (sessionUuid: string) => {
  return useMutation({
    mutationFn: (payload: {
      content: string;
      type?: 'text' | 'image';
      tempId?: string;
    }) => sendSupportMessage(sessionUuid, payload),
  });
};

// ── Claim session ───────────────────────────────────────────────────────────
export const useClaimSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => claimSession(uuid),
    onSuccess: (_data, uuid) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSION, uuid],
      });
    },
  });
};

// ── Resolve session ──────────────────────────────────────────────────────────────
export const useResolveSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      uuid,
      summary,
    }: {
      uuid: string;
      summary?: string;
    }) => resolveSession(uuid, { summary }),
    onSuccess: (_data, { uuid }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSION, uuid],
      });
    },
  });
};

// ── Return session to bot ────────────────────────────────────────────────────────
export const useReturnSessionToBot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => returnSessionToBot(uuid),
    onSuccess: (_data, uuid) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_SESSION, uuid],
      });
    },
  });
};

// ── AI suggest reply ───────────────────────────────────────────────────────────
export const useSuggestReply = () => {
  return useMutation({
    mutationFn: (uuid: string) => suggestReply(uuid),
  });
};

// ── FAQs ───────────────────────────────────────────────────────────────────────
export const useGetSupportFAQs = (params: FAQListParams = {}, options?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SUPPORT_FAQS, params],
    queryFn: () => getSupportFAQs(params),
    ...options,
  });
};

export const useCreateSupportFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFAQPayload) => createSupportFAQ(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_FAQS],
      });
    },
  });
};

export const useUpdateSupportFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateFAQPayload }) =>
      updateSupportFAQ(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_FAQS],
      });
    },
  });
};

export const useDeleteSupportFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => deleteSupportFAQ(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_FAQS],
      });
    },
  });
};

// ── Unanswered queue ───────────────────────────────────────────────────────────
export const useGetUnansweredQueue = (options?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_UNANSWERED_QUEUE],
    queryFn: getUnansweredQueue,
    ...options,
  });
};

export const usePromoteToFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: CreateFAQPayload;
    }) => promoteToFAQ(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_UNANSWERED_QUEUE],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUPPORT_FAQS],
      });
    },
  });
};
