import type { AdminUser } from '../types/admin';

/**
 * Checks if the current admin has a specific permission.
 * Permissions are checked across all roles assigned to the admin.
 */
export const checkPermission = (permissionKey: string): boolean => {
  try {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) return false;

    const user: AdminUser = JSON.parse(userJson);
    if (!user || !user.roles) return false;

    // Flatten all permissions from all roles and check for the key
    return user.roles.some(role => 
      role.permissions?.includes(permissionKey)
    );
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Checks if the current admin has ANY of the provided permissions.
 */
export const hasAnyPermission = (permissionKeys: string[]): boolean => {
  return permissionKeys.some(key => checkPermission(key));
};

/**
 * Checks if the current admin has ALL of the provided permissions.
 */
export const hasAllPermissions = (permissionKeys: string[]): boolean => {
  return permissionKeys.every(key => checkPermission(key));
};
