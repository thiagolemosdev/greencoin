import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { Dialog, DialogContent, DialogClose } from "@ui/dialog";
import { Button } from "@ui/button";
import { useAppForm, FieldContext } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { FeatureBDialogSchema, type FeatureBDialogValues } from "@features/feature-b/schemas";
import { useFeatureBSubmit } from "@features/feature-b/hooks";
import { toast } from "@ui/toaster";

export type FeatureBDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function FeatureBDialog({ open, onClose }: FeatureBDialogProps) {
  const submit = useFeatureBSubmit();

  const form = useAppForm({
    defaultValues: {
      subject: "",
      notes: "",
      priority: "medium",
    } satisfies FeatureBDialogValues,
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: FeatureBDialogSchema },
    onSubmit: async ({ value }) => {
      await submit.mutateAsync(value);
      toast.success("Submitted successfully.");
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent title="Feature B" description="Fill in the required details.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="subject">
            {(field) => (
              <FieldContext.Provider value={{ field }}>
                <ManagedTextField label="Subject" name="subject" required />
              </FieldContext.Provider>
            )}
          </form.Field>
          <form.Field name="notes">
            {(field) => (
              <FieldContext.Provider value={{ field }}>
                <ManagedTextField label="Notes" name="notes" />
              </FieldContext.Provider>
            )}
          </form.Field>
          <FormActions>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" loading={isSubmitting}>Submit</Button>
              )}
            </form.Subscribe>
          </FormActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
