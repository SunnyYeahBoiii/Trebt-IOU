import { ThHTMLAttributes, forwardRef } from "react";

export const TableHeader = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <th
      ref={ref}
      className={`border-2 border-(--border) p-2.5 text-center text-white font-semibold ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
TableHeader.displayName = "TableHeader";
