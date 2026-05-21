import { createFileRoute } from "@tanstack/react-router";
import { profileQueryOptions } from "@core/queries";
import { useAuth } from "@core/auth-context";
import { PageHeader } from "@ui/header";
import { ProfileForm } from "@features/profile/profile-form";
import { useProfile } from "@features/profile/hooks";
import { Skeleton } from "@ui/loading";

export const Route = createFileRoute("/_main/profile")({
  beforeLoad: ({ context }) => {
    void context;
    // Would use session store user id here to prefetch profile
  },
  loader: ({ context: { queryClient } }) => {
    // Example: const userId = useSessionStore.getState().userId;
    // return queryClient.prefetchQuery(profileQueryOptions(userId));
    void queryClient;
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id ?? "");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="Update your personal information." />
      {isLoading ? (
        <div className="rounded-lg border bg-white p-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ) : profile ? (
        <ProfileForm profile={profile} />
      ) : null}
    </div>
  );
}
