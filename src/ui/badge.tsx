import { type HTMLAttributes } from "react";
import { cva, cx, type VariantProps } from "@ui/variants";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:     "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        primary:     "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300",
        success:     "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300",
        warning:     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300",
        info:        "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300",
        purple:      "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
        outline:     "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cx(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
