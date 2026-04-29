import React from 'react';
import { checkPermission, hasAnyPermission } from '../../utils/permissionUtils';

interface PermissionGuardProps {
  permission?: string;
  anyPermission?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component that conditionally renders its children
 * based on whether the current admin has the required permissions.
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  anyPermission, 
  children, 
  fallback = null 
}) => {
  let hasAccess = false;

  if (permission) {
    hasAccess = checkPermission(permission);
  } else if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAnyPermission(anyPermission);
  } else {
    // If no permission is specified, allow access by default
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
