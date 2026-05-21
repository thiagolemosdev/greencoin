import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { itemByIdQueryOptions } from "@core/queries";
import { useUpdateItem, useDeleteItem } from "@features/items/hooks";

export const Route = createFileRoute("/_main/items/$itemId")({
  loader: ({ context: { queryClient }, params: { itemId } }) =>
    queryClient.prefetchQuery(itemByIdQueryOptions(itemId)),
  component: ItemDetailPage,
});

const STATUS_STYLE = {
  active:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
} as const;

const STATUS_LABEL = { active: "Ativo", inactive: "Inativo", archived: "Arquivado" } as const;

const IconArrowLeft = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconTrash = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="rounded-2xl border border-theme-border bg-white p-6 dark:border-theme-border-dark dark:bg-theme-dark-card space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function ItemDetailPage() {
  const { itemId } = Route.useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useQuery(itemByIdQueryOptions(itemId));
  const updateItem = useUpdateItem(itemId);
  const deleteItem = useDeleteItem();

  if (isLoading) return <SkeletonDetail />;
  if (!item) return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400">
      <p>Item não encontrado.</p>
      <Link to="/items" className="mt-3 text-sm underline" style={{ color: "var(--color-primary)" }}>
        Voltar para itens
      </Link>
    </div>
  );

  async function handleDelete() {
    if (!confirm("Deseja remover este item?")) return;
    await deleteItem.mutateAsync(item!.id);
    await navigate({ to: "/items" });
  }

  function handleStatusChange(status: typeof item.status) {
    updateItem.mutate({ status });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Navegação */}
      <Link
        to="/items"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <IconArrowLeft />
        Voltar para itens
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteItem.isPending}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800/40 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <IconTrash />
          Remover
        </button>
      </div>

      {/* Card principal */}
      <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="p-6 space-y-5">
          {/* Status */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["active", "inactive", "archived"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updateItem.isPending}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition-all ${
                    item.status === s
                      ? `${STATUS_STYLE[s]} border-current`
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-400"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Descrição
            </label>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-gray-400 dark:text-gray-500">Sem descrição.</p>
            )}
          </div>

          {/* Metadados */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-theme-dark-elevated">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">ID</div>
              <div className="mt-0.5 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{item.id}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Criado em</div>
              <div className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                {new Date(item.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
