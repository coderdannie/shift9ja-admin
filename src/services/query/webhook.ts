import { useQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getWebhooks, retryWebhook } from '../api/webhook';

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
  return useMutation({
    mutationFn: (uuid: string) => retryWebhook(uuid),
  });
};
