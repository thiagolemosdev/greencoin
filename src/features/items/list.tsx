import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@core/queries";
import { DataGrid } from "@pattern/data-grid";
import { DataGridFooter } from "@pattern/data-grid-footer";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useDebounce } from "@core/hooks";
import { useDeleteItem } from "@features/items/hooks";
import type { ColumnDef } from "@tanstack/react-table";
import type { Item } from "@core/api/items";

const STATUS_VARIANT = {
  active: "success",
  inactive: "default",
  archived: "warning",
} as const;

export type ItemsListProps = {
  onCreateClick: () => void;
  onItemClick: (item: Item) => void;
};

export function ItemsList({ onCreateClick, onItemClick }: ItemsListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const deleteItem = useDeleteItem();

  const { data, isLoading } = useQuery(itemsQueryOptions({ search: debouncedSearch, page }));

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <button
          className="text-left text-sm font-medium text-neutral-900 hover:text-primary-700"
          onClick={() => onItemClick(row.original)}
        >
          {row.original.title}
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ getValue }) => {
        const status = getValue<Item["status"]>();
        return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-sm text-neutral-500">
          {new Date(getValue<string>()).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      size: 60,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteItem.mutate(row.original.id)}
          loading={deleteItem.isPending && deleteItem.variables === row.original.id}
          aria-label="Delete item"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Button variant="primary" size="md" onClick={onCreateClick} className="ml-auto">
          Create item
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <DataGrid
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No items found."
          getRowId={(row) => row.id}
        />
        {data && (
          <DataGridFooter
            page={page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
