import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, PaginatedResponse } from '../../types/api';
import type { TaskItem, TaskListParams, ResolveDisputePayload, SOSAlert } from '../../types/task';


export const getTasks = async (params: TaskListParams = {}): Promise<PaginatedResponse<TaskItem>> => {
  const res = await axiosInstance.get(API.GET_TASKS, { params });
  return res.data;
};

export const getTaskDetails = async (id: string): Promise<ApiResponse<TaskItem>> => {
  const res = await axiosInstance.get(API.GET_TASK_DETAILS(id));
  return res.data;
};

export const getTaskStats = async (): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.get(API.GET_TASK_STATS);
  return res.data;
};

export const resolveDispute = async (uuid: string, payload: ResolveDisputePayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RESOLVE_DISPUTE(uuid), payload);
  return res.data;
};

export const getSOSAlerts = async (params: { taskUuid?: string } = {}): Promise<ApiResponse<SOSAlert[]>> => {
  const res = await axiosInstance.get(API.GET_SOS_ALERTS, { params });
  return res.data;
};

export const resolveSOSAlert = async (uuid: string, payload: { status: string; resolutionNote: string }): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RESOLVE_SOS_ALERT(uuid), payload);
  return res.data;
};

export const cancelTask = async (uuid: string, payload: { reason: string }): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.CANCEL_TASK(uuid), payload);
  return res.data;
};
