import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import * as API from '../api/adminMgt';
import type { ApiResponse, Role, PermissionModule, CreateRolePayload, UpdateRolePayload, AdminUser, InviteAdminPayload } from '../../types/index.ts';

export const useGetAdmins = (options?: Partial<UseQueryOptions<ApiResponse<AdminUser[]>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMINS],
    queryFn: API.getAdmins,
    ...options,
  });
};

export const useInviteAdmin = () => {
  return useMutation({
    mutationFn: (payload: InviteAdminPayload) => API.inviteAdmin(payload),
  });
};

export const useDeleteAdmin = () => {
  return useMutation({
    mutationFn: (uuid: string) => API.deleteAdmin(uuid),
  });
};

export const useGetAdminDetails = (uuid: string, options?: Partial<UseQueryOptions<ApiResponse<AdminUser>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMIN_DETAILS, uuid],
    queryFn: () => API.getAdminDetails(uuid),
    enabled: !!uuid,
    ...options,
  });
};

export const useGetRoles = (options?: Partial<UseQueryOptions<ApiResponse<Role[]>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROLES],
    queryFn: API.getRoles,
    ...options,
  });
};

export const useGetPermissions = (options?: Partial<UseQueryOptions<ApiResponse<PermissionModule[]>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PERMISSIONS],
    queryFn: API.getPermissions,
    ...options,
  });
};

export const useGetRoleDetails = (uuid: string, options?: Partial<UseQueryOptions<ApiResponse<Role>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROLE_DETAILS, uuid],
    queryFn: () => API.getRoleDetails(uuid),
    enabled: !!uuid,
    ...options,
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => API.createRole(payload),
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateRolePayload }) => API.updateRole(uuid, payload),
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (uuid: string) => API.deleteRole(uuid),
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: any }) => API.updateAdmin(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_DETAILS] });
    },
  });
};

export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => API.toggleAdminStatus(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_DETAILS] });
    },
  });
};
