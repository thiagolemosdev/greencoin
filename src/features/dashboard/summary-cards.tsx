import { Skeleton } from "@ui/loading";
import { useDashboardSummary } from "@features/dashboard/hooks";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-8 w-16" />
    </div>
  );
}

export function DashboardSummaryCards() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total Items" value={data.totalItems} />
      <StatCard label="Active Items" value={data.activeItems} />
      <StatCard label="Recent Activity" value={data.recentActivity.length} />
    </div>
  );
}
