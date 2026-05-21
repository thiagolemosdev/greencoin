import { cva } from "@ui/variants";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-theme-primary text-theme-on-primary hover:bg-theme-primary-hover focus-visible:outline-theme-primary",
        secondary: "bg-theme-secondary text-white hover:bg-theme-primary focus-visible:outline-theme-secondary",
        destructive: "bg-theme-error text-white hover:bg-red-700 focus-visible:outline-theme-error",
        ghost: "text-theme-primary hover:bg-theme-primary-10 focus-visible:outline-theme-primary",
        outline: "border border-theme-primary text-theme-primary bg-transparent hover:bg-theme-primary hover:text-theme-on-primary focus-visible:outline-theme-primary",
        link: "text-theme-primary underline-offset-4 hover:underline focus-visible:outline-theme-primary",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
        xl: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
