import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile, uploadAvatar } from "@core/api/profile";
import { profileQueryOptions } from "@core/queries";
import { queryKeys } from "@core/keys";
import { toast } from "sonner";
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
      toast.success("Perfil atualizado com sucesso");
    },
    onError: () => toast.error("Erro ao atualizar perfil"),
  });
}

export function useUploadAvatar(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("avatar", file);
      return uploadAvatar(userId, fd);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.profile.detail(userId).queryKey, updated);
      toast.success("Foto atualizada");
    },
    onError: () => toast.error("Erro ao fazer upload da foto"),
  });
}
