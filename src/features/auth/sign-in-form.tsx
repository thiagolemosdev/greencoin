import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@core/auth-context";
import { Button } from "@ui/button";
import { useAppForm } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { SignInSchema, type SignInValues } from "@features/auth/schemas";

export function SignInForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: { email: "", password: "" } satisfies SignInValues,
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: SignInSchema },
    onSubmit: async ({ value }) => {
      await signIn(value);
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
      <form.Field name="email">
        {() => <ManagedTextField label="Email" name="email" type="email" required />}
      </form.Field>

      <form.Field name="password">
        {() => <ManagedTextField label="Password" name="password" type="password" required />}
      </form.Field>

      <FormActions className="mt-2 flex-col">
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          )}
        </form.Subscribe>
      </FormActions>
    </form>
  );
}
