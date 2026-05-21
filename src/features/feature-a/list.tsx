import { Skeleton } from "@ui/loading";
import { Badge } from "@ui/badge";
import { useFeatureARecords } from "@features/feature-a/hooks";

export function FeatureAList() {
  const { data, isLoading } = useFeatureARecords();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">No records found.</p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-lg border bg-white">
      {data.map((record) => (
        <li key={record.id} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-neutral-900">{record.label}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-neutral-500">{record.value}</span>
            <Badge variant={record.active ? "success" : "default"}>
              {record.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
