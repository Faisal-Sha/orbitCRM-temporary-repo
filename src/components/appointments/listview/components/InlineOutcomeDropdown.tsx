
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getIntakeOutcomeBadgeProps } from "../utils";

interface InlineOutcomeDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  badgeClass?: string;
}

export const InlineOutcomeDropdown = ({
  value,
  options,
  onChange,
  badgeClass
}: InlineOutcomeDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <span
        className={`cursor-pointer inline-block px-2 py-1 rounded font-medium text-xs ring-1 ring-inset ring-gray-200 transition-colors ${badgeClass}`}
        tabIndex={0}
      >
        {value}
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="start" className="z-50 min-w-[150px] bg-white outline-none">
      {options.map(opt => (
        <DropdownMenuItem
          key={opt}
          className={`cursor-pointer px-3 py-2 text-sm ${getIntakeOutcomeBadgeProps(opt).className} ${opt === value ? "font-bold" : ""}`}
          onClick={() => { if (opt !== value) onChange(opt); }}
        >
          {opt}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
