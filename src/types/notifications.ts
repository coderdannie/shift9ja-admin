export interface NotificationSettings {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  helperToClientMessagingEnabled: boolean;
  clientToHelperMessagingEnabled: boolean;
  platformMessagesEnabled: boolean;
  ssoEnabled: boolean;
  mfaEnforced: boolean;
  allowedMfaMethods: string[];
  mfaGracePeriodDays: number;
  minPasswordLength: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
  blockCommonPasswords: boolean;
  passwordHistoryCount: number;
  sessionTimeoutMinutes: number;
  allowRememberMe: boolean;
  limitConcurrentSessions: boolean;
  maxConcurrentSessions: number;
  metadata: any | null;
}

export interface BulkNotificationPayload {
  title: string;
  content: string;
  targetGroup: 'all' | 'clients' | 'helpers';
}

export interface SystemMessage {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  content: string;
  targetGroup: 'all' | 'clients' | 'helpers';
  priority: 'normal' | 'high';
  publishedAt: string;
  createdById: number;
}

export interface SystemMessagesResponse {
  success: boolean;
  message: string;
  data: SystemMessage[];
}

export interface NotificationSettingsResponse {
  success: boolean;
  message: string;
  data: NotificationSettings;
}

export type AdminNotificationType =
  | 'SOS_ALERT'
  | 'DEVIATION_ALERT'
  | 'NEW_DISPUTE'
  | 'NEW_SUPPORT_CHAT'
  | 'SYSTEM_ALERT'
  | 'LARGE_TRANSACTION';

export interface AdminNotification {
  uuid: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface AdminNotificationPaginatedResponse {
  success: boolean;
  message: string;
  data: {
    data: AdminNotification[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      itemCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}


