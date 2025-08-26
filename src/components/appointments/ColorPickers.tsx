
import { CARD_COLORS } from "./constants";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <input
      type="color"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-10 h-10 border rounded-full p-0 bg-transparent cursor-pointer"
      aria-label="Pick a color"
    />
  );
}

export function PresetColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {CARD_COLORS.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          type="button"
          className={`
            w-7 h-7 rounded-full border-2
            flex items-center justify-center cursor-pointer
            ${value === c ? "border-primary ring-2 ring-primary" : "border-gray-200"}
          `}
          style={{ backgroundColor: c }}
          aria-label={`pick ${c}`}
        >
          {value === c && <span className="block w-3 h-3 rounded-full bg-white" />}
        </button>
      ))}
    </div>
  );
}
