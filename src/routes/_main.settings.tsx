import { createFileRoute } from "@tanstack/react-router";
import { settingsQueryOptions } from "@core/queries";
import { PageHeader } from "@ui/header";
import { useSettings } from "@features/settings/hooks";
import { Skeleton } from "@ui/loading";

export const Route = createFileRoute("/_main/settings")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(settingsQueryOptions),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings, isLoading } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Manage your account preferences." />
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : settings ? (
        <div className="rounded-lg border bg-white p-6">
          <pre className="text-xs text-neutral-500">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
