import { HTMLAttributes, forwardRef } from "react";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

const gapMap = { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px" };
const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };
const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around" };

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      gap = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} ${wrap ? "flex-wrap" : ""} ${className}`}
        style={{
          gap: gapMap[gap],
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
