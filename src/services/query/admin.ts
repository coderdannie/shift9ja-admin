import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminProfile, updateAdminProfile } from '../api/admin';
import { QUERY_KEYS } from '../queryKeys';
import type { UpdateAdminProfilePayload } from '../../types/index.ts';
import { toast } from 'react-hot-toast';

export const useGetAdminProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMIN_PROFILE],
    queryFn: getAdminProfile,
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAdminProfilePayload) => updateAdminProfile(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_PROFILE] });
      if (data?.data) {
          const user = JSON.parse(sessionStorage.getItem("user") || "{}");
          const updatedUser = { ...user, ...data.data };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('storage'));
      }
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  });
};
