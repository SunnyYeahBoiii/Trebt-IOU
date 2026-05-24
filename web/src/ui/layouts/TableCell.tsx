import { TdHTMLAttributes, forwardRef } from "react";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td
      ref={ref}
      className={`border-2 border-(--border) p-2.5 text-center text-(--text) truncate ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
