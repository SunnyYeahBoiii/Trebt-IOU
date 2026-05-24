import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-(--text) hover:bg-(--clr)">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`h-4 w-4 rounded border-(--border) accent-(--btn) ${className}`}
          {...props}
        />
        <span className="text-sm text-(--text)">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
