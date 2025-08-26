
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { INTERVAL_OPTIONS } from "./constants";

interface TimingTabProps {
  editing: any;
  setEditing: (editing: any) => void;
}

export function TimingTab({ editing, setEditing }: TimingTabProps) {
  return (
    <div className="pt-4 space-y-4 px-0 sm:px-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <Label className="mb-1 block">Duration per appt (min)</Label>
          <Input
            type="number"
            min={5}
            max={180}
            step={5}
            placeholder="e.g. 30"
            value={editing.duration || ""}
            onChange={e => setEditing({ ...editing, duration: e.target.value })}
            className="w-24 px-3 py-2"
          />
        </div>
        <div>
          <Label className="mb-1 block">Buffer time after (min)</Label>
          <Input
            type="number"
            min={0}
            max={60}
            step={5}
            placeholder="e.g. 5"
            value={editing.buffer || ""}
            onChange={e => setEditing({ ...editing, buffer: e.target.value })}
            className="w-24 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <Label className="mb-1 block">Scheduling interval</Label>
        <Select
          value={String(editing.schedulingInterval || 15)}
          onValueChange={val => setEditing({ ...editing, schedulingInterval: Number(val) })}
        >
          <SelectTrigger>
            <SelectValue>
              {String(editing.schedulingInterval || 15)} minutes
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {INTERVAL_OPTIONS.map(min => (
              <SelectItem value={String(min)} key={min}>{min} min</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
