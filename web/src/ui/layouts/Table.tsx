import { forwardRef } from "react";
import type { TableHTMLAttributes } from "react";

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className = "", children, ...props }, ref) => (
    <table ref={ref} className={`w-full border-separate border-spacing-0 text-sm ${className}`} {...props}>
      {children}
    </table>
  )
);
Table.displayName = "Table";
