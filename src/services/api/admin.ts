import * as API from "../url";
import axiosInstance from "../axiosInstance";
import type { ApiResponse, AdminUser, UpdateAdminProfilePayload } from "../../types/index.ts";

export const getAdminProfile = async (): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.get(API.ADMIN_PROFILE);
  return res.data;
};

export const updateAdminProfile = async (payload: UpdateAdminProfilePayload): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.patch(API.ADMIN_PROFILE, payload);
  return res.data;
};
