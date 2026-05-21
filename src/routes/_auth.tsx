import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@layouts/auth-layout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    // If a valid session already exists, redirect away from auth pages.
    void context;
    // Example: if (hasSession()) throw redirect({ to: "/dashboard" });
  },
  component: AuthGroupLayout,
});

function AuthGroupLayout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
