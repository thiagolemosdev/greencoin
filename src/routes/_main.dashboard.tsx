import { createFileRoute } from "@tanstack/react-router";
import { dashboardSummaryQueryOptions } from "@core/queries";
import { PageHeader } from "@ui/header";
import { DashboardSummaryCards } from "@features/dashboard/summary-cards";
import { WidgetBoundary } from "@pattern/widget-boundary";

export const Route = createFileRoute("/_main/dashboard")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(dashboardSummaryQueryOptions),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview of your workspace." />
      <WidgetBoundary>
        <DashboardSummaryCards />
      </WidgetBoundary>
    </div>
  );
}
