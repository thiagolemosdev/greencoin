import { httpResource, defineApiRoute } from "@core/http-resource";

export type AppSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    orderUpdates: boolean;
    marketAlerts: boolean;
  };
  theme: "light" | "dark" | "system";
  language: "pt" | "en";
  security: {
    twoFactor: boolean;
  };
};

export type UpdateSettingsRequest = Partial<AppSettings>;

const settingsRoute = defineApiRoute("GET", "/settings");
const updateRoute = defineApiRoute("PATCH", "/settings");

export function fetchSettings(signal?: AbortSignal): Promise<AppSettings> {
  return httpResource(settingsRoute, { signal });
}

export function updateSettings(body: UpdateSettingsRequest): Promise<AppSettings> {
  return httpResource(updateRoute, { body });
}
