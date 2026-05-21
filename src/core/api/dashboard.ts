import { httpResource, defineApiRoute } from "@core/http-resource";

export type DashboardSummary = {
  totalItems: number;
  activeItems: number;
  recentActivity: ActivityEntry[];
};

export type ActivityEntry = {
  id: string;
  type: "created" | "updated" | "deleted";
  entityType: string;
  entityId: string;
  label: string;
  at: string;
};

const summaryRoute = defineApiRoute("GET", "/dashboard/summary");

export function fetchDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  return httpResource(summaryRoute, { signal });
}
