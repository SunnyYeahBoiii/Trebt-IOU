import { ReactNode, useId } from "react";
import { Input, InputProps } from "../primitives/Input";

export interface FormFieldProps extends Omit<InputProps, "id"> {
  children?: ReactNode;
}

export function FormField({ label, error, children, ...inputProps }: FormFieldProps) {
  const id = useId();

  if (children) {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-(--text)">
            {label}
          </label>
        )}
        {children}
        {error && <span className="text-xs text-(--err)">{error}</span>}
      </div>
    );
  }

  return <Input id={id} label={label} error={error} {...inputProps} />;
}
