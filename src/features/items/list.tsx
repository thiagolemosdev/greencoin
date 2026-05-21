import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "@core/queries";
import { useDebounce } from "@core/hooks";
import { useDeleteItem } from "@features/items/hooks";
import type { Item } from "@core/api/items";

const STATUS_STYLE = {
  active:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
} as const;

const STATUS_LABEL = { active: "Ativo", inactive: "Inativo", archived: "Arquivado" } as const;

export type ItemsListProps = {
  onCreateClick: () => void;
  onItemClick: (item: Item) => void;
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconTrash = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);
const IconEmpty = () => (
  <svg className="h-14 w-14 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path d="M9 12h6m-3-3v6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
  </svg>
);
const IconPlus = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-[#1e1e1e]">
      <td className="px-4 py-3.5"><div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
      <td className="px-4 py-3.5"><div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" /></td>
    </tr>
  );
}

// ── List ──────────────────────────────────────────────────────────────────────
export function ItemsList({ onCreateClick, onItemClick }: ItemsListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const deleteItem = useDeleteItem();

  const { data, isLoading } = useQuery(
    itemsQueryOptions({ search: debouncedSearch, page }),
  );

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div className="space-y-4">
      {/* Barra de ações */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <IconSearch />
          </span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar itens…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-green-500/30 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
        >
          <IconPlus />
          Novo item
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1e1e1e]">
                {["Título", "Status", "Atualizado em", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                : data?.data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:border-[#1e1e1e] dark:hover:bg-white/2"
                    >
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onItemClick(item)}
                          className="text-left text-sm font-medium transition-colors hover:underline"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {item.title}
                        </button>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{item.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>
                          {STATUS_LABEL[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => deleteItem.mutate(item.id)}
                          disabled={deleteItem.isPending && deleteItem.variables === item.id}
                          title="Remover"
                          className="flex items-center justify-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!isLoading && data?.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <IconEmpty />
            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              Nenhum item encontrado
            </p>
            <button
              onClick={onCreateClick}
              className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
            >
              <IconPlus />
              Criar primeiro item
            </button>
          </div>
        )}

        {/* Paginação */}
        {data && data.total > data.pageSize && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-[#1e1e1e]">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.total} item{data.total !== 1 ? "s" : ""} · página {page} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
