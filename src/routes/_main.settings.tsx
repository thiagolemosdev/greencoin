import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { settingsQueryOptions } from "@core/queries";
import { useSettings, useUpdateSettings } from "@features/settings/hooks";
import { useAppStore } from "@core/app-store";
import type { AppSettings } from "@core/api/settings";

export const Route = createFileRoute("/_main/settings")({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(settingsQueryOptions),
  component: SettingsPage,
});

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked
          ? "focus:ring-green-500"
          : "bg-gray-200 focus:ring-gray-300 dark:bg-gray-700"
      }`}
      style={checked ? { background: "var(--color-primary)" } : undefined}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── SettingRow ─────────────────────────────────────────────────────────────────
function SettingRow({
  label,
  description,
  children,
  last,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 ${
        !last ? "border-b border-gray-50 dark:border-[#1e1e1e]" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── SectionCard ────────────────────────────────────────────────────────────────
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4 dark:border-[#1e1e1e]">
        <span className="text-gray-500 dark:text-gray-400">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconBell = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconSun = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const IconMoon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconMonitor = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IconShield = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconGlobe = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-theme-border bg-white dark:border-theme-border-dark dark:bg-theme-dark-card">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-[#1e1e1e]">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {[1, 2].map((j) => (
            <div key={j} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-[#1e1e1e] last:border-0">
              <div className="space-y-1.5">
                <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-6 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const { darkMode, setDarkMode } = useAppStore();

  if (isLoading) return <SettingsSkeleton />;
  if (!settings) return null;

  function save(patch: Partial<AppSettings>) {
    update.mutate(patch);
  }

  function handleTheme(theme: AppSettings["theme"]) {
    if (theme === "dark") setDarkMode(true);
    else if (theme === "light") setDarkMode(false);
    else setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    save({ theme });
  }

  const themeOptions: { value: AppSettings["theme"]; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Claro", icon: <IconSun /> },
    { value: "dark", label: "Escuro", icon: <IconMoon /> },
    { value: "system", label: "Sistema", icon: <IconMonitor /> },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gerencie suas preferências e segurança da conta.
        </p>
      </div>

      {/* Aparência */}
      <SectionCard title="Aparência" icon={<IconSun />}>
        <div className="px-6 py-5">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Tema</div>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, label, icon }) => {
              const isActive = settings.theme === value;
              return (
                <button
                  key={value}
                  onClick={() => handleTheme(value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-sm font-medium transition-all ${
                    isActive
                      ? "border-current text-green-600 dark:text-green-400"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-[#333] dark:text-gray-400 dark:hover:border-[#444]"
                  }`}
                  style={isActive ? {
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    background: "rgba(var(--color-primary-rgb, 34 197 94) / 0.06)",
                  } : undefined}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Notificações */}
      <SectionCard title="Notificações" icon={<IconBell />}>
        <SettingRow
          label="E-mail"
          description="Receba atualizações e resumos por e-mail."
        >
          <Toggle
            checked={settings.notifications.email}
            disabled={update.isPending}
            onChange={(v) => save({ notifications: { ...settings.notifications, email: v } })}
          />
        </SettingRow>
        <SettingRow
          label="Push"
          description="Notificações push no navegador."
        >
          <Toggle
            checked={settings.notifications.push}
            disabled={update.isPending}
            onChange={(v) => save({ notifications: { ...settings.notifications, push: v } })}
          />
        </SettingRow>
        <SettingRow
          label="Atualizações de ordens"
          description="Seja notificado quando suas ordens mudarem de status."
        >
          <Toggle
            checked={settings.notifications.orderUpdates}
            disabled={update.isPending}
            onChange={(v) => save({ notifications: { ...settings.notifications, orderUpdates: v } })}
          />
        </SettingRow>
        <SettingRow
          label="Alertas de mercado"
          description="Alertas de variação de preço e oportunidades no marketplace."
          last
        >
          <Toggle
            checked={settings.notifications.marketAlerts}
            disabled={update.isPending}
            onChange={(v) => save({ notifications: { ...settings.notifications, marketAlerts: v } })}
          />
        </SettingRow>
      </SectionCard>

      {/* Idioma */}
      <SectionCard title="Idioma" icon={<IconGlobe />}>
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: "pt", label: "Português" },
              { value: "en", label: "English" },
            ] as const).map(({ value, label }) => {
              const isActive = settings.language === value;
              return (
                <button
                  key={value}
                  onClick={() => save({ language: value })}
                  className={`rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "border-current"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-[#333] dark:text-gray-400"
                  }`}
                  style={isActive ? {
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    background: "rgba(var(--color-primary-rgb, 34 197 94) / 0.06)",
                  } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Segurança */}
      <SectionCard title="Segurança" icon={<IconShield />}>
        <SettingRow
          label="Autenticação em dois fatores (2FA)"
          description="Adicione uma camada extra de segurança à sua conta."
        >
          <Toggle
            checked={settings.security.twoFactor}
            disabled={update.isPending}
            onChange={(v) => save({ security: { twoFactor: v } })}
          />
        </SettingRow>
        <SettingRow label="Senha" description="Última alteração: nunca." last>
          <button
            className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
            onClick={() => toast.info("Alteração de senha disponível em breve.")}
          >
            Alterar senha
          </button>
        </SettingRow>
      </SectionCard>

      {/* Zona de perigo */}
      <div className="rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-theme-dark-card">
        <div className="border-b border-red-100 px-6 py-4 dark:border-red-900/20">
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Zona de perigo</h2>
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">Excluir conta</div>
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Esta ação é permanente e não pode ser desfeita.
            </div>
          </div>
          <button
            className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800/40 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => {
              if (confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
                toast.error("Exclusão de conta disponível em breve.");
              }
            }}
          >
            Excluir conta
          </button>
        </div>
      </div>
    </div>
  );
}
