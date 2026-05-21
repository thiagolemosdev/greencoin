import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useAppForm, FieldContext } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { UpdateProfileSchema, type UpdateProfileValues } from "@features/profile/schemas";
import { useUpdateProfile } from "@features/profile/hooks";
import type { Profile } from "@core/api/profile";

export type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfile = useUpdateProfile(profile.userId);

  const form = useAppForm({
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? "",
    } satisfies UpdateProfileValues,
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: UpdateProfileSchema },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="rounded-2xl border border-theme-border bg-white shadow-sm dark:border-theme-border-dark dark:bg-theme-dark-card"
    >
      <div className="border-b border-gray-100 px-6 py-4 dark:border-[#1e1e1e]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Informações pessoais</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Atualize seu nome e bio exibidos na plataforma.
        </p>
      </div>

      <div className="space-y-4 p-6">
        <form.Field name="name">
          {(field) => (
            <FieldContext.Provider value={{ field }}>
              <ManagedTextField label="Nome" name="name" placeholder="Seu nome completo" required />
            </FieldContext.Provider>
          )}
        </form.Field>

        <form.Field name="bio">
          {(field) => (
            <FieldContext.Provider value={{ field }}>
              <ManagedTextField
                label="Bio"
                name="bio"
                placeholder="Uma breve descrição sobre você"
                hint="Máximo de 300 caracteres."
              />
            </FieldContext.Provider>
          )}
        </form.Field>
      </div>

      <div className="border-t border-gray-100 px-6 py-4 dark:border-[#1e1e1e]">
        <FormActions>
          <form.Subscribe selector={(s) => ({ isSubmitting: s.isSubmitting, isDirty: s.isDirty })}>
            {({ isSubmitting, isDirty }) => (
              <>
                <button
                  type="button"
                  onClick={() => form.reset()}
                  disabled={!isDirty || isSubmitting}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
                >
                  {isSubmitting ? "Salvando…" : "Salvar alterações"}
                </button>
              </>
            )}
          </form.Subscribe>
        </FormActions>
      </div>
    </form>
  );
}
