import { forwardRef } from "react";
import * as BaseCheckbox from "@base-ui-components/react/checkbox";
import { cx } from "@ui/variants";

export type CheckboxProps = BaseCheckbox.Root.Props & {
  className?: string;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <BaseCheckbox.Root
      ref={ref}
      data-slot="checkbox"
      className={cx(
        "peer size-4 shrink-0 rounded border border-neutral-300 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-primary-600 data-[checked]:bg-primary-600",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center text-white">
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  ),
);
Checkbox.displayName = "Checkbox";
