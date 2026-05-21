import { type ReactNode } from "react";
import { APP_NAME } from "@core/constants";

export type OnboardingLayoutProps = {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
};

export function OnboardingLayout({ children, step, totalSteps }: OnboardingLayoutProps) {
  const progress = step && totalSteps ? Math.round((step / totalSteps) * 100) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 items-center border-b px-6">
        <span className="text-sm font-semibold text-neutral-900">{APP_NAME}</span>
        {progress !== null && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-neutral-500">
              Step {step} of {totalSteps}
            </span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
