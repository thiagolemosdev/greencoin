import { Button } from "@ui/button";

export type ItemsEmptyStateProps = {
  onCreateClick: () => void;
};

export function ItemsEmptyState({ onCreateClick }: ItemsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100">
        <svg className="size-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-3-3v6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-900">No items yet</p>
        <p className="mt-1 text-xs text-neutral-500">Create your first item to get started.</p>
      </div>
      <Button variant="primary" size="md" onClick={onCreateClick}>
        Create item
      </Button>
    </div>
  );
}
