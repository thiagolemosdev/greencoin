import { type ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAppStore } from "@core/app-store";
import { useAuth } from "@core/auth-context";
import { GreenCoinLogo } from "@ui/logo";
import { cx } from "@ui/variants";

/* ──────────────────────────────────────────
   ÍCONES SVG INLINE (sem dependência extra)
   ────────────────────────────────────────── */
const IconDashboard = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconWallet = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
  </svg>
);
const IconOrders = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
  </svg>
);
const IconMarketplace = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M3 9l1-5h16l1 5" /><path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Z" />
    <path d="M9 9v2a3 3 0 0 0 6 0V9" />
  </svg>
);
const IconTransactions = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
);
const IconItems = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconProfile = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconSettings = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
const IconMenu = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconClose = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconSun = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const IconMoon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconLogout = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const IconUser = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

/* ──────────────────────────────────────────
   NAV ITEMS
   ────────────────────────────────────────── */
type NavItem = {
  name: string;
  to: string;
  Icon: () => JSX.Element;
};

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard",    to: "/dashboard",    Icon: IconDashboard    },
  { name: "Carteiras",    to: "/wallet",       Icon: IconWallet       },
  { name: "Ordens",       to: "/orders",       Icon: IconOrders       },
  { name: "Marketplace",  to: "/marketplace",  Icon: IconMarketplace  },
  { name: "Transações",   to: "/transactions", Icon: IconTransactions },
  { name: "Items",        to: "/items",        Icon: IconItems        },
  { name: "Perfil",       to: "/profile",      Icon: IconProfile      },
  { name: "Configurações",to: "/settings",     Icon: IconSettings     },
];

/* ──────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────── */
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cx(
          "sidebar-glow fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "bg-white dark:bg-[#151515]",
          "border-r border-[#e5e7eb] dark:border-[#222222]",
          "transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-4 dark:border-[#222222]">
          <GreenCoinLogo size="sm" />
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <IconClose />
          </button>
        </div>

        {/* Nav — usa activeProps do TanStack Router para estado ativo */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {NAV_ITEMS.map(({ name, to, Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                activeOptions={{ exact: to === "/dashboard" }}
                className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-green-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-green-500 dark:hover:bg-gray-800/60 [&.active]:border-transparent [&.active]:text-white [&.active]:shadow-md"
                activeProps={{
                  style: { background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" },
                }}
                inactiveProps={{
                  style: { background: undefined },
                }}
              >
                <span className="text-gray-500 dark:text-gray-400 [&.active]:text-white">
                  <Icon />
                </span>
                {name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer — usuário logado (estilo FlashPay) */}
        <div className="border-t border-[#e5e7eb] p-4 dark:border-[#222222]">
          <div
            className="rounded-lg border p-3"
            style={{
              background: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.08), rgba(var(--color-accent-rgb), 0.06))`,
              borderColor: `rgba(var(--color-primary-rgb), 0.25)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Conta</div>
                <div
                  className="truncate text-sm font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {user?.email ?? "—"}
                </div>
              </div>
              <div
                className="ml-2 h-2 w-2 flex-shrink-0 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
            </div>
          </div>

          <button
            onClick={() => void signOut()}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <IconLogout />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

/* ──────────────────────────────────────────
   HEADER
   ────────────────────────────────────────── */
function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { darkMode, toggleDarkMode } = useAppStore();
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
        >
          <IconMenu />
        </button>
        <GreenCoinLogo size="sm" />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Alternar tema"
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>

        {/* Usuário + logout (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <div className="flex items-center gap-2">
              <IconUser />
              <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────
   LAYOUT PRINCIPAL
   ────────────────────────────────────────── */
export type MainLayoutProps = {
  children: ReactNode;
  appVersion?: string;
};

export function MainLayout({ children, appVersion }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-950 md:p-6">
          {children}
        </main>

        {appVersion && (
          <div className="hidden px-6 py-2 text-right text-xs text-gray-400 dark:text-gray-600 md:block">
            v{appVersion}
          </div>
        )}
      </div>
    </div>
  );
}
