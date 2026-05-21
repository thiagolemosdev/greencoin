import { useQuery } from "@tanstack/react-query";
import { dashboardSummaryQueryOptions } from "@core/queries";

export function useDashboardSummary() {
  return useQuery(dashboardSummaryQueryOptions);
}
