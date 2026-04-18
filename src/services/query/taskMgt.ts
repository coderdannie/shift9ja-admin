import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getTaskStats, getTasks, getTaskDetails, resolveDispute } from '../api/taskMgt';
import type { ApiResponse, PaginatedResponse, TaskItem, TaskListParams, ResolveDisputePayload } from '../../types';


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

export const useResolveDispute = () => {
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: ResolveDisputePayload }) => 
      resolveDispute(uuid, payload),
  });
};

