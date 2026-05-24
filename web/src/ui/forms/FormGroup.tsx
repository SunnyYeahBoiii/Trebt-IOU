import { useId } from "react";
import { Checkbox } from "../primitives/Checkbox";
import { Stack } from "../layouts/Stack";

export interface FormGroupProps {
  label: string;
  name?: string;
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  direction?: "horizontal" | "vertical";
}

export function FormGroup({ label, name = "option", options, selected, onChange, direction = "vertical" }: FormGroupProps) {
  const groupId = useId();

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <fieldset className="rounded-lg border border-(--border) bg-(--surface-raised) p-3" aria-labelledby={`${groupId}-legend`}>
      <legend id={`${groupId}-legend`} className="px-2 text-sm font-semibold text-(--text)">
        {label}
      </legend>
      <Stack direction={direction} gap="xs" className="mt-2">
        {options.map((opt) => (
          <Checkbox
            key={opt.id}
            name={name}
            value={opt.id}
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            label={opt.label}
          />
        ))}
      </Stack>
    </fieldset>
  );
}
