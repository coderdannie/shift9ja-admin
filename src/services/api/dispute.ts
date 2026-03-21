import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, DisputeStats, Dispute } from '../../types';

export const getDisputeStats = async (): Promise<ApiResponse<DisputeStats>> => {
  const res = await axiosInstance.get(API.DISPUTE_STATS);
  return res.data;
};

export const getDisputes = async (params?: any): Promise<ApiResponse<Dispute[]>> => {
  const res = await axiosInstance.get(API.GET_DISPUTES, { params });
  return res.data;
};
