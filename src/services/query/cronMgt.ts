import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import { getCronJobs, startCronJob, stopCronJob, triggerCronJob } from '../api/cronMgt';
import { toast } from 'react-hot-toast';

export const useGetCronJobs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CRON_JOBS],
    queryFn: getCronJobs,
    refetchInterval: 30_000, // auto-refresh every 30s
  });
};

export const useStartCronJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => startCronJob(name),
    onSuccess: (data) => {
      toast.success(data?.message || 'Cron job started successfully.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CRON_JOBS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to start cron job.');
    },
  });
};

export const useStopCronJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => stopCronJob(name),
    onSuccess: (data) => {
      toast.success(data?.message || 'Cron job stopped successfully.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CRON_JOBS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to stop cron job.');
    },
  });
};

export const useTriggerCronJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => triggerCronJob(name),
    onSuccess: (data) => {
      toast.success(data?.message || 'Cron job triggered successfully.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CRON_JOBS] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to trigger cron job.');
    },
  });
};
