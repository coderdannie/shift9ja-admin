export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://shift9ja-backend.onrender.com/v1").replace(/\/$/, "") + "/";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://shift9ja-backend.onrender.com";

// Admin User Management
export const GET_USERS = "admin/users";
export const GET_USER_STATS = "admin/users/stats";
export const GET_USER = (uuid: string) => `admin/users/${uuid}`;
export const UPDATE_USER_STATUS = (uuid: string) =>
  `admin/users/${uuid}/status`;
export const UPDATE_USER_BASIC_INFO = (uuid: string) =>
  `admin/users/${uuid}/basic-info`;
export const UPDATE_USER_KYC_STATUS = (uuid: string) =>
  `admin/users/${uuid}/kyc-status`;
export const RETRY_USER_KYC = (uuid: string) =>
  `admin/users/${uuid}/retry-kyc`;

// Task Management
export const GET_TASKS = "admin/tasks";
export const GET_TASK_DETAILS = (id: string) => `admin/tasks/${id}`;
export const GET_TASK_STATS = "admin/tasks/stats";
export const RESOLVE_DISPUTE = (uuid: string) =>
  `admin/tasks/${uuid}/resolve-dispute`;
export const GET_SOS_ALERTS = "admin/tasks/sos-alerts";
export const RESOLVE_SOS_ALERT = (uuid: string) => `admin/tasks/sos-alerts/${uuid}/resolve`;
export const CANCEL_TASK = (uuid: string) => `admin/tasks/${uuid}/cancel`;

// Payment & Escrow
export const GET_PAYMENT_STATS = "admin/payments/stats";
export const GET_TRANSACTIONS = "admin/payments/transactions";
export const EXPORT_PAYMENTS = "admin/payments/export";

// Dashboard & Analytics
export const GET_DASHBOARD_SUMMARY = "admin/dashboard/summary";
export const GET_TOP_USERS = "admin/dashboard/top-users";
export const GET_PLATFORM_ACTIVITY = "admin/dashboard/activity";
export const GET_DASHBOARD_ALERTS = "admin/dashboard/alerts";
export const GET_USER_GEOGRAPHY = "admin/dashboard/user-geography";
export const GET_USER_HEATMAP = "admin/dashboard/heatmap";
export const GET_MARKET_HEALTH = "admin/dashboard/market-health";
export const GET_REVENUE_ANALYTICS = "admin/dashboard/revenue-analytics";
export const GET_RETENTION_COHORTS = "admin/dashboard/retention-cohorts";
export const GET_FULFILLMENT_METRICS = "admin/dashboard/fulfillment-metrics";
export const GET_USER_CATEGORY_DISTRIBUTION = "admin/dashboard/user-category-distribution";

// Roles & Permissions
export const GET_ROLES = "admin/roles";
export const GET_PERMISSIONS = "admin/roles/permissions";
export const CREATE_ROLE = "admin/roles";
export const GET_ROLE_DETAILS = (uuid: string) => `admin/roles/${uuid}`;
export const UPDATE_ROLE = (uuid: string) => `admin/roles/${uuid}`;
export const DELETE_ROLE = (uuid: string) => `admin/roles/${uuid}`;

// Dispute & Reports
export const DISPUTE_STATS = "admin/disputes/stats";
export const GET_DISPUTES = "admin/disputes";
export const GET_DISPUTE_DETAILS = (uuid: string) => `admin/disputes/${uuid}`;

// Notifications
export const NOTIFICATION_SETTINGS = "admin/notifications/settings";
export const BULK_NOTIFICATIONS = "admin/system-messages/publish";
export const GET_SYSTEM_MESSAGES = "admin/system-messages";
export const GET_NOTIFICATIONS = "admin/notifications";
export const MARK_NOTIFICATION_READ = (uuid: string) => `admin/notifications/${uuid}/read`;
export const MARK_ALL_NOTIFICATIONS_READ = "admin/notifications/read-all";

// FCM Web Push
export const REGISTER_FCM_TOKEN = "admin/notifications/fcm/register";
export const UNREGISTER_FCM_TOKEN = "admin/notifications/fcm/unregister";

// Website Inquiries
export const GET_WAITLIST = "admin/waitlist";

// Auth & Admin Mgt
export const ADMIN_LOGIN = "admin/auth/login";
export const ADMIN_INVITE = "admin/auth/invite";
export const FORGOT_PASSWORD_REQ = "admin/auth/forgot-password";
export const RESEND_OTP = "admin/auth/resend-otp";
export const VERIFY_OTP_REQ = "admin/auth/verify-otp";
export const RESET_PASSWORD_REQ = "admin/auth/reset-password";
export const CHANGE_PASSWORD_REQ = "admin/auth/change-password";
export const ACCEPT_INVITATION = "admin/auth/accept-invitation";
export const GET_ADMINS = "admin/management";
export const DELETE_ADMIN = (uuid: string) => `admin/management/${uuid}`;
export const GET_ADMIN_DETAILS = (uuid: string) => `admin/management/${uuid}`;
export const TOGGLE_ADMIN_STATUS = (uuid: string) =>
  `admin/management/${uuid}/toggle-status`;
export const ADMIN_PROFILE = "admin/profile";

// Payment Providers
export const GET_PAYMENT_PROVIDERS = "admin/payment-providers";
export const UPDATE_PAYMENT_PROVIDER = (id: string) =>
  `admin/payment-providers/${id}`;
export const ACTIVATE_PAYMENT_PROVIDER = (id: string) =>
  `admin/payment-providers/${id}/activate`;

// Chat & Mediation
export const GET_ADMIN_CHATS = "admin/chats";
export const INITIATE_DISPUTE_CHAT = "admin/chats/initiate-dispute";
export const GET_CHAT_MESSAGES = (uuid: string) =>
  `admin/chats/${uuid}/messages`;
export const MARK_CHAT_AS_READ = (uuid: string) => `admin/chats/${uuid}/read`;
export const CLAIM_CHAT = (uuid: string) => `admin/chats/${uuid}/claim`;
export const GET_CLOUDINARY_SIGNATURE = "admin/cloudinary/signature";

// Webhooks
export const GET_WEBHOOKS = "admin/webhooks";
export const RETRY_WEBHOOK = (uuid: string) => `admin/webhooks/${uuid}/retry`;

// Cron Job Management
export const GET_CRON_JOBS = "admin/cron";
export const START_CRON_JOB = (name: string) => `admin/cron/${name}/start`;
export const STOP_CRON_JOB = (name: string) => `admin/cron/${name}/stop`;
export const TRIGGER_CRON_JOB = (name: string) => `admin/cron/${name}/trigger`;

// AI Support Sessions
export const GET_SUPPORT_SESSIONS = "admin/support/sessions";
export const GET_SUPPORT_SESSION = (uuid: string) => `admin/support/sessions/${uuid}`;
export const CLAIM_SUPPORT_SESSION = (uuid: string) => `admin/support/sessions/${uuid}/claim`;
export const RESOLVE_SUPPORT_SESSION = (uuid: string) => `admin/support/sessions/${uuid}/resolve`;
export const RETURN_SUPPORT_SESSION_TO_BOT = (uuid: string) => `admin/support/sessions/${uuid}/return-to-bot`;
export const SUGGEST_SUPPORT_REPLY = (uuid: string) => `admin/support/sessions/${uuid}/suggest`;
export const GET_SUPPORT_MESSAGES = (uuid: string) => `admin/support/sessions/${uuid}/messages`;
export const SEND_SUPPORT_MESSAGE = (uuid: string) => `admin/support/sessions/${uuid}/messages`;

// Support FAQ Management
export const GET_SUPPORT_FAQS = "admin/support/faqs";
export const CREATE_SUPPORT_FAQ = "admin/support/faqs";
export const GET_SUPPORT_FAQ = (uuid: string) => `admin/support/faqs/${uuid}`;
export const UPDATE_SUPPORT_FAQ = (uuid: string) => `admin/support/faqs/${uuid}`;
export const DELETE_SUPPORT_FAQ = (uuid: string) => `admin/support/faqs/${uuid}`;

// Unanswered Query Queue
export const GET_UNANSWERED_QUEUE = 'admin/support/knowledge-base/unanswered';
export const PROMOTE_UNANSWERED_TO_FAQ = (uuid: string) =>
  `admin/support/knowledge-base/unanswered/${uuid}/promote`;

// AI Provider Configuration
export const GET_AI_CONFIG = "admin/support/ai-config";
export const UPDATE_AI_CONFIG = "admin/support/ai-config";

// AI Financial Analytics
export const GET_SUPPORT_ANALYTICS_COSTS = "admin/support/analytics/costs";
