import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useCryptoMyTransactions,
  useConfirmCryptoTransaction,
  useDisputeCryptoTransaction,
} from "@features/transactions/hooks";
import type { Transaction } from "@core/types/crypto";

export const Route = createFileRoute("/_main/transactions")({
  component: TransactionsPage,
});

// ── Ícones ────────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconAlert = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </svg>
);
const IconX = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconCopy = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconEmpty = () => (
  <svg className="h-16 w-16 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
type StatusKey = Transaction["status"];
type FilterTab = "all" | StatusKey;

const STATUS_LABEL: Record<StatusKey, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  completed: "Concluída",
  failed: "Falhou",
  disputed: "Disputada",
};

const STATUS_STYLE: Record<StatusKey, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  disputed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "confirmed", label: "Confirmadas" },
  { key: "completed", label: "Concluídas" },
  { key: "disputed", label: "Disputadas" },
];

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(value));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

async function copyToClipboard(text: string) {
  try { await navigator.clipboard.writeText(text); } catch { /* silencioso */ }
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const [hash, setHash] = useState("");
  const confirm = useConfirmCryptoTransaction();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await confirm.mutateAsync({ transactionId: tx.id, transactionHash: hash || undefined });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-theme-border bg-white shadow-2xl dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Confirmar envio</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
            <IconX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Informe o hash da transação on-chain para confirmar o envio de{" "}
            <strong className="text-gray-900 dark:text-white">{tx.amount} {tx.crypto}</strong>.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hash da transação <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x…"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 font-mono text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500/30 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={confirm.isPending}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
            >
              <IconCheck />
              {confirm.isPending ? "Confirmando…" : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Dispute Dialog ────────────────────────────────────────────────────────────
function DisputeDialog({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const dispute = useDisputeCryptoTransaction();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    await dispute.mutateAsync({ transactionId: tx.id, reason });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-theme-border bg-white shadow-2xl dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Abrir disputa</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
            <IconX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Descreva o motivo da disputa para a transação de{" "}
            <strong className="text-gray-900 dark:text-white">{tx.amount} {tx.crypto}</strong>.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Motivo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Ex: Não recebi os fundos após 24h…"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-400/30 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-white resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || dispute.isPending}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <IconAlert />
              {dispute.isPending ? "Enviando…" : "Abrir disputa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Transaction Card ──────────────────────────────────────────────────────────
function TransactionCard({
  tx,
  userId,
  onConfirm,
  onDispute,
}: {
  tx: Transaction;
  userId: string;
  onConfirm: (tx: Transaction) => void;
  onDispute: (tx: Transaction) => void;
}) {
  const isBuyer = tx.buyerId === userId;
  const canConfirm = tx.status === "pending" && isBuyer;
  const canDispute = (tx.status === "pending" || tx.status === "confirmed") && isBuyer;

  return (
    <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-gray-400">#{tx.id.slice(-8)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[tx.status]}`}>
            {STATUS_LABEL[tx.status]}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {isBuyer ? "Comprador" : "Vendedor"}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formatDate(tx.createdAt)}</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Crypto */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Crypto</div>
            <div className="mt-0.5 font-mono text-base font-bold text-gray-900 dark:text-white">
              {tx.amount} {tx.crypto}
            </div>
          </div>
          {/* Preço */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Preço/un.</div>
            <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(tx.pricePerUnit, tx.currency)}
            </div>
          </div>
          {/* Total */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            <div className="mt-0.5 text-sm font-bold" style={{ color: "var(--color-primary)" }}>
              {formatCurrency(tx.totalPrice, tx.currency)}
            </div>
          </div>
          {/* Blockchain */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Blockchain</div>
            <div className="mt-0.5 text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
              {tx.blockchain}
            </div>
          </div>
        </div>

        {/* Endereços */}
        <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-3 dark:bg-theme-dark-elevated">
          {[
            { label: "Carteira compradora", addr: tx.buyerWalletAddress },
            { label: "Carteira vendedora", addr: tx.sellerWalletAddress },
          ].map(({ label, addr }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
                  {addr.slice(0, 8)}…{addr.slice(-6)}
                </span>
                <button onClick={() => copyToClipboard(addr)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <IconCopy />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hash on-chain */}
        {tx.transactionHash && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800/40 dark:bg-green-900/10">
            <span className="text-xs text-green-700 dark:text-green-400">Hash on-chain</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-green-700 dark:text-green-400">
                {truncateHash(tx.transactionHash)}
              </span>
              <button onClick={() => copyToClipboard(tx.transactionHash!)} className="text-green-500 hover:text-green-700">
                <IconCopy />
              </button>
            </div>
          </div>
        )}

        {/* Motivo de falha/disputa */}
        {tx.failedReason && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 dark:border-orange-800/40 dark:bg-orange-900/10">
            <IconAlert />
            <p className="text-xs text-orange-700 dark:text-orange-400">{tx.failedReason}</p>
          </div>
        )}

        {/* Ações */}
        {(canConfirm || canDispute) && (
          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-[#1e1e1e]">
            {canConfirm && (
              <button
                onClick={() => onConfirm(tx)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
              >
                <IconCheck />
                Confirmar envio
              </button>
            )}
            {canDispute && (
              <button
                onClick={() => onDispute(tx)}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/40 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <IconAlert />
                Abrir disputa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function TransactionSkeleton() {
  return (
    <div className="rounded-2xl border border-theme-border bg-white dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-[#1e1e1e]">
        <div className="flex gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
const MOCK_USER_ID = "user-1";

function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [confirmingTx, setConfirmingTx] = useState<Transaction | null>(null);
  const [disputingTx, setDisputingTx] = useState<Transaction | null>(null);

  const filters = activeTab === "all" ? undefined : { status: activeTab };
  const { data: transactions, isLoading, isError } = useCryptoMyTransactions(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Transações</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Acompanhe e gerencie suas transações OTC
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-[#1e1e1e]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative py-3 px-3 text-sm font-medium transition-colors ${
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          Erro ao carregar transações. Tente novamente.
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <TransactionSkeleton key={i} />)}
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              userId={MOCK_USER_ID}
              onConfirm={setConfirmingTx}
              onDispute={setDisputingTx}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-theme-border py-20 dark:border-[#333333]">
          <IconEmpty />
          <p className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Aceite uma oferta no marketplace para iniciar uma transação
          </p>
        </div>
      )}

      {/* Dialogs */}
      {confirmingTx && <ConfirmDialog tx={confirmingTx} onClose={() => setConfirmingTx(null)} />}
      {disputingTx && <DisputeDialog tx={disputingTx} onClose={() => setDisputingTx(null)} />}
    </div>
  );
}
