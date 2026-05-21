import { type ReactNode } from "react";
import * as BasePopover from "@base-ui-components/react/popover";
import { cx } from "@ui/variants";

export type PopoverProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({ children, open, onOpenChange }: PopoverProps) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </BasePopover.Root>
  );
}

export type PopoverTriggerProps = BasePopover.Trigger.Props;

export function PopoverTrigger(props: PopoverTriggerProps) {
  return <BasePopover.Trigger {...props} />;
}

export type PopoverContentProps = BasePopover.Popup.Props & {
  className?: string;
};

export function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner>
        <BasePopover.Popup
          data-slot="popover-content"
          className={cx(
            "z-50 w-72 rounded-lg border bg-white p-4 shadow-lg outline-none",
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
