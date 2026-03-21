import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { 
  getDashboardSummary,
  getDashboardAlerts,
  getPlatformActivity,
  getTopUsers
} from '../api/dashboard';
import { QUERY_KEYS } from '../queryKeys';
import type { ApiResponse, DashboardSummary, User, DashboardAlertsData, PlatformActivity, TopUsersData } from '../../types/index.ts';

export const useGetDashboardSummary = (params = {}, options?: Partial<UseQueryOptions<ApiResponse<DashboardSummary>>>) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_DASHBOARD_SUMMARY, params],
    queryFn: () => getDashboardSummary(params),
    ...options,
  });

  return { data, isPending, refetch };
};

export const useGetDashboardAlerts = (params = {}, options?: Partial<UseQueryOptions<ApiResponse<DashboardAlertsData>>>) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_DASHBOARD_ALERTS, params],
    queryFn: () => getDashboardAlerts(params),
    ...options,
  });

  return { data, isPending, refetch };
};

export const useGetTopUsers = (params = { limit: 10 }, options?: Partial<UseQueryOptions<ApiResponse<TopUsersData>>>) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_USERS, params],
    queryFn: () => getTopUsers(params),
    ...options,
  });

  return { data, isPending, refetch };
};

export const useGetPlatformActivity = (params = { limit: 10 }, options?: Partial<UseQueryOptions<ApiResponse<PlatformActivity[]>>>) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_PLATFORM_ACTIVITY, params],
    queryFn: () => getPlatformActivity(params),
    ...options,
  });

  return { data, isPending, refetch };
};
