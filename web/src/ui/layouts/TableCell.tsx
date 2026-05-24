import { forwardRef } from "react";
import type { TdHTMLAttributes } from "react";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td
      ref={ref}
      className={`border-b border-(--border) px-4 py-3 align-middle text-(--text) ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
