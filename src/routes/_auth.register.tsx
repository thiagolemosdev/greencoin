import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterForm } from "@features/auth/register-form";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Create account</h2>
        <p className="mt-1 text-sm text-neutral-500">Start by creating your account.</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
