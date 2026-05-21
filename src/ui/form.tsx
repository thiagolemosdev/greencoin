import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes, type ReactNode } from "react";
import { cx } from "@ui/variants";

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  error?: string;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="form-field" className={cx("flex flex-col gap-1.5", className)} {...props} />
  ),
);
FormField.displayName = "FormField";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      data-slot="label"
      className={cx("text-sm font-medium text-neutral-700", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden>
          *
        </span>
      )}
    </label>
  ),
);
Label.displayName = "Label";

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        data-slot="field-error"
        role="alert"
        className={cx("text-xs text-red-600", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
FieldError.displayName = "FieldError";

export type FieldHintProps = HTMLAttributes<HTMLParagraphElement>;

export const FieldHint = forwardRef<HTMLParagraphElement, FieldHintProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="field-hint"
      className={cx("text-xs text-neutral-500", className)}
      {...props}
    />
  ),
);
FieldHint.displayName = "FieldHint";
