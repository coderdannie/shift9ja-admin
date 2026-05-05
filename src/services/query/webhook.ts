import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getWebhooks, retryWebhook } from '../api/webhook';
import { toast } from 'react-hot-toast';

export const useGetWebhooks = (
  page: number,
  limit: number,
  provider?: string,
  event?: string,
  status?: string,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_WEBHOOKS, page, limit, provider, event, status],
    queryFn: getWebhooks,
  });
};

export const useRetryWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => retryWebhook(uuid),
    onSuccess: () => {
      toast.success("Webhook retry initiated!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_WEBHOOKS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to retry webhook");
    }
  });
};
