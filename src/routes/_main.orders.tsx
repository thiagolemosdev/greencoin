import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCryptoMyOrders, useCancelCryptoOrder } from "@features/orders/hooks";
import type { Order } from "@core/types/crypto";

export const Route = createFileRoute("/_main/orders")({
  component: OrdersPage,
});

// ── Ícones ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconArrowUp = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IconArrowDown = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
const IconX = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconEmpty = () => (
  <svg className="h-16 w-16 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
type StatusKey = Order["status"];
type FilterTab = "all" | StatusKey;

const STATUS_LABEL: Record<StatusKey, string> = {
  open: "Aberta",
  matched: "Matched",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const STATUS_STYLE: Record<StatusKey, string> = {
  open: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  matched: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "open", label: "Abertas" },
  { key: "matched", label: "Matched" },
  { key: "completed", label: "Concluídas" },
  { key: "cancelled", label: "Canceladas" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(value));
}

// ── OrderRow ──────────────────────────────────────────────────────────────────
function OrderRow({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const isBuy = order.type === "buy";
  const canCancel = order.status === "open";

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:border-[#1e1e1e] dark:hover:bg-white/[0.02]">
      {/* Tipo */}
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isBuy
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          }`}
        >
          {isBuy ? <IconArrowDown /> : <IconArrowUp />}
          {isBuy ? "Compra" : "Venda"}
        </span>
      </td>

      {/* Crypto */}
      <td className="px-4 py-3.5">
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
          {order.crypto}
        </span>
      </td>

      {/* Quantidade */}
      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
        {order.amount} {order.crypto}
      </td>

      {/* Preço por unidade */}
      <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
        {formatCurrency(order.pricePerUnit, order.currency)}
      </td>

      {/* Total */}
      <td className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white">
        {formatCurrency(order.totalPrice, order.currency)}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </td>

      {/* Expira */}
      <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(order.expiresAt)}
      </td>

      {/* Ações */}
      <td className="px-4 py-3.5">
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            title="Cancelar ordem"
            className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/40 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <IconX />
            Cancelar
          </button>
        )}
      </td>
    </tr>
  );
}

// ── OrderRowSkeleton ──────────────────────────────────────────────────────────
function OrderRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-[#1e1e1e]">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const filters = activeTab === "all" ? undefined : { status: activeTab };
  const { data: orders, isLoading, isError } = useCryptoMyOrders(filters);
  const cancelOrder = useCancelCryptoOrder();

  function handleCancel(orderId: string) {
    if (confirm("Deseja cancelar esta ordem?")) {
      cancelOrder.mutate(orderId);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Ordens</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas ofertas de compra e venda
          </p>
        </div>
        <Link
          to="/orders/create"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
        >
          <IconPlus />
          Nova Ordem
        </Link>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 dark:border-[#1e1e1e]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative py-3.5 px-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-full rounded-full"
                  style={{ background: "var(--color-primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Erro */}
        {isError && (
          <div className="p-6 text-sm text-red-600 dark:text-red-400">
            Erro ao carregar ordens. Tente novamente.
          </div>
        )}

        {/* Tabela */}
        {!isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#1e1e1e]">
                  {["Tipo", "Crypto", "Quantidade", "Preço/Un.", "Total", "Status", "Expira em", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => <OrderRowSkeleton key={i} />)
                  : orders && orders.length > 0
                  ? orders.map((order) => (
                      <OrderRow key={order.id} order={order} onCancel={handleCancel} />
                    ))
                  : null}
              </tbody>
            </table>

            {/* Empty state dentro da tabela */}
            {!isLoading && orders?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <IconEmpty />
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nenhuma ordem encontrada
                </p>
                <Link
                  to="/orders/create"
                  className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
                >
                  <IconPlus />
                  Criar primeira ordem
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
