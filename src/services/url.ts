export const BASE_URL = 'https://shift9ja-backend.onrender.com/v1/';

// Admin User Management
export const GET_USERS = 'admin/users';
export const GET_USER_STATS = 'admin/users/stats';
export const GET_USER = (uuid: string) => `admin/users/${uuid}`;
export const UPDATE_USER_STATUS = (uuid: string) => `admin/users/${uuid}/status`;

// Task Management
export const GET_TASKS = 'admin/tasks';
export const GET_TASK_DETAILS = (id: string) => `admin/tasks/${id}`;
export const GET_TASK_STATS = 'admin/tasks/stats';

// Payment & Escrow
export const GET_PAYMENT_STATS = 'admin/payments/stats';
export const GET_TRANSACTIONS = 'admin/payments/transactions';
export const EXPORT_PAYMENTS = 'admin/payments/export';

// Dashboard
export const GET_DASHBOARD_SUMMARY = 'admin/dashboard/summary';
export const GET_TOP_USERS = 'admin/dashboard/top-users';
export const GET_PLATFORM_ACTIVITY = 'admin/dashboard/activity';
export const GET_DASHBOARD_ALERTS = 'admin/dashboard/alerts';

// Roles & Permissions
export const GET_ROLES = 'admin/roles';
export const GET_PERMISSIONS = 'admin/roles/permissions';
export const CREATE_ROLE = 'admin/roles';
export const GET_ROLE_DETAILS = (uuid: string) => `admin/roles/${uuid}`;
export const UPDATE_ROLE = (uuid: string) => `admin/roles/${uuid}`;
export const DELETE_ROLE = (uuid: string) => `admin/roles/${uuid}`;

// Dispute & Reports
export const DISPUTE_STATS = 'admin/disputes/stats';
export const GET_DISPUTES = 'admin/disputes';

// Notifications
export const NOTIFICATION_SETTINGS = 'admin/notifications/settings';
export const BULK_NOTIFICATIONS = 'admin/notifications/bulk';

// Auth & Admin Mgt
export const ADMIN_LOGIN = 'admin/auth/login';
export const ADMIN_INVITE = 'admin/auth/invite';
export const FORGOT_PASSWORD_REQ = 'admin/auth/forgot-password';
export const RESEND_OTP = 'admin/auth/resend-otp';
export const VERIFY_OTP_REQ = 'admin/auth/verify-otp';
export const RESET_PASSWORD_REQ = 'admin/auth/reset-password';
export const CHANGE_PASSWORD_REQ = 'admin/auth/change-password';
export const ACCEPT_INVITATION = 'admin/auth/accept-invitation';
export const GET_ADMINS = 'admin/management';
export const DELETE_ADMIN = (uuid: string) => `admin/management/${uuid}`;
export const GET_ADMIN_DETAILS = (uuid: string) => `admin/management/${uuid}`;
export const TOGGLE_ADMIN_STATUS = (uuid: string) => `admin/management/${uuid}/toggle-status`;
