import { createFileRoute, Link } from "@tanstack/react-router";
import { SignInForm } from "@features/auth/sign-in-form";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Sign in</h2>
        <p className="mt-1 text-sm text-neutral-500">Enter your credentials to continue.</p>
      </div>
      <SignInForm />
      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
