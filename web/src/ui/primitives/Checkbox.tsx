import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label htmlFor={checkboxId} className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`h-4 w-4 rounded accent-(--btn) ${className}`}
          {...props}
        />
        <span className="text-sm text-(--text)">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
