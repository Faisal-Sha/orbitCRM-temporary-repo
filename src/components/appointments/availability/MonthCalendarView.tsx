
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { Availability, TimeSlot, Day } from "./types";
import { ALL_DAYS } from "./constants";
import { getMonthInfoV2 } from "./utils";

interface MonthCalendarViewProps {
  availabilities: Availability[];
  monthActiveId: string;
  setMonthActiveId: (id: string) => void;
  editMonth: Date;
  setEditMonth: (date: Date) => void;
  monthAvail: { [key: string]: { enabled: boolean, ranges: string[] } };
  setMonthAvail: (avail: any) => void;
}

export const MonthCalendarView = ({
  availabilities,
  monthActiveId,
  setMonthActiveId,
  editMonth,
  setEditMonth,
  monthAvail,
  setMonthAvail
}: MonthCalendarViewProps) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
      {availabilities.length > 1 && (
        <div className="mb-4 flex items-center gap-2 justify-center">
          <Label className="mr-2">Edit:</Label>
          <Select
            value={monthActiveId}
            onValueChange={v => setMonthActiveId(v)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue>
                {availabilities.find(a => a.id === monthActiveId)?.name || "Select"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-[60]">
              {availabilities.map(a =>
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* Controls */}
      <div className="flex justify-center items-center mb-4 gap-2">
        <Button size="icon" variant="ghost" onClick={() => setEditMonth(subMonths(editMonth, 1))}>
          <ChevronLeft size={20} />
        </Button>
        <span className="font-medium text-base">{format(editMonth, "MMMM yyyy")}</span>
        <Button size="icon" variant="ghost" onClick={() => setEditMonth(addMonths(editMonth, 1))}>
          <ChevronRight size={20} />
        </Button>
      </div>
      {/* Calendar grid header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-xs text-muted-foreground">
        {ALL_DAYS.map((day, i) => (
          <div key={i} className="font-semibold">{day}</div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 text-xs">
        {(() => {
          const year = editMonth.getFullYear();
          const month = editMonth.getMonth();
          const { daysInMonth, firstDay, lastDay } = getMonthInfoV2(month, year);

          const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
          let cells = [];
          for (let i = 0; i < totalCells; ++i) {
            const dateNum = i - firstDay + 1;
            if (i < firstDay || dateNum > daysInMonth) {
              cells.push({ blank: true, day: null, key: "blank-" + i });
            } else {
              cells.push({ blank: false, day: dateNum, key: "day-" + dateNum });
            }
          }
          const currentAvail = availabilities.find(a => a.id === monthActiveId) || availabilities[0];

          return cells.map((cell, i) => {
            if (cell.blank) {
              return (
                <div key={cell.key} className="aspect-square rounded bg-transparent"></div>
              );
            }
            const fmtDate = format(new Date(year, month, cell.day), "yyyy-MM-dd");
            let relevantSlots: TimeSlot[] = [];
            if (monthAvail[fmtDate]) {
              let slotObj: { slots: TimeSlot[] } | null = null;
              for (const val of Object.values(monthAvail[fmtDate])) {
                if (
                  val &&
                  typeof val === "object" &&
                  "slots" in val &&
                  Array.isArray((val as any).slots)
                ) {
                  slotObj = val as { slots: TimeSlot[] };
                  break;
                }
              }
              relevantSlots = slotObj?.slots ?? [];
            } else {
              const weekdayIdx =
                new Date(year, month, cell.day).getDay() === 0
                  ? 6 
                  : new Date(year, month, cell.day).getDay() - 1;
              const dayLabel = ALL_DAYS[weekdayIdx];
              relevantSlots = (currentAvail.days[dayLabel] || []);
            }
            const available = relevantSlots.length > 0;

            return (
              <Popover key={cell.key}>
                <PopoverTrigger asChild>
                  <div
                    className={`
                      aspect-square rounded cursor-pointer flex items-center justify-center border 
                      ${available ? "bg-green-100 hover:bg-green-200 border-green-500" : "bg-gray-100 hover:bg-secondary"}
                      font-semibold text-base
                    `}
                    title={available ? "Available" : "Unavailable"}
                  >
                    {cell.day}
                  </div>
                </PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span style={{ display: "none" }} />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white text-black border border-gray-200 shadow">
                    {available ? "Available" : "Unavailable"}
                  </TooltipContent>
                </Tooltip>
                <PopoverContent
                  align="start"
                  className="w-[350px] max-h-[70vh] overflow-y-auto p-4 z-[70] bg-white shadow-xl"
                  style={{ maxWidth: 380, minWidth: 250 }}
                >
                  <div className="mb-1 font-medium text-sm">
                    Edit Time Slots for&nbsp;
                    <span className="font-semibold">{format(new Date(year, month, cell.day), "PPPP")}</span>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    {(() => {
                      const weekdayIdx =
                        new Date(year, month, cell.day).getDay() === 0
                          ? 6
                          : new Date(year, month, cell.day).getDay() - 1;
                      const dayLabel = ALL_DAYS[weekdayIdx];
                      const dateKey = fmtDate;

                      function isValidDaySlotObject(obj: any): obj is { slots: TimeSlot[]; enabled: boolean } {
                        return (
                          obj &&
                          typeof obj === "object" &&
                          Array.isArray(obj.slots) &&
                          typeof obj.enabled === "boolean"
                        );
                      }

                      const rawData = monthAvail[dateKey]?.[dayLabel];
                      let dayData: { enabled: boolean; slots: TimeSlot[] };
                      if (isValidDaySlotObject(rawData)) {
                        dayData = rawData;
                      } else {
                        dayData = { enabled: true, slots: relevantSlots };
                      }
                      const slots = dayData.slots;

                      return (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-3 items-center mb-2 bg-muted/60 rounded px-2 py-2">
                            <span className="font-semibold text-base w-10">{dayLabel}</span>
                          </div>
                          <div className="max-h-56 overflow-y-auto flex flex-col gap-2 pr-2">
                            {slots.map((slot, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 mb-1 bg-white border rounded px-2 py-1"
                              >
                                <Input
                                  type="time"
                                  className="w-24"
                                  value={slot.from}
                                  onChange={e =>
                                    setMonthAvail(prev => ({
                                      ...prev,
                                      [dateKey]: {
                                        ...prev[dateKey],
                                        [dayLabel]: {
                                          enabled: true,
                                          slots: slots.map((s, i) =>
                                            i === idx ? { ...s, from: e.target.value } : s
                                          ),
                                        },
                                      },
                                    }))
                                  }
                                />
                                <span>-</span>
                                <Input
                                  type="time"
                                  className="w-24"
                                  value={slot.to}
                                  onChange={e =>
                                    setMonthAvail(prev => ({
                                      ...prev,
                                      [dateKey]: {
                                        ...prev[dateKey],
                                        [dayLabel]: {
                                          enabled: true,
                                          slots: slots.map((s, i) =>
                                            i === idx ? { ...s, to: e.target.value } : s
                                          ),
                                        },
                                      },
                                    }))
                                  }
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="p-1"
                                  onClick={() =>
                                    setMonthAvail(prev => ({
                                      ...prev,
                                      [dateKey]: {
                                        ...prev[dateKey],
                                        [dayLabel]: {
                                          enabled: true,
                                          slots: slots.filter((_, i) => i !== idx),
                                        },
                                      },
                                    }))
                                  }
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="w-fit"
                              onClick={() =>
                                setMonthAvail(prev => ({
                                  ...prev,
                                  [dateKey]: {
                                    ...prev[dateKey],
                                    [dayLabel]: {
                                      enabled: true,
                                      slots: [...(slots || []), { from: "09:00", to: "12:00" }],
                                    },
                                  },
                                }))
                              }
                            >Add time</Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </PopoverContent>
              </Popover>
            );
          });
        })()}
      </div>
      <div className="mt-4 text-xs text-gray-400">Click any date to adjust availability for that day.</div>
    </div>
  );
};
