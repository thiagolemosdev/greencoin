export const APP_NAME = "GreenCoin";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "pt-BR"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const TOKEN_STORAGE_KEY = "access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export const QUERY_STALE_TIME = 1000 * 60 * 5; // 5 min
export const QUERY_GC_TIME = 1000 * 60 * 10; // 10 min
