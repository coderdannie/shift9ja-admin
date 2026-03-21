import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getTaskStats, getTasks, getTaskDetails } from '../api/taskMgt';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { ApiResponse, PaginatedResponse, TaskItem, TaskListParams } from '../../types/index.ts';

export const useGetTaskDetails = (id: string, options?: Partial<UseQueryOptions<ApiResponse<TaskItem>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TASK_DETAILS, id],
    queryFn: () => getTaskDetails(id),
    enabled: !!id,
    ...options,
  });
};

export const useGetTasks = (params: TaskListParams = {}, options?: Partial<UseQueryOptions<PaginatedResponse<TaskItem>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TASKS, params],
    queryFn: () => getTasks(params),
    ...options,
  });
};

export const useGetTaskStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TASK_STATS],
    queryFn: getTaskStats,
  });
};
