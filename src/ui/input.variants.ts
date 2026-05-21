import { cva } from "@ui/variants";

export const inputVariants = cva(
  "w-full rounded-md border bg-white px-3 transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-9 text-sm",
        lg: "h-10 text-base",
      },
      state: {
        default: "border-theme border-theme-primary focus-visible:ring-theme-primary",
        error: "border-theme-error focus-visible:ring-theme-error",
        success: "border-theme-success focus-visible:ring-theme-success",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
);
