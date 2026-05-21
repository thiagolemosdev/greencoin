import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import * as BaseDialog from "@base-ui-components/react/dialog";
import { cx } from "@ui/variants";

export type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within Dialog");
  return ctx;
}

export type DialogProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export function Dialog({ children, open: controlledOpen, onOpenChange, defaultOpen = false }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <BaseDialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </BaseDialog.Root>
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  return <BaseDialog.Trigger {...props}>{children}</BaseDialog.Trigger>;
}

export type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
};

export function DialogContent({ className, title, description, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cx(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl focus:outline-none",
          className,
        )}
        {...props}
      >
        <BaseDialog.Title className="text-lg font-semibold text-neutral-900">{title}</BaseDialog.Title>
        {description && (
          <BaseDialog.Description className="mt-1 text-sm text-neutral-500">
            {description}
          </BaseDialog.Description>
        )}
        <div className="mt-4">{children}</div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function DialogClose({ children, ...props }: DialogCloseProps) {
  return <BaseDialog.Close {...props}>{children}</BaseDialog.Close>;
}
