import { createFileRoute, Link } from "@tanstack/react-router";
import { useCryptoWallets } from "@features/wallet/hooks";
import type { Wallet } from "@core/types/crypto";

export const Route = createFileRoute("/_main/wallet")({
  component: WalletPage,
});

// ── Ícones ──────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconBitcoin = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.06 11.57c.43-.93.35-2.18-.64-2.86.65-.57.95-1.4.78-2.26C16.84 4.5 15.22 4 13.7 3.93V2h-1.4v1.9H11V2H9.6v1.9H7.3V5.3h.93c.5 0 .63.25.63.48v8.16c0 .37-.2.56-.6.56H7.3v1.6h2.3V18h1.4v-1.9h1.3V18h1.4v-1.92c1.83-.1 3.65-.65 3.94-2.62.19-1.29-.27-2.35-1.28-2.89ZM10.5 6.1h2.2c.84 0 1.58.26 1.58 1.25s-.74 1.27-1.58 1.27H10.5V6.1Zm2.5 7.83H10.5v-2.8h2.5c1.05 0 1.7.42 1.7 1.4s-.65 1.4-1.7 1.4Z" />
  </svg>
);
const IconTether = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.1 10.53V9h3.9V6.5H7V9h3.9v1.53C7.6 10.76 5 11.48 5 12.35c0 .86 2.6 1.59 5.9 1.82V18h2.2v-3.83c3.3-.23 5.9-.96 5.9-1.82 0-.87-2.6-1.59-5.9-1.82Zm-1.1 2.64c-3.47 0-6.28-.59-6.28-1.32S8.53 10.53 12 10.53s6.28.59 6.28 1.32-2.81 1.32-6.28 1.32Z" />
  </svg>
);
const IconVerified = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m9 12 2 2 4-4" />
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z" />
  </svg>
);
const IconCopy = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconWalletEmpty = () => (
  <svg className="h-16 w-16 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback silencioso
  }
}

// ── WalletCard ───────────────────────────────────────────────────────────────
function WalletCard({ wallet }: { wallet: Wallet }) {
  const isBTC = wallet.crypto === "BTC";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-theme-border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-green-500/40 dark:border-theme-border-dark dark:bg-theme-dark-card dark:hover:border-green-600/40">
      {/* Faixa superior com gradiente */}
      <div
        className="h-1.5 w-full"
        style={{ background: isBTC ? "linear-gradient(to right, #f59e0b, #d97706)" : "linear-gradient(to right, #3b82f6, #1d4ed8)" }}
      />

      <div className="p-5">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Ícone da crypto */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: isBTC
                  ? "linear-gradient(135deg, #f59e0b22, #d97706/10)"
                  : "linear-gradient(135deg, #3b82f622, #1d4ed8/10)",
                color: isBTC ? "#f59e0b" : "#3b82f6",
                border: `1px solid ${isBTC ? "#f59e0b33" : "#3b82f633"}`,
              }}
            >
              {isBTC ? <IconBitcoin /> : <IconTether />}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {isBTC ? "Bitcoin" : "Tether USD"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {wallet.blockchain}
              </div>
            </div>
          </div>

          {/* Badge verificado */}
          {wallet.isVerified ? (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <IconVerified />
              Verificado
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Pendente
            </span>
          )}
        </div>

        {/* Saldo */}
        <div className="mt-5">
          <div className="text-xs text-gray-500 dark:text-gray-400">Saldo</div>
          <div className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {wallet.balanceFormatted}
          </div>
        </div>

        {/* Endereço */}
        <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate">
              {truncateAddress(wallet.address)}
            </span>
            <button
              onClick={() => copyToClipboard(wallet.address)}
              title="Copiar endereço"
              className="flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <IconCopy />
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Criada em {new Date(wallet.createdAt).toLocaleDateString("pt-BR")}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function WalletCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-theme-border bg-white dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="h-9 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
function WalletPage() {
  const { data: wallets, isLoading, isError } = useCryptoWallets();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Carteiras</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie seus endereços de criptomoedas
          </p>
        </div>
        <Link
          to="/wallet/create"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
        >
          <IconPlus />
          Nova Carteira
        </Link>
      </div>

      {/* Erro */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          Erro ao carregar carteiras. Tente novamente.
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <WalletCardSkeleton />
          <WalletCardSkeleton />
        </div>
      ) : wallets && wallets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-theme-border py-20 dark:border-[#333333]">
          <IconWalletEmpty />
          <p className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">
            Nenhuma carteira cadastrada
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Crie sua primeira carteira para começar a operar
          </p>
          <Link
            to="/wallet/create"
            className="mt-6 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
          >
            <IconPlus />
            Criar Carteira
          </Link>
        </div>
      )}
    </div>
  );
}
