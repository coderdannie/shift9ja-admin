import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { 
  ApiResponse, 
  DashboardSummary, 
  User, 
  DashboardAlertsData, 
  PlatformActivity, 
  TopUsersData,
  UserGeography,
  UserHeatmap,
  MarketHealth,
  RevenueAnalytics,
  RetentionCohort,
  FulfillmentMetrics,
  AnalyticsQueryParams,
  UserCategoryDistribution
} from '../../types/index.ts';

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

export const getPlatformActivity = async (params: any = { limit: 10 }): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.get(API.GET_PLATFORM_ACTIVITY, { params });
  return res.data;
};

export const getUserGeography = async (): Promise<ApiResponse<UserGeography[]>> => {
  const res = await axiosInstance.get(API.GET_USER_GEOGRAPHY);
  return res.data;
};

export const getUserHeatmap = async (): Promise<ApiResponse<UserHeatmap[]>> => {
  const res = await axiosInstance.get(API.GET_USER_HEATMAP);
  return res.data;
};

export const getMarketHealth = async (params: AnalyticsQueryParams = {}): Promise<ApiResponse<MarketHealth[]>> => {
  const res = await axiosInstance.get(API.GET_MARKET_HEALTH, { params });
  return res.data;
};

export const getRevenueAnalytics = async (params: AnalyticsQueryParams = {}): Promise<ApiResponse<RevenueAnalytics[]>> => {
  const res = await axiosInstance.get(API.GET_REVENUE_ANALYTICS, { params });
  return res.data;
};

export const getRetentionCohorts = async (params: AnalyticsQueryParams = {}): Promise<ApiResponse<RetentionCohort[]>> => {
  const res = await axiosInstance.get(API.GET_RETENTION_COHORTS, { params });
  return res.data;
};

export const getFulfillmentMetrics = async (params: AnalyticsQueryParams = {}): Promise<ApiResponse<FulfillmentMetrics[]>> => {
  const res = await axiosInstance.get(API.GET_FULFILLMENT_METRICS, { params });
  return res.data;
};

export const getUserCategoryDistribution = async (): Promise<ApiResponse<UserCategoryDistribution[]>> => {
  const res = await axiosInstance.get(API.GET_USER_CATEGORY_DISTRIBUTION);
  return res.data;
};
