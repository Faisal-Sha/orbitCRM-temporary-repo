
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AdvancedTabProps {
  editing: any;
  setEditing: (editing: any) => void;
}

export function AdvancedTab({ editing, setEditing }: AdvancedTabProps) {
  return (
    <div className="pt-4 flex flex-col gap-4 px-0 sm:px-2">
      <div>
        <Label>Type</Label>
        <Select
          value={editing.type || "1on1"}
          onValueChange={val => setEditing({ ...editing, type: val })}
        >
          <SelectTrigger>
            <SelectValue>
              {editing.type === "group" ? "Group" : "One-on-one"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1on1">One-on-one</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {editing.type === "group" && (
        <div>
          <Label>Max Participants</Label>
          <Input
            type="number"
            min={2}
            max={50}
            step={1}
            value={editing.participants || 5}
            onChange={e => setEditing({ ...editing, participants: Number(e.target.value) })}
            className="w-24"
          />
        </div>
      )}
      <div>
        <Label>Recurring events</Label>
        <Switch
          checked={!!editing.recurring}
          onCheckedChange={v => setEditing({ ...editing, recurring: v })}
        />
      </div>
      <div>
        <Label className="mb-1 block">Redirect after scheduling (URL)</Label>
        <Input
          type="url"
          placeholder="https://yourdomain.com/after-booking"
          value={editing.redirectUrl || ""}
          onChange={e => setEditing({ ...editing, redirectUrl: e.target.value })}
        />
      </div>
    </div>
  );
}
