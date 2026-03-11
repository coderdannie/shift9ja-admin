import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PUBLIC_PATHS, PRIVATE_PATHS } from './constants';

const Loadable = (Component: React.ComponentType) => (props: any) => (
  <Suspense fallback={<div className="p-8 text-center text-primary font-medium">Loading...</div>}>
    <Component {...props} />
  </Suspense>
);

const Login = Loadable(lazy(() => import('../pages/Auth/Login')));
const ChangePassword = Loadable(lazy(() => import('../pages/Auth/ChangePassword')));
const ForgotPassword = Loadable(lazy(() => import('../pages/Auth/ForgotPassword')));
const VerifyOTP = Loadable(lazy(() => import('../pages/Auth/VerifyOTP')));
const ResetPassword = Loadable(lazy(() => import('../pages/Auth/ResetPassword')));
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard/Dashboard')));
const UserManagement = Loadable(lazy(() => import('../pages/UserManagement/UserManagement')));
const UserDetail = Loadable(lazy(() => import('../pages/UserManagement/UserDetail')));
const TaskManagement = Loadable(lazy(() => import('../pages/TaskManagement/TaskManagement')));
const TaskDetail = Loadable(lazy(() => import('../pages/TaskManagement/TaskDetail')));
const PaymentEscrow = Loadable(lazy(() => import('../pages/PaymentEscrow/PaymentEscrow')));
const AdminsPage = Loadable(lazy(() => import('../pages/Admins/Admins')));
const ManageRoles = Loadable(lazy(() => import('../pages/Admins/ManageRoles')));
const CreateRole = Loadable(lazy(() => import('../pages/Admins/CreateRole')));

// Placeholder for other pages to avoid import errors, user can add specific implementations later
const Placeholder = (name: string) => () => (
    <div className="card">
        <h1 className="text-xl font-bold">{name} Page</h1>
        <p className="mt-2 text-gray-600">This is a placeholder for the {name} module.</p>
    </div>
);

export const PUBLIC_ROUTES = [
  { path: PUBLIC_PATHS.LOGIN, element: <Login /> },
  { path: PUBLIC_PATHS.CHANGE_PASSWORD, element: <ChangePassword /> },
  { path: PUBLIC_PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: PUBLIC_PATHS.VERIFY_OTP, element: <VerifyOTP /> },
  { path: PUBLIC_PATHS.RESET_PASSWORD, element: <ResetPassword /> },
  { path: '*', element: <Login /> },
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
  { path: PRIVATE_PATHS.ROLES_MANAGEMENT, element: <ManageRoles /> },
  { path: PRIVATE_PATHS.CREATE_ROLE, element: <CreateRole /> },
  { path: PRIVATE_PATHS.EDIT_ROLE, element: <CreateRole /> },
  { path: PRIVATE_PATHS.DISPUTE_REPORTS, element: React.createElement(Placeholder('Dispute & Reports')) },
  { path: PRIVATE_PATHS.NOTIFICATIONS, element: React.createElement(Placeholder('Notifications')) },
  { path: PRIVATE_PATHS.SYSTEM_MESSAGES, element: React.createElement(Placeholder('System Messages')) },
  { path: PRIVATE_PATHS.SETTINGS, element: React.createElement(Placeholder('Settings')) },
  { path: '/', element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
  { path: '*', element: <Navigate to={PRIVATE_PATHS.DASHBOARD} replace /> },
];
