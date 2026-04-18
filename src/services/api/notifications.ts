import axiosInstance from "../axiosInstance";
import { NOTIFICATION_SETTINGS, BULK_NOTIFICATIONS, GET_SYSTEM_MESSAGES } from "../url";
import type { NotificationSettingsResponse, NotificationSettings, BulkNotificationPayload, SystemMessagesResponse } from "../../types/notifications";

export const getNotificationSettings = async (): Promise<NotificationSettingsResponse> => {
  const response = await axiosInstance.get(NOTIFICATION_SETTINGS);
  return response.data;
};

export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettingsResponse> => {
  const response = await axiosInstance.patch(NOTIFICATION_SETTINGS, settings);
  return response.data;
};

export const sendBulkNotification = async (
  payload: BulkNotificationPayload
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post(BULK_NOTIFICATIONS, payload);
  return response.data;
};

export const getSystemMessagesHistory = async (): Promise<SystemMessagesResponse> => {
  const response = await axiosInstance.get(GET_SYSTEM_MESSAGES);
  return response.data;
};
