
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string;
  placeholder?: string;
  maxLen?: number;
  onSave: (newVal: string) => void;
  className?: string;
  type?: string;
}

export const EditableCell = ({
  value,
  placeholder,
  maxLen = 120,
  onSave,
  className = "",
  type = "text"
}: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    setVal(value);
  }, [value]);
  
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);
  
  const save = () => {
    setEditing(false);
    if (val !== value) onSave(val);
  };
  
  return (
    <span className={cn("relative group inline-block transition-colors", className)}>
      {editing ? (
        <input
          ref={inputRef}
          type={type}
          maxLength={maxLen}
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={e => {
            if (e.key === "Enter") save();
            else if (e.key === "Escape") {
              setEditing(false);
              setVal(value);
            }
          }}
          className="rounded border border-primary bg-white px-2 py-1 text-sm w-[140px] outline-none"
        />
      ) : (
        <span
          tabIndex={0}
          role="button"
          title="Click to edit"
          className={cn(
            "cursor-pointer px-1 rounded hover:bg-primary/10 hover:border-primary/30 border transition-all",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary"
          )}
          onClick={() => setEditing(true)}
        >
          {value || <span className="text-muted-foreground">{placeholder || "—"}</span>}
        </span>
      )}
    </span>
  );
};
