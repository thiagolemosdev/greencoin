import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { httpResource, defineApiRoute } from "@core/http-resource";
import type { FeatureARecord } from "@features/feature-a/schemas";

const listRoute = defineApiRoute("GET", "/feature-a/records");

const featureAQueryOptions = queryOptions({
  queryKey: ["feature-a", "records"],
  queryFn: ({ signal }) =>
    httpResource<FeatureARecord[]>(listRoute, { signal }),
  staleTime: 1000 * 60 * 5,
});

export function useFeatureARecords() {
  return useQuery(featureAQueryOptions);
}
