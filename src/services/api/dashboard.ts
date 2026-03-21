import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, DashboardSummary, User, DashboardAlertsData, PlatformActivity, TopUsersData } from '../../types/index.ts';

export const getDashboardSummary = async (params = {}): Promise<ApiResponse<DashboardSummary>> => {
  const res = await axiosInstance.get(API.GET_DASHBOARD_SUMMARY, { params });
  return res.data;
};

export const getDashboardAlerts = async (params = {}): Promise<ApiResponse<DashboardAlertsData>> => {
  const res = await axiosInstance.get(API.GET_DASHBOARD_ALERTS, { params });
  return res.data;
};

export const getTopUsers = async (params = { limit: 10 }): Promise<ApiResponse<TopUsersData>> => {
  const res = await axiosInstance.get(API.GET_TOP_USERS, { params });
  return res.data;
};

export const getPlatformActivity = async (params = { limit: 10 }): Promise<ApiResponse<PlatformActivity[]>> => {
  const res = await axiosInstance.get(API.GET_PLATFORM_ACTIVITY, { params });
  return res.data;
};
