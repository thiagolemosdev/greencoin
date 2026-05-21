import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@core/api/profile";
import { profileQueryOptions } from "@core/queries";
import { queryKeys } from "@core/keys";
import type { UpdateProfileRequest } from "@core/api/profile";

export function useProfile(userId: string) {
  return useQuery(profileQueryOptions(userId));
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => updateProfile(userId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.profile.detail(userId).queryKey, updated);
    },
  });
}
