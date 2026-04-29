import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, PaginatedData, Webhook } from '../../types';

export const getWebhooks = async ({ queryKey }: any): Promise<ApiResponse<PaginatedData<Webhook>>> => {
  const [, page, limit, provider, event, status] = queryKey;

  const params = new URLSearchParams();

  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (provider) params.append('provider', provider);
  if (event) params.append('event', event);
  if (status) params.append('status', status);

  const res = await axiosInstance.get(`${API.GET_WEBHOOKS}?${params.toString()}`);
  return res.data;
};

export const retryWebhook = async (uuid: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RETRY_WEBHOOK(uuid));
  return res.data;
};
