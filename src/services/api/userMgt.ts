import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, PaginatedData, UserListItem, UserStats, User } from '../../types';

export const getUsers = async ({ queryKey }: any): Promise<ApiResponse<PaginatedData<UserListItem>>> => {
  const [, page, limit, searchTerm, role, status, city, kycStatus, startDate, endDate] = queryKey;

  const params = new URLSearchParams();

  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (searchTerm) params.append('search', searchTerm);
  if (role) params.append('role', role);
  if (status) params.append('status', status);
  if (city) params.append('city', city);
  if (kycStatus) params.append('kycStatus', kycStatus);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await axiosInstance.get(`${API.GET_USERS}?${params.toString()}`);
  return res.data;
};

export const getUserStats = async ({ queryKey }: any): Promise<ApiResponse<UserStats>> => {
  const [, role] = queryKey;

  const params = new URLSearchParams();

  if (role) params.append('role', role);

  const res = await axiosInstance.get(
    `${API.GET_USER_STATS}?${params.toString()}`
  );
  return res.data;
};

export const getUser = async (uuid: string): Promise<ApiResponse<User>> => {
  const res = await axiosInstance.get(API.GET_USER(uuid));
  return res.data;
};

export interface UpdateUserBasicInfoPayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  bio?: string;
  address?: string;
  isEmailVerified?: boolean;
}

export const updateUser = async (
  uuid: string,
  payload: UpdateUserBasicInfoPayload
): Promise<ApiResponse<User>> => {
  const res = await axiosInstance.patch(API.UPDATE_USER_BASIC_INFO(uuid), payload);
  return res.data;
};

export interface UpdateKycStatusPayload {
  status: 'verified' | 'rejected';
  reason?: string;
}

export const updateUserKycStatus = async (
  uuid: string,
  payload: UpdateKycStatusPayload
): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.patch(API.UPDATE_USER_KYC_STATUS(uuid), payload);
  return res.data;
};

export interface RetryKycPayload {
  type: string;
  idNumber: string;
}

export const retryUserKyc = async (
  uuid: string,
  payload: RetryKycPayload
): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RETRY_USER_KYC(uuid), payload);
  return res.data;
};
