import { Dialog, DialogContent, DialogClose } from "@ui/dialog";
import { Button } from "@ui/button";
import { isFriendlyError, isNetworkError } from "@core/http-resource";

export type FriendlyErrorDialogProps = {
  error: unknown;
  open: boolean;
  onClose: () => void;
};

export function FriendlyErrorDialog({ error, open, onClose }: FriendlyErrorDialogProps) {
  let title = "Error";
  let detail = "An unexpected error occurred. Please try again.";

  if (isFriendlyError(error)) {
    title = error.title;
    detail = error.detail;
  } else if (isNetworkError(error)) {
    title = "Network Error";
    detail = error.message;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent title={title} description={detail}>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
