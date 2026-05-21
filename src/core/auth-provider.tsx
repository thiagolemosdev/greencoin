import { useState, useCallback, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "@core/auth-context";
import { useSessionStore } from "@core/session-store";
import { httpResource, defineApiRoute } from "@core/http-resource";

const signInRoute = defineApiRoute("POST", "/auth/sign-in");
const signOutRoute = defineApiRoute("POST", "/auth/sign-out");
const meRoute = defineApiRoute("GET", "/auth/me");

type SignInResponse = { accessToken: string; refreshToken: string; user: AuthUser };

export type AuthProviderProps = {
  children: ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const { accessToken, setTokens, clearSession } = useSessionStore();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(() => Boolean(accessToken));

  const signIn = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const res = await httpResource<SignInResponse>(signInRoute, { body: credentials });
        setTokens(res.accessToken, res.refreshToken);
        setUser(res.user);
      } finally {
        setIsLoading(false);
      }
    },
    [setTokens],
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await httpResource(signOutRoute);
    } finally {
      clearSession();
      setUser(null);
      setIsLoading(false);
    }
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    const data = await httpResource<AuthUser>(meRoute);
    setUser(data);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    void refreshUser().finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, signIn, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
