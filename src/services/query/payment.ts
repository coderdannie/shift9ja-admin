import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { 
  getPaymentStats, 
  getTransactions, 
  getPaymentProviders, 
  updatePaymentProvider, 
  activatePaymentProvider 
} from '../api/payment';
import type { ApiResponse, PaymentProviderResponse, PaymentProvider } from '../../types/payment';
import { toast } from 'react-hot-toast';

export const useGetPaymentStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PAYMENT_STATS],
    queryFn: getPaymentStats,
  });
};

export const useGetTransactions = ({ page, limit, type, status, search, startDate, endDate }: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TRANSACTIONS, page, limit, type, status, search, startDate, endDate],
    queryFn: getTransactions,
  });
};

export const useGetPaymentProviders = () => {
  return useQuery<ApiResponse<PaymentProviderResponse>>({
    queryKey: [QUERY_KEYS.GET_PAYMENT_PROVIDERS],
    queryFn: getPaymentProviders,
  });
};

export const useUpdatePaymentProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentProvider> }) => updatePaymentProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PAYMENT_PROVIDERS] });
      toast.success('Payment provider updated successfully');
    },
    onError: (error: any) => {
      const backendError = error?.response?.data;
      let errorMessage = backendError?.message || backendError?.error || (typeof backendError === 'string' ? backendError : null) || error?.message || 'Failed to update payment provider';
      
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      
      toast.error(errorMessage);
    }
  });
};

export const useActivatePaymentProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activatePaymentProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PAYMENT_PROVIDERS] });
      toast.success('Payment provider activated successfully');
    },
    onError: (error: any) => {
      const backendError = error?.response?.data;
      let errorMessage = backendError?.message || backendError?.error || (typeof backendError === 'string' ? backendError : null) || error?.message || 'Failed to activate payment provider';
      
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      
      toast.error(errorMessage);
    }
  });
};
