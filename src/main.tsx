import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/query-client";
import { routeTree } from "@/routeTree.gen";
import { loadLocale } from "@core/i18n";
import { useAppStore } from "@core/app-store";
import { trackPageView } from "@core/analytics/index";
import "./index.css";

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Track route changes for analytics (outside React tree)
router.subscribe("onLoad", ({ toLocation }) => {
  trackPageView(toLocation.pathname);
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function bootstrap() {
  // Step 1: Start MSW in dev/mock mode before first render
  if (import.meta.env.DEV && import.meta.env.VITE_MSW === "true") {
    const { worker } = await import("@mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  // Step 2: Load locale before rendering (reads persisted preference)
  const { locale } = useAppStore.getState();
  await loadLocale(locale);

  // Step 3: Render
  const container = document.getElementById("root");
  if (!container) throw new Error("Root element #root not found");

  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
