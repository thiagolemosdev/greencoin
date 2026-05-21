type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

let initialized = false;

export function initAnalytics(): void {
  // Plug in your analytics provider here (e.g. Segment, Amplitude, PostHog)
  initialized = true;
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!initialized) return;
  // Forward to provider
  if (typeof window !== "undefined" && "__analytics__" in window) {
    (window as Window & { __analytics__: { track: (n: string, p?: Record<string, unknown>) => void } }).__analytics__.track(event.name, event.properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!initialized) return;
  // Forward to provider
  if (typeof window !== "undefined" && "__analytics__" in window) {
    (window as Window & { __analytics__: { identify: (id: string, t?: Record<string, unknown>) => void } }).__analytics__.identify(userId, traits);
  }
}

export function trackPageView(path: string): void {
  trackEvent({ name: "page_view", properties: { path } });
}
