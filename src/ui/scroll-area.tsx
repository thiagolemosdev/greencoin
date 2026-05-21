import { type HTMLAttributes } from "react";
import { cx } from "@ui/variants";

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal" | "both";
};

export function ScrollArea({ className, orientation = "vertical", children, ...props }: ScrollAreaProps) {
  const overflowClass = {
    vertical: "overflow-y-auto overflow-x-hidden",
    horizontal: "overflow-x-auto overflow-y-hidden",
    both: "overflow-auto",
  }[orientation];

  return (
    <div
      data-slot="scroll-area"
      className={cx(
        "relative",
        overflowClass,
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 hover:scrollbar-thumb-neutral-400",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
