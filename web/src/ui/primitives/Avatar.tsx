import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "28px", md: "36px", lg: "48px" };
const fontSizeMap = { sm: "10px", md: "14px", lg: "18px" };

export function Avatar({ name, size = "md", className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-(--ac-state) text-(--text) font-semibold ring-1 ring-(--border) ${className}`}
      style={{ width: dimension, height: dimension, fontSize }}
      role="img"
      aria-label={name}
      {...props}
    >
      {initials}
    </div>
  );
}
