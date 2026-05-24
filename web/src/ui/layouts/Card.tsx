import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl bg-(--btn) p-4 shadow-md ${className}`}
        {...props}
      >
        {title && <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
