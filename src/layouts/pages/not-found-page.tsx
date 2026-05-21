import { Link } from "@tanstack/react-router";
import { Button } from "@ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-bold text-neutral-300">404</p>
      <h1 className="text-xl font-semibold text-neutral-900">Page not found</h1>
      <p className="text-sm text-neutral-500">The page you are looking for does not exist.</p>
      <Button asChild variant="primary" size="md">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
