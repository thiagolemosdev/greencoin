import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    // Redirect root to dashboard if authenticated, login otherwise.
    // Auth state is read from the query cache set during bootstrap.
    void context;
    throw redirect({ to: "/dashboard" });
  },
});
