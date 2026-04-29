import React from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AuthLayout, NonAuthLayout } from '../components/Layout/PageLayout';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './routes';

import { Navigate } from 'react-router-dom';
import { checkPermission } from '../utils/permissionUtils';
import { PRIVATE_PATHS } from './constants';

const PublicRouteWrapper = () => {
  const routes = useRoutes(PUBLIC_ROUTES);
  return routes;
};

const PermissionProtectedRoute = ({ element, permission }: { element: React.ReactNode, permission?: string }) => {
  if (permission && !checkPermission(permission)) {
    return <Navigate to={PRIVATE_PATHS.DASHBOARD} replace />;
  }
  return <>{element}</>;
};

const PrivateRouteWrapper = () => {
  const processedRoutes = PRIVATE_ROUTES.map(route => ({
    ...route,
    element: <PermissionProtectedRoute element={route.element} permission={route.permission} />
  }));
  
  const routes = useRoutes(processedRoutes);
  return routes;
};

const Pages = () => {
  // Mock auth check - looking for 'user' in sessionStorage
  const user = sessionStorage.getItem('user');
  const location = useLocation();

  return user ? (
    <AuthLayout>
      <PrivateRouteWrapper key={location.pathname} />
    </AuthLayout>
  ) : (
    <NonAuthLayout>
      <PublicRouteWrapper key={location.pathname} />
    </NonAuthLayout>
  );
};

export default Pages;
