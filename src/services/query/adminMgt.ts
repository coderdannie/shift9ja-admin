import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '../queryKeys';
import * as API from '../api/adminMgt';
import type { ApiResponse, Role, PermissionModule, CreateRolePayload, UpdateRolePayload, AdminUser, InviteAdminPayload } from '../../types/index.ts';
import { toast } from 'react-hot-toast';

export const useGetAdmins = (options?: Partial<UseQueryOptions<ApiResponse<AdminUser[]>>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMINS],
    queryFn: API.getAdmins,
    ...options,
  });
};

export const useInviteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteAdminPayload) => API.inviteAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      toast.success("Admin invited successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to invite admin");
    }
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => API.deleteAdmin(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      toast.success("Admin deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete admin");
    }
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => API.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ROLES] });
      toast.success("Role created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create role");
    }
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateRolePayload }) => API.updateRole(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ROLES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ROLE_DETAILS] });
      toast.success("Role updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => API.deleteRole(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ROLES] });
      toast.success("Role deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete role");
    }
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: any }) => API.updateAdmin(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_DETAILS] });
      toast.success("Admin updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update admin");
    }
  });
};

export const useToggleAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => API.toggleAdminStatus(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMINS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_DETAILS] });
      toast.success("Admin status toggled successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to toggle admin status");
    }
  });
};
