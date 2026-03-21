import { GET_PAYMENT_STATS, GET_TRANSACTIONS, EXPORT_PAYMENTS } from "../url";
import axiosInstance from '../axiosInstance';

export const getPaymentStats = async () => {
  const res = await axiosInstance.get(GET_PAYMENT_STATS);
  return res.data;
};

export const getTransactions = async ({ queryKey }: any) => {
  const [, page, limit, type, status, search, startDate, endDate] = queryKey;
  
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (type && type !== 'all') params.append('type', type);
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await axiosInstance.get(`${GET_TRANSACTIONS}?${params.toString()}`);
  return res.data;
};

export const exportPayments = async (params: any) => {
  const response = await axiosInstance.get(EXPORT_PAYMENTS, {
    params,
    responseType: 'blob', // Important for file downloads
  });

  // Create a download link and trigger it
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Set filename based on format/type or generic
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = params.format === 'excel' ? 'xlsx' : 'csv';
  link.setAttribute('download', `payments-export-${timestamp}.${extension}`);
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  return response.data;
};
