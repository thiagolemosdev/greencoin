import { httpResource, defineApiRoute } from "@core/http-resource";
import type { AuthUser } from "@core/auth-context";

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

const meRoute = defineApiRoute("GET", "/auth/me");
const signInRoute = defineApiRoute("POST", "/auth/sign-in");
const registerRoute = defineApiRoute("POST", "/auth/register");

export function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  return httpResource(meRoute, { signal });
}

export function signIn(body: SignInRequest): Promise<SignInResponse> {
  return httpResource(signInRoute, { body });
}

export function register(body: RegisterRequest): Promise<AuthUser> {
  return httpResource(registerRoute, { body });
}
