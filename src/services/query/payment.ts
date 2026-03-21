import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getPaymentStats, getTransactions } from '../api/payment';

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
