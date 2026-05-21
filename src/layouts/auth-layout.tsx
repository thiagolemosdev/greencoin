import { type ReactNode } from "react";
import { APP_NAME } from "@core/constants";

export type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{APP_NAME}</h1>
        </div>
        <div className="rounded-xl border bg-white p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
