import { cx } from "@ui/variants";

export type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeMap = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
};

export function Spinner({ className, size = "md", label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(
        "inline-block animate-spin rounded-full border-neutral-300 border-t-neutral-700",
        sizeMap[size],
        className,
      )}
    />
  );
}

export type LoadingOverlayProps = {
  className?: string;
};

export function LoadingOverlay({ className }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cx("flex items-center justify-center p-12", className)}
    >
      <Spinner size="lg" />
    </div>
  );
}

export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cx("animate-pulse rounded-md bg-neutral-200", className)}
    />
  );
}
