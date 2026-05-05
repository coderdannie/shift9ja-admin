export interface PermissionItem {
  key: string;
  label: string;
  description: string;
}

export interface PermissionModule {
  name: string;
  permissions: string[];
}

export interface Role {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  permissions: string[];
  adminsCount?: number;
}

export interface AdminUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  roles: Role[];
  isActive: boolean;
  avatarUrl: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InviteAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: string[];
}

export type UpdateRolePayload = CreateRolePayload;

export interface UpdateAdminProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}
