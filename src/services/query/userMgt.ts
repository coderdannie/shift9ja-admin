import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import {
  getUsers,
  getUser,
  getUserStats,
  updateUser,
  type UpdateUserBasicInfoPayload,
  updateUserKycStatus,
  retryUserKyc,
  type RetryKycPayload,
} from '../api/userMgt';
import { QUERY_KEYS } from '../queryKeys';
import type { ApiResponse, PaginatedData, UserListItem, UserStats, User } from '../../types';
import { toast } from 'react-hot-toast';

export const useGetUsers = (
  page = 1,
  limit = 10,
  searchTerm = '',
  role = '',
  status = '',
  city = '',
  kycStatus = '',
  startDate = '',
  endDate = '',
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
      kycStatus,
      startDate,
      endDate,
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

export const useUpdateUser = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserBasicInfoPayload) => updateUser(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_DETAILS, uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USERS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user');
    },
  });
};

export const useUpdateUserKycStatus = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { status: 'verified' | 'rejected'; reason?: string }) =>
      updateUserKycStatus(uuid, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_DETAILS, uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_STATS] });
      toast.success(data.message || 'User KYC status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user KYC status');
    },
  });
};

export const useRetryUserKyc = (uuid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RetryKycPayload) => retryUserKyc(uuid, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_DETAILS, uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USERS] });
      toast.success(data.message || 'User KYC data retrieved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to retry KYC verification');
    },
  });
};
