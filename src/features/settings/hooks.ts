import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "@core/api/settings";
import { settingsQueryOptions } from "@core/queries";
import { queryKeys } from "@core/keys";
import type { UpdateSettingsRequest } from "@core/api/settings";

export function useSettings() {
  return useQuery(settingsQueryOptions);
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsRequest) => updateSettings(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.settings.all.queryKey, updated);
    },
  });
}
