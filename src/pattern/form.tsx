import { type ReactNode } from "react";
import { useFieldContext } from "@pattern/form.hooks";
import { FormField, Label, FieldError, FieldHint } from "@ui/form";
import { Input } from "@ui/input";
import { cx } from "@ui/variants";

export type ManagedTextFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "number";
  required?: boolean;
  className?: string;
};

export function ManagedTextField({
  label,
  name,
  placeholder,
  hint,
  type = "text",
  required,
  className,
}: ManagedTextFieldProps) {
  const { field } = useFieldContext();
  const error = field.state.meta.errors[0];

  return (
    <FormField className={className}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={field.state.value as string}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        state={error ? "error" : "default"}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
      />
      {hint && !error && <FieldHint id={`${name}-hint`}>{hint}</FieldHint>}
      {error && <FieldError id={`${name}-error`}>{String(error)}</FieldError>}
    </FormField>
  );
}

export type FormActionsProps = {
  children: ReactNode;
  className?: string;
};

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div data-slot="form-actions" className={cx("flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}
