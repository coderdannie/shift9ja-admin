import type { AdminUser } from '../types/admin';

/**
 * Checks if the current admin has the SUPER_ADMIN role.
 * Super Admins bypass all permission checks.
 */
export const isSuperAdmin = (): boolean => {
  try {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) return false;
    const user: AdminUser = JSON.parse(userJson);
    return user?.roles?.some(role => role.name?.toLowerCase().replace(/[\s_]/g, '') === 'superadmin') ?? false;
  } catch {
    return false;
  }
};

/**
 * Checks if the current admin has a specific permission.
 * Super Admins automatically pass all permission checks.
 * Permissions are checked across all roles assigned to the admin.
 */
export const checkPermission = (permissionKey: string): boolean => {
  try {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) return false;

    const user: AdminUser = JSON.parse(userJson);
    if (!user || !user.roles) return false;

    // Super Admins bypass all permission checks
    if (user.roles.some(role => role.name?.toLowerCase().replace(/[\s_]/g, '') === 'superadmin')) return true;

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
