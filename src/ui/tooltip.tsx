import { type ReactNode } from "react";
import * as BaseTooltip from "@base-ui-components/react/tooltip";
import { cx } from "@ui/variants";

export type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
};

export function Tooltip({ children, content, delay = 300 }: TooltipProps) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root delay={delay}>
        <BaseTooltip.Trigger render={<span />}>{children}</BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner>
            <BaseTooltip.Popup
              className={cx(
                "z-50 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md",
              )}
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
