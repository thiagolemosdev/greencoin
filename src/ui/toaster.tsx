import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "rounded-lg border shadow-lg",
          success: "border-green-200 bg-green-50 text-green-900",
          error: "border-red-200 bg-red-50 text-red-900",
          warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
          info: "border-blue-200 bg-blue-50 text-blue-900",
        },
      }}
    />
  );
}

export { toast } from "sonner";
