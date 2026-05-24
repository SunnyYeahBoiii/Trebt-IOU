import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-(--border) bg-(--surface) p-5 shadow-[var(--shadow-soft)] ${className}`}
        {...props}
      >
        {title && <h2 className="mb-4 text-lg font-semibold text-(--text)">{title}</h2>}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
