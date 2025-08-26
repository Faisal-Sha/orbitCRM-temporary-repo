
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AVAILABILITY_SCHEDULES, defaultTime } from "./constants";

interface AvailabilityTabProps {
  calendarAvailability: any;
  setCalendarAvailability: (availability: any) => void;
  scheduleOption: string;
  setScheduleOption: (option: string) => void;
  dateRange: {from: Date|null, to: Date|null};
  setDateRange: (range: {from: Date|null, to: Date|null}) => void;
  numUpcomingDays: string;
  setNumUpcomingDays: (days: string) => void;
  selectedGlobalAvailability: string;
  setSelectedGlobalAvailability: (availability: string) => void;
}

export function AvailabilityTab({
  calendarAvailability,
  setCalendarAvailability,
  scheduleOption,
  setScheduleOption,
  dateRange,
  setDateRange,
  numUpcomingDays,
  setNumUpcomingDays,
  selectedGlobalAvailability,
  setSelectedGlobalAvailability,
}: AvailabilityTabProps) {
  return (
    <div className="pt-4 space-y-8 px-0 sm:px-2">
      <Tabs defaultValue="set" className="w-full">
        <TabsList className="mb-3 gap-2 w-full">
          <TabsTrigger value="set">Set Availability</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        {/* Set Availability */}
        <TabsContent value="set" className="space-y-6">
          <Label className="mb-1 block">Select Availability</Label>
          <Select
            value={selectedGlobalAvailability}
            onValueChange={setSelectedGlobalAvailability}
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_SCHEDULES.map(opt =>
                <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {selectedGlobalAvailability === "custom" && (
            <div>
              <div className="font-medium mb-2">Configure Availability for Each Day</div>
              <div className="flex flex-col gap-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => (
                  <div key={day} className="flex items-center gap-4 p-2 rounded bg-muted">
                    <Switch
                      checked={calendarAvailability[day]?.enabled}
                      onCheckedChange={v =>
                        setCalendarAvailability({
                          ...calendarAvailability,
                          [day]: {
                            ...calendarAvailability[day],
                            enabled: v
                          }
                        })
                      }
                    />
                    <span className="w-8">{day}</span>
                    <div className="flex-1 flex gap-2 flex-wrap items-center">
                      {calendarAvailability[day]?.enabled && (
                        <>
                          {calendarAvailability[day]?.ranges?.map((rng: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 bg-white border rounded px-2 py-1">
                              <Label className="text-xs mr-1">From</Label>
                              <Input
                                type="time"
                                value={rng.from}
                                className="w-24 px-2 py-1 text-sm"
                                onChange={e => {
                                  const value = e.target.value;
                                  setCalendarAvailability({
                                    ...calendarAvailability,
                                    [day]: {
                                      ...calendarAvailability[day],
                                      ranges: calendarAvailability[day].ranges.map((old: any, idx: number) =>
                                        idx === i ? { ...old, from: value } : old
                                      )
                                    }
                                  });
                                }}
                              />
                              <Label className="text-xs mx-1">To</Label>
                              <Input
                                type="time"
                                value={rng.to}
                                className="w-24 px-2 py-1 text-sm"
                                onChange={e => {
                                  const value = e.target.value;
                                  setCalendarAvailability({
                                    ...calendarAvailability,
                                    [day]: {
                                      ...calendarAvailability[day],
                                      ranges: calendarAvailability[day].ranges.map((old: any, idx: number) =>
                                        idx === i ? { ...old, to: value } : old
                                      )
                                    }
                                  });
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="p-1"
                                onClick={() => {
                                  setCalendarAvailability({
                                    ...calendarAvailability,
                                    [day]: {
                                      ...calendarAvailability[day],
                                      ranges: calendarAvailability[day].ranges.filter((_: any, idx: number) => idx !== i)
                                    }
                                  });
                                }}
                              >
                                <Trash2 size={14} className="text-gray-400" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            className="ml-2"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setCalendarAvailability({
                                ...calendarAvailability,
                                [day]: {
                                  ...calendarAvailability[day],
                                  ranges: [
                                    ...calendarAvailability[day].ranges,
                                    defaultTime()
                                  ]
                                }
                              });
                            }}
                          >Add time</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Schedule subtab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="flex flex-col gap-4 w-full">
            <Label className="mb-1 block">Select Schedule</Label>
            <Select
              value={scheduleOption}
              onValueChange={val => setScheduleOption(val)}
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_range">By date range</SelectItem>
                <SelectItem value="num_days">By set number of days</SelectItem>
              </SelectContent>
            </Select>
            {scheduleOption === "date_range" && (
              <div className="flex gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-44 flex justify-start">
                      {dateRange.from
                        ? format(dateRange.from, "PPP")
                        : "From Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <ShadcnCalendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={date => setDateRange({ ...dateRange, from: date })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-44 flex justify-start">
                      {dateRange.to
                        ? format(dateRange.to, "PPP")
                        : "To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <ShadcnCalendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={date => setDateRange({ ...dateRange, to: date })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {scheduleOption === "num_days" && (
              <div className="flex flex-col gap-2">
                <Label className="mb-1 block">Number of days</Label>
                <Input
                  type="number"
                  className="w-24"
                  value={numUpcomingDays}
                  onChange={e => setNumUpcomingDays(e.target.value)}
                  min={1}
                  max={365}
                  placeholder="e.g. 7"
                />
                <div className="text-xs text-gray-500">
                  Example: enter "7" for next 7 days, "30" for next month
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
