import type { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "16px", md: "24px", lg: "32px" };

export function Spinner({ size = "md", className = "", ...props }: SpinnerProps) {
  const dimension = sizeMap[size];
  return (
    <div
      className={`spinner ${className}`}
      style={{ width: dimension, height: dimension }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
