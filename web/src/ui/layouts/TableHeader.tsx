import { forwardRef } from "react";
import type { ThHTMLAttributes } from "react";

export const TableHeader = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <th
      ref={ref}
      className={`border-b border-(--border) bg-(--surface-raised) px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em] text-(--text-muted) ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
TableHeader.displayName = "TableHeader";
