import { Link, createFileRoute } from "@tanstack/react-router";
import { dashboardSummaryQueryOptions } from "@core/queries";
import { useDashboardSummary } from "@features/dashboard/hooks";
import { useAuth } from "@core/auth-context";
import type { DashboardSummary, RecentOrder, RecentTransaction } from "@core/api/dashboard";

export const Route = createFileRoute("/_main/dashboard")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(dashboardSummaryQueryOptions),
  component: DashboardPage,
});

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconWallet = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12h2v4h-2a2 2 0 0 1 0-4z" />
  </svg>
);
const IconOrders = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
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
const IconCheck = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconClock = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const IconVolume = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconTx = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="m7 16 4-4-4-4M17 8l-4 4 4 4" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function fmtDate() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function fmtCurrency(v: string, currency = "USD") {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(parseFloat(v));
}

function fmtBtc(v: string) {
  return `${parseFloat(v).toFixed(4)} BTC`;
}

function fmtUsdt(v: string) {
  return `${parseFloat(v).toFixed(2)} USDT`;
}

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data }: { data: { day: string; price: number }[] }) {
  if (data.length < 2) return null;
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 280;
  const H = 64;
  const pad = 4;

  const points = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * (W - 2 * pad);
    const y = H - pad - ((p - min) / range) * (H - 2 * pad);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const first = points[0]!.split(",");
  const last = points[prices.length - 1]!.split(",");
  const fillPath = `M${first[0]},${H} L${polyline} L${last[0]},${H} Z`;
  const isUp = prices[prices.length - 1]! >= prices[0]!;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div className="mt-3">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill="url(#spark-fill)" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon, accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-theme-border bg-white p-5 shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ background: accent ?? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-theme-border bg-white p-5 shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-3 h-7 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

// ── Order Status badge ─────────────────────────────────────────────────────────
const ORDER_STATUS: Record<RecentOrder["status"], { label: string; cls: string }> = {
  open:      { label: "Aberta",    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  matched:   { label: "Matched",   cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  completed: { label: "Concluída", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelada", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

const TX_STATUS: Record<RecentTransaction["status"], { label: string; cls: string }> = {
  pending:   { label: "Pendente",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  confirmed: { label: "Confirmada", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Concluída",  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  disputed:  { label: "Disputada",  cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
function DashboardContent({ data }: { data: DashboardSummary }) {
  const isUp = data.btcChange24h >= 0;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Saldo BTC"
          value={fmtBtc(data.balanceBtc)}
          sub={`≈ ${fmtCurrency(String(parseFloat(data.balanceBtc) * data.btcPrice))}`}
          icon={<IconWallet />}
        />
        <StatCard
          label="Saldo USDT"
          value={fmtUsdt(data.balanceUsdt)}
          sub="Tether USD"
          icon={<IconWallet />}
          accent="linear-gradient(135deg, #3b82f6, #6366f1)"
        />
        <StatCard
          label="Ordens abertas"
          value={String(data.openOrders)}
          sub={`${data.completedTransactions} concluídas`}
          icon={<IconOrders />}
          accent="linear-gradient(135deg, #f59e0b, #f97316)"
        />
        <StatCard
          label="Volume 30d"
          value={fmtCurrency(data.volume30d)}
          sub={`${data.pendingTransactions} tx pendente${data.pendingTransactions !== 1 ? "s" : ""}`}
          icon={<IconVolume />}
          accent="linear-gradient(135deg, #8b5cf6, #ec4899)"
        />
      </div>

      {/* BTC price + Wallets */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* BTC chart */}
        <div className="lg:col-span-3 rounded-2xl border border-theme-border bg-white p-5 shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Bitcoin · BTC/USD
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.btcPrice)}
              </p>
            </div>
            <span
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                isUp
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {isUp ? <IconArrowUp /> : <IconArrowDown />}
              {Math.abs(data.btcChange24h).toFixed(2)}% 24h
            </span>
          </div>
          <Sparkline data={data.priceHistory} />
        </div>

        {/* Wallets */}
        <div className="lg:col-span-2 rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Carteiras</p>
            <Link
              to="/wallet"
              className="text-xs font-medium transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  ₿
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Bitcoin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">BTC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{fmtBtc(data.balanceBtc)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ≈ {fmtCurrency(String(parseFloat(data.balanceBtc) * data.btcPrice))}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  ₮
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Tether</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">USDT</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{fmtUsdt(data.balanceUsdt)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">≈ {fmtCurrency(data.balanceUsdt)}</p>
              </div>
            </div>
          </div>
          <div className="px-5 pb-4">
            <Link
              to="/wallet"
              className="mt-1 flex w-full items-center justify-center rounded-xl py-2 text-xs font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
            >
              Depositar / Sacar
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders + Transactions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <IconOrders />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Ordens recentes</p>
            </div>
            <Link to="/orders" className="text-xs font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
            {data.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma ordem.</p>
            ) : (
              data.recentOrders.map((o) => {
                const isBuy = o.type === "buy";
                const s = ORDER_STATUS[o.status];
                return (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isBuy
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                        }`}
                      >
                        {isBuy ? <IconArrowDown /> : <IconArrowUp />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {isBuy ? "Compra" : "Venda"} {o.crypto}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{o.amount} {o.crypto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {fmtCurrency(o.totalPrice, o.currency)}
                      </p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <IconTx />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Transações recentes</p>
            </div>
            <Link to="/transactions" className="text-xs font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
            {data.recentTransactions.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma transação.</p>
            ) : (
              data.recentTransactions.map((t) => {
                const s = TX_STATUS[t.status];
                const isSeller = t.role === "seller";
                return (
                  <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : t.status === "disputed"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                      }`}>
                        {t.status === "completed" ? <IconCheck /> : <IconClock />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {t.crypto} · {isSeller ? "Venda" : "Compra"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.amount} {t.crypto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isSeller ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {isSeller ? "+" : "-"}{fmtCurrency(t.totalPrice, t.currency)}
                      </p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 h-48 animate-pulse rounded-2xl border border-theme-border bg-gray-100 dark:border-theme-border-dark dark:bg-gray-800" />
        <div className="lg:col-span-2 h-48 animate-pulse rounded-2xl border border-theme-border bg-gray-100 dark:border-theme-border-dark dark:bg-gray-800" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl border border-theme-border bg-gray-100 dark:border-theme-border-dark dark:bg-gray-800" />
        <div className="h-56 animate-pulse rounded-2xl border border-theme-border bg-gray-100 dark:border-theme-border-dark dark:bg-gray-800" />
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardSummary();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()}, {user?.name?.split(" ")[0] ?? "usuário"}! 👋
          </h1>
          <p className="mt-0.5 text-sm capitalize text-gray-500 dark:text-gray-400">{fmtDate()}</p>
        </div>
        <Link
          to="/orders/create"
          className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
        >
          Nova ordem
        </Link>
      </div>

      {isLoading ? <DashboardSkeleton /> : data ? <DashboardContent data={data} /> : null}
    </div>
  );
}
