import { TableHTMLAttributes, forwardRef } from "react";

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className = "", children, ...props }, ref) => (
    <table ref={ref} className={`w-full table-fixed border-collapse ${className}`} {...props}>
      {children}
    </table>
  )
);
Table.displayName = "Table";
