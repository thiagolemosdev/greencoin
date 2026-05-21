import { useForm } from "@tanstack/react-form";
import { FormContext, FieldContext, useFormContext, useFieldContext } from "@pattern/form.contexts";

// Re-export contexts para uso em componentes de formulário
export { FormContext, FieldContext, useFormContext, useFieldContext };

// useAppForm é um alias para useForm com os mesmos parâmetros
export const useAppForm = useForm;

// withForm é um passthrough HOC para compatibilidade
export function withForm<TProps extends object>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps> {
  return Component;
}

export type FormSubmitHandler<TValues> = (values: TValues) => Promise<void> | void;

export function createFormSubmitHandler<TValues>(
  handler: FormSubmitHandler<TValues>,
): (values: TValues) => Promise<void> {
  return async (values) => {
    await handler(values);
  };
}
