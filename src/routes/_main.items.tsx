import { createFileRoute } from "@tanstack/react-router";
import { itemsQueryOptions } from "@core/queries";
import { PageHeader } from "@ui/header";
import { ItemsList } from "@features/items/list";
import { CreateItemDialog } from "@features/items/create-dialog";
import { useDisclosure } from "@core/hooks";

export const Route = createFileRoute("/_main/items")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(itemsQueryOptions()),
  component: ItemsPage,
});

function ItemsPage() {
  const createDialog = useDisclosure();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Items" description="Manage your items." />
      <ItemsList
        onCreateClick={createDialog.open}
        onItemClick={(item) => {
          // Navigate to item detail
          void item;
        }}
      />
      <CreateItemDialog open={createDialog.isOpen} onClose={createDialog.close} />
    </div>
  );
}
