import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PUBLIC_PATHS, PRIVATE_PATHS } from "./constants";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Loadable = (Component: React.ComponentType) => (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

const Login = Loadable(lazy(() => import("../pages/Auth/Login")));
const ChangePassword = Loadable(
  lazy(() => import("../pages/Auth/ChangePassword")),
);
const ForgotPassword = Loadable(
  lazy(() => import("../pages/Auth/ForgotPassword")),
);
const VerifyOTP = Loadable(lazy(() => import("../pages/Auth/VerifyOTP")));
const ResetPassword = Loadable(
  lazy(() => import("../pages/Auth/ResetPassword")),
);
const AcceptInvitation = Loadable(
  lazy(() => import("../pages/Auth/AcceptInvitation.tsx")),
);
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard/Dashboard")));
const UserManagement = Loadable(
  lazy(() => import("../pages/UserManagement/UserManagement")),
);
const UserDetail = Loadable(
  lazy(() => import("../pages/UserManagement/UserDetail")),
);
const TaskManagement = Loadable(
  lazy(() => import("../pages/TaskManagement/TaskManagement")),
);
const TaskDetail = Loadable(
  lazy(() => import("../pages/TaskManagement/TaskDetail")),
);
const PaymentEscrow = Loadable(
  lazy(() => import("../pages/PaymentEscrow/PaymentEscrow")),
);
const AdminsPage = Loadable(lazy(() => import("../pages/Admins/Admins")));
const ManageRoles = Loadable(lazy(() => import("../pages/Admins/ManageRoles")));
const CreateRole = Loadable(lazy(() => import("../pages/Admins/CreateRole")));
const AdminDetails = Loadable(
  lazy(() => import("../pages/Admins/AdminDetails.tsx")),
);
const DisputeReports = Loadable(
  lazy(() => import("../pages/DisputeReports/DisputeReports")),
);
const DisputeDetail = Loadable(
  lazy(() => import("../pages/DisputeReports/DisputeDetail.tsx")),
);
const WebsiteInquiries = Loadable(

  lazy(() => import("../pages/WebsiteInquiries/WebsiteInquiries")),
);
const Settings = Loadable(lazy(() => import("../pages/Settings/Settings")));
const SystemMessages = Loadable(
  lazy(() => import("../pages/SystemMessages/SystemMessages")),
);
const AdminChat = Loadable(
  lazy(() => import("../pages/AdminChat/AdminChat")),
);
const ChatRoom = Loadable(
  lazy(() => import("../pages/AdminChat/ChatRoom")),
);
const WebhookManagement = Loadable(
  lazy(() => import("../pages/WebhookManagement/WebhookManagement")),
);
const Analytics = Loadable(lazy(() => import("../pages/Analytics/Analytics")));
const SOSAlerts = Loadable(lazy(() => import("../pages/SOSAlerts/SOSAlerts")));
const NotificationsList = Loadable(
  lazy(() => import("../pages/Notifications/NotificationsList")),
);
const CronJobManagement = Loadable(
  lazy(() => import("../pages/CronJobManagement/CronJobManagement")),
);

export const PUBLIC_ROUTES = [
  { path: PUBLIC_PATHS.LOGIN, element: <Login /> },
  { path: PUBLIC_PATHS.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: PUBLIC_PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: PUBLIC_PATHS.VERIFY_OTP, element: <VerifyOTP /> },
  { path: PUBLIC_PATHS.RESET_PASSWORD, element: <ResetPassword /> },
  { path: PUBLIC_PATHS.ACCEPT_INVITATION, element: <AcceptInvitation /> },
  { path: "*", element: <Login /> },
];

export const PRIVATE_ROUTES = [
  { path: PRIVATE_PATHS.DASHBOARD, element: <Dashboard /> },
  {
    path: PRIVATE_PATHS.ANALYTICS,
    element: <Analytics />,
  },
  {
    path: PRIVATE_PATHS.USER_MANAGEMENT,
    element: <UserManagement />,
    permission: "user_management.view_users",
  },
  { path: PRIVATE_PATHS.USER_DETAIL, element: <UserDetail />, permission: 'user_management.view_users' },
  { path: PRIVATE_PATHS.USER_EDIT, element: <UserDetail />, permission: 'user_management.edit_users' },
  { path: PRIVATE_PATHS.TASK_MANAGEMENT, element: <TaskManagement />, permission: 'task_management.view_tasks' },
  { path: PRIVATE_PATHS.TASK_DETAIL, element: <TaskDetail />, permission: 'task_management.view_tasks' },
  { path: PRIVATE_PATHS.PAYMENT_ESCROW, element: <PaymentEscrow />, permission: 'finance_escrow.view_escrow' },
  { path: PRIVATE_PATHS.ADMINS, element: <AdminsPage />, permission: 'admin_management.manage_admins' },
  { path: PRIVATE_PATHS.ADMIN_DETAIL, element: <AdminDetails />, permission: 'admin_management.manage_admins' },
  { path: PRIVATE_PATHS.ROLES_MANAGEMENT, element: <ManageRoles />, permission: 'admin_management.manage_roles' },
  { path: PRIVATE_PATHS.CREATE_ROLE, element: <CreateRole />, permission: 'admin_management.manage_roles' },
  { path: PRIVATE_PATHS.EDIT_ROLE, element: <CreateRole />, permission: 'admin_management.manage_roles' },
  { path: PRIVATE_PATHS.DISPUTE_REPORTS, element: <DisputeReports />, permission: 'dispute_management.view_reports' },
  { path: PRIVATE_PATHS.DISPUTE_DETAIL, element: <DisputeDetail />, permission: 'dispute_management.view_reports' },
  { path: PRIVATE_PATHS.WEBSITE_INQUIRIES, element: <WebsiteInquiries />, permission: 'website.view_inquiries' },
  {
    path: PRIVATE_PATHS.SYSTEM_MESSAGES,
    element: <SystemMessages />,
    permission: 'system_communications.view_messages'
  },
  { path: PRIVATE_PATHS.ADMIN_CHATS, element: <AdminChat />, permission: 'chats.view_chats' },
  { path: PRIVATE_PATHS.ADMIN_CHAT_DETAIL, element: <AdminChat />, permission: 'chats.view_chats' },
  { path: PRIVATE_PATHS.SETTINGS, element: <Settings />, permission: 'settings.view_settings' },
  { path: PRIVATE_PATHS.WEBHOOKS, element: <WebhookManagement />, permission: 'webhook_management.view_webhooks' },
  { path: PRIVATE_PATHS.SOS_ALERTS, element: <SOSAlerts />, permission: 'task_management.view_tasks' },
  { path: PRIVATE_PATHS.NOTIFICATIONS, element: <NotificationsList />, permission: 'task_management.view_tasks' },
  { path: PRIVATE_PATHS.CRON_JOBS, element: <CronJobManagement />, permission: 'settings.manage_cron' },
  { path: "/", element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
  { path: "*", element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
];
