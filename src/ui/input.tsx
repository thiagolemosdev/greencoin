import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "@ui/variants";
import { inputVariants } from "@ui/input.variants";
import type { VariantProps } from "@ui/variants";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input"
        data-size={size}
        className={cx(inputVariants({ size, state }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
