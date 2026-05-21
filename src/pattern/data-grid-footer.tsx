import { cx } from "@ui/variants";
import { Button } from "@ui/button";

export type DataGridFooterProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function DataGridFooter({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: DataGridFooterProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div
      data-slot="data-grid-footer"
      className={cx("flex items-center justify-between border-t px-4 py-3 text-sm text-neutral-600", className)}
    >
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ←
        </Button>
        <span className="px-2 font-medium">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          →
        </Button>
      </div>
    </div>
  );
}
