import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@core/auth-context";
import { useProfile, useUploadAvatar } from "@features/profile/hooks";
import { ProfileForm } from "@features/profile/profile-form";

export const Route = createFileRoute("/_main/profile")({
  component: ProfilePage,
});

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconCamera = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconMail = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconCalendar = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconShield = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-theme-border bg-white p-6 dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-theme-border bg-white p-6 dark:border-theme-border-dark dark:bg-theme-dark-card space-y-4">
        <div className="h-9 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? "");
  const uploadAvatar = useUploadAvatar(user?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    e.target.value = "";
  }

  if (authLoading || profileLoading) return <ProfileSkeleton />;
  if (!profile) return null;

  const initials = getInitials(profile.name);
  const avatarUrl = profile.avatarUrl;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>

      {/* Avatar card */}
      <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-white dark:ring-[#1e1e1e]"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ring-4 ring-white dark:ring-[#1e1e1e]"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              >
                {initials}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              title="Alterar foto"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-white shadow transition hover:bg-gray-700 disabled:opacity-60 dark:border-[#1e1e1e]"
            >
              <IconCamera />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Identity */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
              <IconMail />
              {profile.email}
            </p>
            {profile.bio && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{profile.bio}</p>
            )}
          </div>

          {/* Member since */}
          <div className="shrink-0 rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-theme-dark-elevated">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <IconCalendar />
              Membro desde
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <ProfileForm profile={profile} />

      {/* Account details */}
      <div className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <IconShield />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Detalhes da conta</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
          <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">E-mail</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">ID do usuário</span>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{profile.userId}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Última atualização</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(profile.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
