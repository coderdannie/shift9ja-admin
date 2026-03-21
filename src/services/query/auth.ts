import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { loginAdmin, inviteAdmin, acceptInvitation, forgotPassword, resendOtp, verifyOtp, resetPassword, changePassword } from '../api/auth';
import { QUERY_KEYS } from '../queryKeys';
import type { ApiResponse, LoginResponse, InviteAdminPayload, AdminUser, AcceptInvitationPayload, ForgotPasswordPayload, ResendOtpPayload, VerifyOtpPayload, ResetPasswordPayload, ChangePasswordPayload } from '../../types';

export const useLoginAdmin = (options?: UseMutationOptions<ApiResponse<LoginResponse>, Error, any>) => {
  const { mutate, isPending, data, ...rest } = useMutation({
    mutationFn: loginAdmin,
    mutationKey: [QUERY_KEYS.LOGIN_ADMIN],
    ...options,
  });

  return { mutate, isPending, data, ...rest };
};

export const useInviteAdmin = (options?: UseMutationOptions<ApiResponse<AdminUser>, Error, InviteAdminPayload>) => {
  const { mutate, isPending, data, ...rest } = useMutation({
    mutationFn: inviteAdmin,
    mutationKey: [QUERY_KEYS.INVITE_ADMIN],
    ...options,
  });

  return { mutate, isPending, data, ...rest };
};

export const useAcceptInvitation = (options?: UseMutationOptions<ApiResponse<any>, Error, AcceptInvitationPayload>) => {
  const { mutate, isPending, data, ...rest } = useMutation({
    mutationFn: acceptInvitation,
    mutationKey: [QUERY_KEYS.ACCEPT_INVITATION],
    ...options,
  });

  return { mutate, isPending, data, ...rest };
};

export const useForgotPassword = (options?: UseMutationOptions<ApiResponse<any>, Error, ForgotPasswordPayload>) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: [QUERY_KEYS.FORGOT_PASSWORD],
    ...options,
  });
  return { mutate, isPending, ...rest };
};

export const useResendOtp = (options?: UseMutationOptions<ApiResponse<any>, Error, ResendOtpPayload>) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: resendOtp,
    mutationKey: [QUERY_KEYS.RESEND_OTP],
    ...options,
  });
  return { mutate, isPending, ...rest };
};

export const useVerifyOtp = (options?: UseMutationOptions<ApiResponse<any>, Error, VerifyOtpPayload>) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: verifyOtp,
    mutationKey: [QUERY_KEYS.VERIFY_OTP],
    ...options,
  });
  return { mutate, isPending, ...rest };
};

export const useResetPassword = (options?: UseMutationOptions<ApiResponse<any>, Error, ResetPasswordPayload>) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: resetPassword,
    mutationKey: [QUERY_KEYS.RESET_PASSWORD],
    ...options,
  });
  return { mutate, isPending, ...rest };
};

export const useChangePassword = (options?: UseMutationOptions<ApiResponse<any>, Error, ChangePasswordPayload>) => {
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: changePassword,
    mutationKey: [QUERY_KEYS.CHANGE_PASSWORD],
    ...options,
  });
  return { mutate, isPending, ...rest };
};
