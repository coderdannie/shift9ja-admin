import axiosInstance from "../axiosInstance";
import { 
  NOTIFICATION_SETTINGS, 
  BULK_NOTIFICATIONS, 
  GET_SYSTEM_MESSAGES,
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  REGISTER_FCM_TOKEN,
  UNREGISTER_FCM_TOKEN,
} from "../url";
import type { 
  NotificationSettingsResponse, 
  NotificationSettings, 
  BulkNotificationPayload, 
  SystemMessagesResponse,
  AdminNotification,
  AdminNotificationPaginatedResponse
} from "../../types/notifications";
import type { ApiResponse } from "../../types/api";

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

export const getAdminNotifications = async (params: { page?: number; limit?: number; type?: string; isRead?: boolean } = {}): Promise<AdminNotificationPaginatedResponse> => {
  const response = await axiosInstance.get(GET_NOTIFICATIONS, { params });
  return response.data;
};

export const markNotificationAsRead = async (uuid: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.patch(MARK_NOTIFICATION_READ(uuid));
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.patch(MARK_ALL_NOTIFICATIONS_READ);
  return response.data;
};

// ─── FCM Web Push Token Registration ───────────────────────────────────────────

export interface FcmTokenPayload {
  token: string;
  platform?: 'web';
  deviceId?: string;
}

export const registerFcmToken = async (payload: FcmTokenPayload): Promise<{ message: string; data: null }> => {
  const response = await axiosInstance.post(REGISTER_FCM_TOKEN, payload);
  return response.data;
};

export const unregisterFcmToken = async (token: string): Promise<{ message: string; data: null }> => {
  const response = await axiosInstance.delete(UNREGISTER_FCM_TOKEN, {
    data: { token },
  });
  return response.data;
};
