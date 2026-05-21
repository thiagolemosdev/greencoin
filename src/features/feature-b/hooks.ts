import { useMutation } from "@tanstack/react-query";
import { httpResource, defineApiRoute } from "@core/http-resource";
import type { FeatureBDialogValues } from "@features/feature-b/schemas";

const submitRoute = defineApiRoute("POST", "/feature-b/submit");

export function useFeatureBSubmit() {
  return useMutation({
    mutationFn: (body: FeatureBDialogValues) =>
      httpResource<void>(submitRoute, { body }),
  });
}
