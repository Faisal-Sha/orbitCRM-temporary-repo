
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityForm as FormType, DaySlotState, Day, TimeSlot } from "./types";
import { TIMEZONES, ALL_DAYS } from "./constants";
import { HolidaysModal } from "./HolidaysModal";

interface AvailabilityFormProps {
  open: boolean;
  onClose: () => void;
  form: FormType;
  setForm: (form: FormType) => void;
  daySlotState: Record<Day, DaySlotState>;
  setDaySlotState: (state: Record<Day, DaySlotState>) => void;
  editHolidays: Date[];
  setEditHolidays: (dates: Date[]) => void;
  showCreateHolidayModal: boolean;
  setShowCreateHolidayModal: (show: boolean) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export const AvailabilityForm = ({
  open,
  onClose,
  form,
  setForm,
  daySlotState,
  setDaySlotState,
  editHolidays,
  setEditHolidays,
  showCreateHolidayModal,
  setShowCreateHolidayModal,
  onSubmit,
  isEditing
}: AvailabilityFormProps) => {
  const updateDaySlot = (day: Day, idx: number, value: Partial<TimeSlot>) => {
    const newState = {
      ...daySlotState,
      [day]: {
        ...daySlotState[day],
        slots: daySlotState[day].slots.map((slot, i) =>
          i === idx ? { ...slot, ...value } : slot
        ),
      },
    };
    setDaySlotState(newState);
  };

  const removeSlot = (day: Day, idx: number) => {
    const newState = {
      ...daySlotState,
      [day]: {
        ...daySlotState[day],
        slots: daySlotState[day].slots.filter((_, i) => i !== idx),
      },
    };
    setDaySlotState(newState);
  };

  const addSlot = (day: Day) => {
    const newState = {
      ...daySlotState,
      [day]: {
        ...daySlotState[day],
        slots: [...daySlotState[day].slots, { from: "09:00", to: "12:00" }],
      },
    };
    setDaySlotState(newState);
  };

  const toggleDayEnabled = (day: Day, checked: boolean) => {
    const newState = {
      ...daySlotState,
      [day]: { ...daySlotState[day], enabled: checked },
    };
    setDaySlotState(newState);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={isEditing ? "max-h-[90vh] overflow-y-auto flex flex-col" : ""}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Global Availability" : "Create New Global Availability"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pb-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={v => setForm({ ...form, timezone: v })}>
              <SelectTrigger>
                <SelectValue>{form.timezone}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => <SelectItem value={tz} key={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Holidays (calendar)</Label>
            <div className="flex gap-2 items-center flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-52 justify-start">
                    {editHolidays.length
                      ? "Pick more dates"
                      : "Pick one or more dates"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-2 z-50">
                  <ShadcnCalendar
                    mode="multiple"
                    selected={editHolidays}
                    onSelect={d => {
                      setEditHolidays(d || []);
                      const newForm = {
                        ...form,
                        holidays: (d || []).map(day => format(day, "yyyy-MM-dd"))
                      };
                      setForm(newForm);
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {editHolidays.length > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowCreateHolidayModal(true)}
                  className="flex items-center gap-2"
                >
                  Show holidays
                  <span className="rounded-full bg-gray-300 text-xs px-2 py-0.5 ml-1">
                    {editHolidays.length}
                  </span>
                </Button>
              )}
            </div>
            <HolidaysModal
              open={showCreateHolidayModal}
              holidays={form.holidays}
              availabilityIndex={-1}
              onClose={() => setShowCreateHolidayModal(false)}
              onRemove={idx => {
                const newHolidayStrings = form.holidays.filter((_, i) => i !== idx);
                const newForm = { ...form, holidays: newHolidayStrings };
                setForm(newForm);
                setEditHolidays(editHolidays.filter((_, i) => i !== idx));
              }}
            />
          </div>
          <div>
            <Label>Preferred Time Slots</Label>
            <div className="flex flex-col gap-2">
              {ALL_DAYS.map(day =>
                <div key={day} className="flex gap-3 items-center p-1 bg-muted rounded">
                  <Switch
                    checked={daySlotState[day]?.enabled}
                    onCheckedChange={v => toggleDayEnabled(day, v)}
                  />
                  <span className="w-8">{day}</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {daySlotState[day]?.enabled && (
                      <>
                        {daySlotState[day].slots.map((slot, i) => (
                          <div key={i} className="flex items-center bg-white border rounded px-2 py-1 gap-2 mb-1">
                            <Input
                              type="time"
                              className="w-20"
                              value={slot.from}
                              onChange={e =>
                                updateDaySlot(day, i, { from: e.target.value })
                              }
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              className="w-20"
                              value={slot.to}
                              onChange={e =>
                                updateDaySlot(day, i, { to: e.target.value })
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="p-1"
                              onClick={() => removeSlot(day, i)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => addSlot(day)}
                        >Add time</Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>{isEditing ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
