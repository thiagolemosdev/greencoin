import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { MainLayout } from "@layouts/main-layout";
import { APP_VERSION } from "@core/constants";

export const Route = createFileRoute("/_main")({
  beforeLoad: ({ context }) => {
    // Guard: require authentication for all routes in this group.
    void context;
    // Example:
    // const token = useSessionStore.getState().accessToken;
    // if (!token) throw redirect({ to: "/login" });
  },
  component: MainGroupLayout,
});

function MainGroupLayout() {
  return (
    <MainLayout appVersion={APP_VERSION}>
      <Outlet />
    </MainLayout>
  );
}
