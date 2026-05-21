import { type HTMLAttributes, forwardRef } from "react";
import { cx } from "@ui/variants";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          "rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-md transition-all duration-300",
          "dark:border-[#222222] dark:bg-[#151515]",
          hover && "hover:shadow-xl hover:border-green-600 dark:hover:border-green-600",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

/* ─── Card Header ─── */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("mb-4 flex items-center justify-between", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

/* ─── Card Title ─── */
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cx("text-base font-semibold text-gray-900 dark:text-white", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/* ─── Card Content ─── */
export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("text-sm text-gray-600 dark:text-gray-400", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";
