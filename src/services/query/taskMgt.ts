import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getTaskStats, getTasks, getTaskDetails, resolveDispute, getSOSAlerts, resolveSOSAlert } from '../api/taskMgt';
import type { ApiResponse, PaginatedResponse, TaskItem, TaskListParams, ResolveDisputePayload } from '../../types';
import { toast } from 'react-hot-toast';

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
    onSuccess: () => {
      toast.success("Dispute resolved successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resolve dispute");
    }
  });
};

export const useGetSOSAlerts = (params: { taskUuid?: string } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SOS_ALERTS, params],
    queryFn: () => getSOSAlerts(params),
  });
};

export const useResolveSOSAlert = () => {
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: { status: string; resolutionNote: string } }) => 
      resolveSOSAlert(uuid, payload),
    onSuccess: () => {
      toast.success("SOS alert resolved successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resolve SOS alert");
    }
  });
};
