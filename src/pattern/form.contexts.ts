import { createContext, useContext } from "react";
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";

export type FormContextValue = {
  form: AnyFormApi;
};

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used inside a managed form");
  return ctx;
}

export type FieldContextValue = {
  field: AnyFieldApi;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error("useFieldContext must be used inside a managed field");
  return ctx;
}
