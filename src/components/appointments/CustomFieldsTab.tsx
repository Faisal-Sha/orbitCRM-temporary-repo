
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { DUMMY_PHONE_FORMATS } from "./constants";

interface CustomFieldsTabProps {
  customFields: any[];
  setCustomFields: (fields: any[]) => void;
  newCustomFieldLabel: string;
  setNewCustomFieldLabel: (label: string) => void;
  editingPhoneFormat: { [id: string]: string };
  setEditingPhoneFormat: (formats: { [id: string]: string }) => void;
  editingFieldType: { [id: string]: "text"|"textarea"|"phone" };
  setEditingFieldType: (types: { [id: string]: "text"|"textarea"|"phone" }) => void;
}

export function CustomFieldsTab({
  customFields,
  setCustomFields,
  newCustomFieldLabel,
  setNewCustomFieldLabel,
  editingPhoneFormat,
  setEditingPhoneFormat,
  editingFieldType,
  setEditingFieldType,
}: CustomFieldsTabProps) {
  return (
    <div className="pt-4 space-y-4 px-0 sm:px-2">
      <div className="font-medium">Custom Client Fields</div>
      <div className="space-y-2">
        {customFields.map((field, idx) => (
          <div key={field.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-muted px-3 py-2 rounded-md">
            <div className="flex-1">
              <Input
                value={field.label}
                onChange={e => {
                  const val = e.target.value;
                  setCustomFields(
                    customFields.map(f =>
                      f.id === field.id ? { ...f, label: val } : f
                    )
                  );
                }}
                className="mb-1 rounded px-3 py-1 text-sm"
              />
              <Select
                value={editingFieldType[field.id] || "text"}
                onValueChange={val =>
                  setEditingFieldType({ ...editingFieldType, [field.id]: val as any })
                }
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue>
                    {editingFieldType[field.id] === "textarea"
                      ? "Textarea"
                      : editingFieldType[field.id] === "phone"
                        ? "Phone"
                        : "Text"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
              {editingFieldType[field.id] === "phone" && (
                <div className="mt-2 flex flex-col gap-1">
                  <Label className="text-xs mb-0.5">Phone Format</Label>
                  <div className="flex gap-2">
                    {DUMMY_PHONE_FORMATS.map(fmt => (
                      <button
                        key={fmt.value}
                        type="button"
                        className={`
                          px-2 py-1 text-xs rounded border
                          ${editingPhoneFormat[field.id] === fmt.value
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-muted'
                          }
                        `}
                        onClick={() =>
                          setEditingPhoneFormat({ ...editingPhoneFormat, [field.id]: fmt.value })
                        }
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Switch
              checked={field.required}
              onCheckedChange={v =>
                setCustomFields(customFields.map(f =>
                  f.id === field.id ? { ...f, required: !!v } : f
                ))
              }
              title="Required"
            />
            <span className="text-xs text-gray-400">Required</span>
            <Button size="icon" variant="ghost" onClick={() => setCustomFields(customFields.filter(f => f.id !== field.id))}>
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
        <form
          className="flex mt-2 gap-2"
          onSubmit={e => {
            e.preventDefault();
            if (newCustomFieldLabel.trim()) {
              setCustomFields([...customFields, { id: "field" + Date.now() + Math.random(), label: newCustomFieldLabel, required: false }]);
            }
            setNewCustomFieldLabel("");
          }}
        >
          <Input
            placeholder="Add field"
            value={newCustomFieldLabel}
            onChange={e => setNewCustomFieldLabel(e.target.value)}
            className="rounded px-3 py-1 text-sm"
          />
          <Button size="sm" type="submit"><Plus size={15} /></Button>
        </form>
      </div>
    </div>
  );
}
