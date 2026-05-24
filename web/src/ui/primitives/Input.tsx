import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-(--text)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`min-h-10 rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--focus) focus:ring-1 focus:ring-(--focus) ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-(--err)">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
