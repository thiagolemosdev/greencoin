import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useNavigate } from "@tanstack/react-router";
import { register } from "@core/api/auth";
import { useAuth } from "@core/auth-context";
import { Button } from "@ui/button";
import { useAppForm } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { RegisterSchema, type RegisterValues } from "@features/auth/schemas";

export function RegisterForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" } satisfies RegisterValues,
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: RegisterSchema },
    onSubmit: async ({ value }) => {
      await register({ name: value.name, email: value.email, password: value.password });
      await signIn({ email: value.email, password: value.password });
      await navigate({ to: "/dashboard" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="name">
        {() => <ManagedTextField label="Name" name="name" required />}
      </form.Field>
      <form.Field name="email">
        {() => <ManagedTextField label="Email" name="email" type="email" required />}
      </form.Field>
      <form.Field name="password">
        {() => <ManagedTextField label="Password" name="password" type="password" required />}
      </form.Field>
      <form.Field name="confirmPassword">
        {() => (
          <ManagedTextField label="Confirm password" name="confirmPassword" type="password" required />
        )}
      </form.Field>
      <FormActions className="mt-2 flex-col">
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          )}
        </form.Subscribe>
      </FormActions>
    </form>
  );
}
