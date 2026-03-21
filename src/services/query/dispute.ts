import { useQuery } from '@tanstack/react-query';
import { getDisputeStats, getDisputes } from '../api/dispute';
import { QUERY_KEYS } from '../queryKeys';

export const useGetDisputeStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DISPUTE_STATS],
    queryFn: getDisputeStats,
  });
};

export const useGetDisputes = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DISPUTES, params],
    queryFn: () => getDisputes(params),
  });
};
