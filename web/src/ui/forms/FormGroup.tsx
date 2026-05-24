import { useId } from "react";
import { Checkbox } from "../primitives/Checkbox";
import { Stack } from "../layouts/Stack";

export interface FormGroupProps {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  direction?: "horizontal" | "vertical";
}

export function FormGroup({ label, options, selected, onChange, direction = "vertical" }: FormGroupProps) {
  const groupId = useId();

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <fieldset className="border border-(--clr) rounded-lg p-3" aria-labelledby={`${groupId}-legend`}>
      <legend id={`${groupId}-legend`} className="text-sm font-medium text-white px-2">
        {label}
      </legend>
      <Stack direction={direction} gap="sm" className="mt-2">
        {options.map((opt) => (
          <Checkbox
            key={opt.id}
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            label={opt.label}
          />
        ))}
      </Stack>
    </fieldset>
  );
}
