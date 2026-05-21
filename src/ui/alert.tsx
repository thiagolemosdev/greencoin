import { type HTMLAttributes, type ReactNode } from "react";
import { cva, cx, type VariantProps } from "@ui/variants";

const alertVariants = cva("relative rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7", {
  variants: {
    variant: {
      default: "bg-theme-card text-theme-text border-theme",
      destructive: "bg-theme-error-10 text-theme-error border-theme-error",
      warning: "bg-theme-warning-10 text-theme-warning border-theme-warning",
      success: "bg-theme-success-10 text-theme-success border-theme-success",
      info: "bg-theme-info-10 text-theme-info border-theme-info",
    },
  },
  defaultVariants: { variant: "default" },
});

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    icon?: ReactNode;
  };

export function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  return (
    <div data-slot="alert" role="alert" className={cx(alertVariants({ variant }), className)} {...props}>
      {icon}
      {children}
    </div>
  );
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 data-slot="alert-title" className={cx("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="alert-description" className={cx("text-sm", className)} {...props} />;
}
