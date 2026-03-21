import * as API from '../url';
import axiosInstance from '../axiosInstance';
import type { ApiResponse, LoginResponse, InviteAdminPayload, AdminUser, AcceptInvitationPayload, ForgotPasswordPayload, ResendOtpPayload, VerifyOtpPayload, ResetPasswordPayload, ChangePasswordPayload } from '../../types';

export const loginAdmin = async (data: any): Promise<ApiResponse<LoginResponse>> => {
  const res = await axiosInstance.post(API.ADMIN_LOGIN, data);
  return res.data;
};

export const inviteAdmin = async (data: InviteAdminPayload): Promise<ApiResponse<AdminUser>> => {
  const res = await axiosInstance.post(API.ADMIN_INVITE, data);
  return res.data;
};

export const acceptInvitation = async (data: AcceptInvitationPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.ACCEPT_INVITATION, data);
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.FORGOT_PASSWORD_REQ, data);
  return res.data;
};

export const resendOtp = async (data: ResendOtpPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RESEND_OTP, data);
  return res.data;
};

export const verifyOtp = async (data: VerifyOtpPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.VERIFY_OTP_REQ, data);
  return res.data;
};

export const resetPassword = async (data: ResetPasswordPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.RESET_PASSWORD_REQ, data);
  return res.data;
};

export const changePassword = async (data: ChangePasswordPayload): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.patch(API.CHANGE_PASSWORD_REQ, data);
  return res.data;
};
