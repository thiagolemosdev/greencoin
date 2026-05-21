import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { Button } from "@ui/button";
import { useAppForm, FieldContext } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { UpdateProfileSchema, type UpdateProfileValues } from "@features/profile/schemas";
import { useUpdateProfile } from "@features/profile/hooks";
import { toast } from "@ui/toaster";
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
      toast.success("Profile updated successfully.");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4 rounded-lg border bg-white p-6"
    >
      <form.Field name="name">
        {(field) => (
          <FieldContext.Provider value={{ field }}>
            <ManagedTextField label="Name" name="name" required />
          </FieldContext.Provider>
        )}
      </form.Field>

      <form.Field name="bio">
        {(field) => (
          <FieldContext.Provider value={{ field }}>
            <ManagedTextField label="Bio" name="bio" hint="A short description about yourself." />
          </FieldContext.Provider>
        )}
      </form.Field>

      <FormActions className="mt-2">
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          )}
        </form.Subscribe>
      </FormActions>
    </form>
  );
}
