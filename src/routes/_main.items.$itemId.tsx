import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { itemByIdQueryOptions } from "@core/queries";
import { PageHeader } from "@ui/header";
import { Badge } from "@ui/badge";
import { Skeleton } from "@ui/loading";
import { Button } from "@ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/items/$itemId")({
  loader: ({ context: { queryClient }, params: { itemId } }) =>
    queryClient.prefetchQuery(itemByIdQueryOptions(itemId)),
  component: ItemDetailPage,
});

function ItemDetailPage() {
  const { itemId } = Route.useParams();
  const { data: item, isLoading } = useQuery(itemByIdQueryOptions(itemId));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={item.title}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/items">← Back</Link>
          </Button>
        }
      />
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2">
          <Badge variant={item.status === "active" ? "success" : "default"}>{item.status}</Badge>
        </div>
        {item.description && (
          <p className="mt-4 text-sm text-neutral-700">{item.description}</p>
        )}
        <p className="mt-4 text-xs text-neutral-400">
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
