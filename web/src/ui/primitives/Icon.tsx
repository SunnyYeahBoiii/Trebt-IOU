import { SVGAttributes } from "react";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={`inline-block ${className}`}
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons/${name}.svg#${name}`} />
    </svg>
  );
}
