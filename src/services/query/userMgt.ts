import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import {
  getUsers,
  getUser,
  getUserStats,
} from '../api/userMgt';
import { QUERY_KEYS } from '../queryKeys';
import type { ApiResponse, PaginatedData, UserListItem, UserStats, User } from '../../types';

export const useGetUsers = (
  page = 1,
  limit = 10,
  searchTerm = '',
  role = '',
  status = '',
  city = '',
  options?: Partial<UseQueryOptions<ApiResponse<PaginatedData<UserListItem>>>>
) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [
      QUERY_KEYS.GET_USERS,
      page,
      limit,
      searchTerm,
      role,
      status,
      city,
    ],
    queryFn: getUsers,
    ...options,
  });

  return { data, isPending, isError, refetch };
};

export const useGetUser = (uuid: string, options?: Partial<UseQueryOptions<ApiResponse<User>>>) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DETAILS, uuid],
    queryFn: () => getUser(uuid),
    enabled: !!uuid,
    ...options,
  });

  return { data, isPending, isError, refetch };
};

export const useGetUserStats = (role = '', options?: Partial<UseQueryOptions<ApiResponse<UserStats>>>) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_STATS, role],
    queryFn: getUserStats,
    ...options,
  });

  return { data, isPending, isError, refetch };
};
