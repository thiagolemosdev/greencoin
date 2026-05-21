import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { Dialog, DialogContent, DialogClose } from "@ui/dialog";
import { Button } from "@ui/button";
import { useAppForm } from "@pattern/form.hooks";
import { ManagedTextField, FormActions } from "@pattern/form";
import { CreateItemSchema, type CreateItemValues } from "@features/items/schemas";
import { useCreateItem } from "@features/items/hooks";

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent title="Create item" description="Fill in the details for the new item.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="title">
            {(field) => (
              <ManagedTextField label="Title" name="title" placeholder="Enter a title" required />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <ManagedTextField label="Description" name="description" placeholder="Optional description" />
            )}
          </form.Field>

          <FormActions className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" loading={isSubmitting}>
                  Create
                </Button>
              )}
            </form.Subscribe>
          </FormActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
