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
  { path: PRIVATE_PATHS.USER_MANAGEMENT, element: <UserManagement /> },
  { path: PRIVATE_PATHS.USER_DETAIL, element: <UserDetail /> },
  { path: PRIVATE_PATHS.USER_EDIT, element: <UserDetail /> },
  { path: PRIVATE_PATHS.TASK_MANAGEMENT, element: <TaskManagement /> },
  { path: PRIVATE_PATHS.TASK_DETAIL, element: <TaskDetail /> },
  { path: PRIVATE_PATHS.PAYMENT_ESCROW, element: <PaymentEscrow /> },
  { path: PRIVATE_PATHS.ADMINS, element: <AdminsPage /> },
  { path: PRIVATE_PATHS.ADMIN_DETAIL, element: <AdminDetails /> },
  { path: PRIVATE_PATHS.ROLES_MANAGEMENT, element: <ManageRoles /> },
  { path: PRIVATE_PATHS.CREATE_ROLE, element: <CreateRole /> },
  { path: PRIVATE_PATHS.EDIT_ROLE, element: <CreateRole /> },
  { path: PRIVATE_PATHS.DISPUTE_REPORTS, element: <DisputeReports /> },
  { path: PRIVATE_PATHS.DISPUTE_DETAIL, element: <DisputeDetail /> },
  { path: PRIVATE_PATHS.WEBSITE_INQUIRIES, element: <WebsiteInquiries /> },
  {
    path: PRIVATE_PATHS.SYSTEM_MESSAGES,
    element: <SystemMessages />,
  },
  { path: PRIVATE_PATHS.ADMIN_CHATS, element: <AdminChat /> },
  { path: PRIVATE_PATHS.ADMIN_CHAT_DETAIL, element: <ChatRoom /> },
  { path: PRIVATE_PATHS.SETTINGS, element: <Settings /> },
  { path: "/", element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
  { path: "*", element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
];
