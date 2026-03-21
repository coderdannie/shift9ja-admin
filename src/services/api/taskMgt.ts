import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, PaginatedResponse, TaskItem, TaskListParams } from '../../types/index.ts';

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
