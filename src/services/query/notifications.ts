import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { getNotificationSettings, updateNotificationSettings, sendBulkNotification, getSystemMessagesHistory } from "../api/notifications";
import type { NotificationSettings, BulkNotificationPayload, SystemMessagesResponse } from "../../types/notifications";
import toast from "react-hot-toast";

export const useGetNotificationSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATION_SETTINGS],
    queryFn: getNotificationSettings,
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) => updateNotificationSettings(settings),
    // Optimistic Update
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_NOTIFICATION_SETTINGS] });

      // Snapshot the previous value
      const previousSettingsData = queryClient.getQueryData<{ data: NotificationSettings }>([QUERY_KEYS.GET_NOTIFICATION_SETTINGS]);

      // Optimistically update to the new value
      if (previousSettingsData) {
        queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATION_SETTINGS], {
          ...previousSettingsData,
          data: { ...previousSettingsData.data, ...newSettings }
        });
      }

      return { previousSettingsData };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Settings updated successfully");
    },
    onError: (err: any, _newSettings, context) => {
      toast.error(err?.response?.data?.message || "Failed to update settings");
      // Rollback to previous value on error
      if (context?.previousSettingsData) {
        queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATION_SETTINGS], context.previousSettingsData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_NOTIFICATION_SETTINGS] });
    },
  });
};

export const useSendBulkNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkNotificationPayload) => sendBulkNotification(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Notification sent successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SYSTEM_MESSAGES] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send notification");
    },
  });
};

export const useGetSystemMessagesHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SYSTEM_MESSAGES],
    queryFn: getSystemMessagesHistory,
  });
};
