import * as API from "../url";
import axiosInstance from "../axiosInstance";
import type { ApiResponse, Role, PermissionModule, CreateRolePayload, UpdateRolePayload, AdminUser, InviteAdminPayload } from "../../types/index.ts";

export const getAdmins = async (): Promise<ApiResponse<AdminUser[]>> => {
  const res = await axiosInstance.get(API.GET_ADMINS);
  return res.data;
};

export const inviteAdmin = async (payload: InviteAdminPayload): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.post(API.ADMIN_INVITE, payload);
  return res.data;
};

export const deleteAdmin = async (uuid: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.delete(API.DELETE_ADMIN(uuid));
  return res.data;
};

export const getAdminDetails = async (uuid: string): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.get(API.GET_ADMIN_DETAILS(uuid));
  return res.data;
};

export const updateAdmin = async (uuid: string, payload: Partial<InviteAdminPayload> & { isActive?: boolean }): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.patch(API.GET_ADMIN_DETAILS(uuid), payload);
  return res.data;
};

export const toggleAdminStatus = async (uuid: string): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.patch(API.TOGGLE_ADMIN_STATUS(uuid));
  return res.data;
};

export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const res = await axiosInstance.get(API.GET_ROLES);
  return res.data;
};

export const getPermissions = async (): Promise<ApiResponse<PermissionModule[]>> => {
  const res = await axiosInstance.get(API.GET_PERMISSIONS);
  return res.data;
};

export const getRoleDetails = async (uuid: string): Promise<ApiResponse<Role>> => {
  const res = await axiosInstance.get(API.GET_ROLE_DETAILS(uuid));
  return res.data;
};

export const createRole = async (payload: CreateRolePayload): Promise<ApiResponse<Role>> => {
  const res = await axiosInstance.post(API.CREATE_ROLE, payload);
  return res.data;
};

export const updateRole = async (uuid: string, payload: UpdateRolePayload): Promise<ApiResponse<Role>> => {
  const res = await axiosInstance.put(API.UPDATE_ROLE(uuid), payload);
  return res.data;
};

export const deleteRole = async (uuid: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.delete(API.DELETE_ROLE(uuid));
  return res.data;
};
