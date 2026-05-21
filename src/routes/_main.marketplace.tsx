import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useCryptoMarketplaceOffers,
  useAcceptCryptoOffer,
} from "@features/marketplace/hooks";
import { useCryptoWallets } from "@features/wallet/hooks";
import type { MarketplaceOffer } from "@core/types/crypto";
import type { MarketplaceFiltersOutput } from "@core/schemas/crypto";

export const Route = createFileRoute("/_main/marketplace")({
  component: MarketplacePage,
});

// ── Ícones ────────────────────────────────────────────────────────────────────
const IconFilter = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />
  </svg>
);
const IconStar = () => (
  <svg className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
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
    <path d="M3 9l1-5h16l1 5" />
    <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Z" />
    <path d="M9 9v2a3 3 0 0 0 6 0V9" />
  </svg>
);
const IconWallet = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(value));
}

function timeLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Expirada";
  const h = Math.floor(ms / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d restantes`;
  return `${h}h restantes`;
}

// ── Accept Dialog ─────────────────────────────────────────────────────────────
function AcceptDialog({
  offer,
  onClose,
}: {
  offer: MarketplaceOffer;
  onClose: () => void;
}) {
  const { data: wallets = [], isLoading } = useCryptoWallets();
  const acceptOffer = useAcceptCryptoOffer();
  const [selectedWallet, setSelectedWallet] = useState("");

  const compatibleWallets = wallets.filter(
    (w) => w.crypto === offer.order.crypto,
  );

  async function handleConfirm() {
    if (!selectedWallet) return;
    await acceptOffer.mutateAsync({ orderId: offer.order.id, walletId: selectedWallet });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-theme-border bg-white shadow-2xl dark:border-theme-border-dark dark:bg-theme-dark-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Aceitar oferta
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5"
          >
            <IconX />
          </button>
        </div>

        {/* Resumo */}
        <div className="px-5 py-4 space-y-4">
          <div
            className="rounded-xl p-4 space-y-2 text-sm"
            style={{
              background: "linear-gradient(to right, rgba(var(--color-primary-rgb), 0.06), rgba(var(--color-accent-rgb), 0.04))",
              border: "1px solid rgba(var(--color-primary-rgb), 0.2)",
            }}
          >
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tipo</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {offer.order.type === "buy" ? "Compra" : "Venda"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Quantidade</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {offer.order.amount} {offer.order.crypto}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Preço</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(offer.order.pricePerUnit, offer.order.currency)}/{offer.order.crypto}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Total</span>
              <span className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
                {formatCurrency(offer.order.totalPrice, offer.order.currency)}
              </span>
            </div>
          </div>

          {/* Selecionar carteira */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <IconWallet />
              Carteira de destino ({offer.order.crypto})
            </label>

            {isLoading ? (
              <div className="h-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ) : compatibleWallets.length === 0 ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
                Você não tem carteiras {offer.order.crypto}. Crie uma em{" "}
                <a href="/wallet/create" className="underline">Carteiras</a>.
              </p>
            ) : (
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500/30 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-white"
              >
                <option value="">Selecione uma carteira…</option>
                {compatibleWallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.crypto} — {w.address.slice(0, 10)}…{w.address.slice(-6)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedWallet || acceptOffer.isPending || compatibleWallets.length === 0}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
          >
            {acceptOffer.isPending ? "Processando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Offer Card ────────────────────────────────────────────────────────────────
function OfferCard({
  offer,
  onAccept,
}: {
  offer: MarketplaceOffer;
  onAccept: (offer: MarketplaceOffer) => void;
}) {
  const isBuy = offer.order.type === "buy";

  return (
    <div className="group flex flex-col rounded-2xl border border-theme-border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-green-500/40 dark:border-theme-border-dark dark:bg-theme-dark-card dark:hover:border-green-600/40">
      {/* Faixa */}
      <div
        className="h-1 w-full rounded-t-2xl"
        style={{
          background: isBuy
            ? "linear-gradient(to right, #10b981, #059669)"
            : "linear-gradient(to right, #f59e0b, #d97706)",
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Cabeçalho: tipo + crypto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isBuy
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}
            >
              {isBuy ? <IconArrowDown /> : <IconArrowUp />}
              {isBuy ? "Compra" : "Venda"}
            </span>
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
              {offer.order.crypto}
            </span>
          </div>
          <span className="text-xs text-gray-400">{timeLeft(offer.order.expiresAt)}</span>
        </div>

        {/* Valores */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Quantidade</div>
            <div className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
              {offer.order.amount}
              <span className="ml-1 text-sm font-normal text-gray-500">{offer.order.crypto}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Preço/un.</div>
            <div className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(offer.order.pricePerUnit, offer.order.currency)}
            </div>
          </div>
        </div>

        {/* Total */}
        <div
          className="mt-3 rounded-lg px-3 py-2"
          style={{
            background: "rgba(var(--color-primary-rgb), 0.06)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.15)",
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total</span>
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>
              {formatCurrency(offer.order.totalPrice, offer.order.currency)}
            </span>
          </div>
        </div>

        {/* Vendedor */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              {offer.seller.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {offer.seller.name}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <IconStar />
                {offer.seller.rating.toFixed(1)} · {offer.seller.completedTrades} trades
              </div>
            </div>
          </div>

          <button
            onClick={() => onAccept(offer)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function OfferCardSkeleton() {
  return (
    <div className="rounded-2xl border border-theme-border bg-white dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="h-1 w-full rounded-t-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
type Filters = {
  crypto?: "BTC" | "USDT";
  type?: "buy" | "sell";
  currency?: "USD" | "BRL";
  sortBy?: "newest" | "price_asc" | "price_desc";
};

function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
        <IconFilter /> Filtros
      </span>

      {/* Crypto */}
      {(["BTC", "USDT"] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange({ ...filters, crypto: filters.crypto === c ? undefined : c })}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            filters.crypto === c
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-green-400 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-300"
          }`}
        >
          {c}
        </button>
      ))}

      <div className="h-4 w-px bg-gray-200 dark:bg-[#333]" />

      {/* Tipo */}
      {([["buy", "Compra"], ["sell", "Venda"]] as const).map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange({ ...filters, type: filters.type === val ? undefined : val })}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            filters.type === val
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-green-400 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-300"
          }`}
        >
          {label}
        </button>
      ))}

      <div className="h-4 w-px bg-gray-200 dark:bg-[#333]" />

      {/* Moeda */}
      {(["USD", "BRL"] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange({ ...filters, currency: filters.currency === c ? undefined : c })}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            filters.currency === c
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-green-400 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-300"
          }`}
        >
          {c}
        </button>
      ))}

      <div className="h-4 w-px bg-gray-200 dark:bg-[#333]" />

      {/* Ordenação */}
      <select
        value={filters.sortBy ?? "newest"}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })}
        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 outline-none dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-300"
      >
        <option value="newest">Mais recentes</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
      </select>

      {hasActive && (
        <button
          onClick={() => onChange({})}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <IconX />
          Limpar
        </button>
      )}
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
function MarketplacePage() {
  const [filters, setFilters] = useState<Filters>({});
  const [acceptingOffer, setAcceptingOffer] = useState<MarketplaceOffer | null>(null);

  const queryFilters: MarketplaceFiltersOutput = {
    ...(filters.crypto && { crypto: filters.crypto }),
    ...(filters.type && { type: filters.type }),
    ...(filters.currency && { currency: filters.currency }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
  };

  const { data: offers, isLoading, isError } = useCryptoMarketplaceOffers(queryFilters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace OTC</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Encontre e aceite ofertas de outros usuários
        </p>
      </div>

      {/* Filtros */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Erro */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          Erro ao carregar ofertas. Tente novamente.
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <OfferCardSkeleton key={i} />)}
        </div>
      ) : offers && offers.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {offers.length} oferta{offers.length !== 1 ? "s" : ""} disponível{offers.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onAccept={setAcceptingOffer} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-theme-border py-20 dark:border-[#333333]">
          <IconEmpty />
          <p className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">
            Nenhuma oferta encontrada
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Tente ajustar os filtros ou volte mais tarde
          </p>
          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => setFilters({})}
              className="mt-4 text-sm font-medium underline"
              style={{ color: "var(--color-primary)" }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Dialog aceitar oferta */}
      {acceptingOffer && (
        <AcceptDialog offer={acceptingOffer} onClose={() => setAcceptingOffer(null)} />
      )}
    </div>
  );
}
