import { type HTMLAttributes } from "react";
import * as BaseTabs from "@base-ui-components/react/tabs";
import { cx } from "@ui/variants";

export type TabsProps = BaseTabs.Root.Props;

export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root data-slot="tabs" className={cx("flex flex-col gap-2", className)} {...props} />;
}

export type TabsListProps = BaseTabs.List.Props;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cx(
        "inline-flex h-10 items-center rounded-md bg-neutral-100 p-1 text-neutral-500",
        className,
      )}
      {...props}
    />
  );
}

export type TabsTriggerProps = BaseTabs.Tab.Props;

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-white data-[selected]:text-neutral-900 data-[selected]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export type TabsContentProps = BaseTabs.Panel.Props;

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-content"
      className={cx("focus-visible:outline-none", className)}
      {...props}
    />
  );
}
