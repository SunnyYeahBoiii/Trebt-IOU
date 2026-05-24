import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-(--text)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-sm bg-(--clr) px-3 py-2 text-(--text) outline-none focus:ring-2 focus:ring-(--btn) ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-(--err)">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
