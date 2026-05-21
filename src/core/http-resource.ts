import { API_BASE_URL } from "@core/constants";
import { useAppStore } from "@core/app-store";
import { useSessionStore } from "@core/session-store";

export type FriendlyError = {
  type: "friendly_error";
  title: string;
  detail: string;
  status: number;
  extensions?: Record<string, unknown>;
};

export type HttpError = FriendlyError | NetworkError;

export type NetworkError = {
  type: "network_error";
  message: string;
};

export function isFriendlyError(e: unknown): e is FriendlyError {
  return typeof e === "object" && e !== null && (e as FriendlyError).type === "friendly_error";
}

export function isNetworkError(e: unknown): e is NetworkError {
  return typeof e === "object" && e !== null && (e as NetworkError).type === "network_error";
}

type ApiRoute<P extends Record<string, string> = Record<string, string>> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string | ((params: P) => string);
};

export function defineApiRoute<P extends Record<string, string> = Record<string, string>>(
  method: ApiRoute<P>["method"],
  path: ApiRoute<P>["path"],
): ApiRoute<P> {
  return { method, path };
}

export function defineApiRouteFn<P extends Record<string, string>>(
  method: ApiRoute<P>["method"],
  pathFn: (params: P) => string,
): ApiRoute<P> {
  return { method, path: pathFn };
}

function resolveUrl<P extends Record<string, string>>(route: ApiRoute<P>, params?: P): string {
  const rawPath = typeof route.path === "function" ? route.path(params ?? ({} as P)) : route.path;
  return `${API_BASE_URL}${rawPath}`;
}

async function refreshTokenIfNeeded(): Promise<void> {
  const { accessToken, refreshToken, setTokens, clearSession } = useSessionStore.getState();
  if (!accessToken || !refreshToken) return;

  // Simplified: in production, decode JWT and check exp claim
  const isExpired = false;
  if (!isExpired) return;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearSession();
      return;
    }
    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    setTokens(data.accessToken, data.refreshToken);
  } catch {
    clearSession();
  }
}

function buildHeaders(accessToken: string | null): HeadersInit {
  const locale = useAppStore.getState().locale;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": locale,
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
}

async function parseError(res: Response): Promise<HttpError> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/problem+json")) {
    const body = (await res.json()) as Partial<FriendlyError>;
    return {
      type: "friendly_error",
      title: body.title ?? "An error occurred",
      detail: body.detail ?? res.statusText,
      status: res.status,
      extensions: body.extensions,
    };
  }
  return {
    type: "friendly_error",
    title: "Request failed",
    detail: res.statusText,
    status: res.status,
  };
}

export async function httpResource<TResponse, P extends Record<string, string> = Record<string, string>>(
  route: ApiRoute<P>,
  options?: {
    params?: P;
    body?: unknown;
    signal?: AbortSignal;
    searchParams?: Record<string, string | number | boolean | undefined>;
  },
): Promise<TResponse> {
  await refreshTokenIfNeeded();

  const { accessToken } = useSessionStore.getState();
  const url = new URL(resolveUrl(route, options?.params), window.location.origin);

  if (options?.searchParams) {
    for (const [k, v] of Object.entries(options.searchParams)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      method: route.method,
      headers: buildHeaders(accessToken),
      body: options?.body != null ? JSON.stringify(options.body) : undefined,
      signal: options?.signal,
    });

    if (!res.ok) {
      throw await parseError(res);
    }

    if (res.status === 204) {
      return undefined as TResponse;
    }

    return (await res.json()) as TResponse;
  } catch (error) {
    if (isFriendlyError(error)) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const networkError: NetworkError = {
      type: "network_error",
      message: error instanceof Error ? error.message : "Network request failed",
    };
    throw networkError;
  }
}

export async function httpUpload<TResponse, P extends Record<string, string> = Record<string, string>>(
  route: ApiRoute<P>,
  options: {
    params?: P;
    formData: FormData;
    signal?: AbortSignal;
  },
): Promise<TResponse> {
  await refreshTokenIfNeeded();

  const { accessToken } = useSessionStore.getState();
  const url = resolveUrl(route, options.params);

  const locale = useAppStore.getState().locale;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": locale,
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(url, {
      method: route.method,
      headers,
      body: options.formData,
      signal: options.signal,
    });

    if (!res.ok) {
      throw await parseError(res);
    }

    return (await res.json()) as TResponse;
  } catch (error) {
    if (isFriendlyError(error)) throw error;
    const networkError: NetworkError = {
      type: "network_error",
      message: error instanceof Error ? error.message : "Upload failed",
    };
    throw networkError;
  }
}
