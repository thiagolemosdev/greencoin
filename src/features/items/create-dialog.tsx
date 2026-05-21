import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useAppForm, FieldContext } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { CreateItemSchema, type CreateItemValues } from "@features/items/schemas";
import { useCreateItem } from "@features/items/hooks";

const IconX = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export type CreateItemDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateItemDialog({ open, onClose }: CreateItemDialogProps) {
  const createItem = useCreateItem();

  const form = useAppForm({
    defaultValues: { title: "", description: "" } satisfies CreateItemValues,
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: CreateItemSchema },
    onSubmit: async ({ value }) => {
      await createItem.mutateAsync(value);
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-theme-border bg-white shadow-2xl dark:border-theme-border-dark dark:bg-theme-dark-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#1e1e1e]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Novo item</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5"
          >
            <IconX />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="p-5 space-y-4"
        >
          <form.Field name="title">
            {(field) => (
              <FieldContext.Provider value={{ field }}>
                <ManagedTextField label="Título" name="title" placeholder="Nome do item" required />
              </FieldContext.Provider>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FieldContext.Provider value={{ field }}>
                <ManagedTextField label="Descrição" name="description" placeholder="Descrição opcional" />
              </FieldContext.Provider>
            )}
          </form.Field>

          <FormActions className="pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
                >
                  {isSubmitting ? "Criando…" : "Criar item"}
                </button>
              )}
            </form.Subscribe>
          </FormActions>
        </form>
      </div>
    </div>
  );
}
