import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminProfile, updateAdminProfile } from '../api/admin';
import { QUERY_KEYS } from '../queryKeys';
import type { UpdateAdminProfilePayload } from '../../types/index.ts';

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
      // Update session storage if needed, though usually better to rely on query state
      if (data?.data) {
          const user = JSON.parse(sessionStorage.getItem("user") || "{}");
          const updatedUser = { ...user, ...data.data };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('storage'));
      }
    },
  });
};
