import { type ReactNode } from "react";
import * as BaseSelect from "@base-ui-components/react/select";
import { cx } from "@ui/variants";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type SelectProps<T extends string = string> = {
  options: SelectOption<T>[];
  value?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function Select<T extends string = string>({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled,
  className,
}: SelectProps<T>) {
  return (
    <BaseSelect.Root
      value={value}
      onValueChange={onValueChange as (v: string) => void}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        data-slot="select-trigger"
        className={cx(
          "flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <svg className="size-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner>
          <BaseSelect.Popup className="z-50 min-w-32 overflow-hidden rounded-md border bg-white shadow-md">
            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none hover:bg-neutral-50 data-[highlighted]:bg-primary-50 data-[selected]:font-medium disabled:pointer-events-none disabled:opacity-50"
              >
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
