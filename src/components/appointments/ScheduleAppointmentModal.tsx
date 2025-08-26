import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon } from "lucide-react";

// Attendees dummy data
const ATTENDEES = [
  { id: "1", name: "Emma Johnson" },
  { id: "2", name: "Liam Thompson" },
  { id: "3", name: "Olivia Williams" },
  { id: "4", name: "Noah Brown" },
  { id: "5", name: "Sophia Lee" },
  { id: "6", name: "Dr. Susan Miller" },
  { id: "7", name: "Dr. Kevin Rivera" },
];

// Dummy availability data: only some times per day available
const getAvailableSlots = (date: Date | undefined, calendar: string) => {
  if (!date || !calendar || calendar === "Select") return [];
  // 16 slots, not 12
  const baseSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];
  const weekday = date.getDay();
  return baseSlots.filter((slot, idx) => {
    if (calendar === "Team" || calendar === "Personal") return idx % 2 !== weekday % 2;
    return (idx + weekday) % 3 !== 0;
  });
};

const CALENDARS = [
  { label: "Intakes", value: "Intakes" },
  { label: "Clients", value: "Clients" },
  { label: "Team", value: "Team" },
  { label: "Personal", value: "Personal" },
];

const LOCATIONS = [
  { label: "Video", value: "Video" },
  { label: "Phone", value: "Phone" },
  { label: "In-Person", value: "In-Person" },
  { label: "Other", value: "Other" },
];

/** Dummy contacts for attendee autocomplete **/
const DUMMY_CONTACTS = [
  "Emma Johnson",
  "Liam Thompson",
  "Olivia Williams",
  "Noah Brown",
  "Sophia Lee",
  "Ava Taylor",
  "Mason White",
  "Isabella Harris",
  "Lucas Martin",
  "Mia Clark",
];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode?: "schedule" | "reschedule";
  initialValues?: Partial<FormValues>;
};

type FormValues = {
  calendar: string;
  date: Date | undefined;
  time: string | undefined;
  attendees: string[];
  title?: string;
  description?: string;
  location?: string;
  locationDetail?: string;
};

// Tooltip with white bg and black text for modal
import {
  Tooltip as OrigTooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent as OrigTooltipContent,
} from "@/components/ui/tooltip";
const Tooltip = OrigTooltip;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof OrigTooltipContent>,
  React.ComponentPropsWithoutRef<typeof OrigTooltipContent>
>(({ className, ...props }, ref) => (
  <OrigTooltipContent
    ref={ref}
    className={
      "bg-white text-black rounded-md px-2 py-1 text-xs shadow-sm border z-50 " + (className || "")
    }
    {...props}
  />
));
TooltipContent.displayName = OrigTooltipContent.displayName;

export default function ScheduleAppointmentModal({
  open,
  onOpenChange,
  mode = "schedule",
  initialValues,
}: Props) {
  // State
  const [calendar, setCalendar] = useState<string>(initialValues?.calendar ?? "Select");
  const [date, setDate] = useState<Date | undefined>(initialValues?.date);
  const [time, setTime] = useState<string | undefined>(initialValues?.time);
  const [attendees, setAttendees] = useState<string[]>(initialValues?.attendees ?? []);
  const [attendeeInput, setAttendeeInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [title, setTitle] = useState<string>(initialValues?.title ?? "");
  const [description, setDescription] = useState<string>(initialValues?.description ?? "");
  const [location, setLocation] = useState<string>(initialValues?.location ?? "");
  const [locationDetail, setLocationDetail] = useState<string>(initialValues?.locationDetail ?? "");

  // For demo: reset on open change
  React.useEffect(() => {
    if (!open) {
      setCalendar("Select");
      setDate(undefined);
      setTime(undefined);
      setAttendees([]);
      setAttendeeInput("");
      setTitle("");
      setDescription("");
      setLocation("");
      setLocationDetail("");
      setShowSuggestions(false);
    }
  }, [open]);

  // Available times for selected date
  const availableSlots = useMemo(() => getAvailableSlots(date, calendar), [date, calendar]);
  // Compute slot "rows": assume 4 per row for demo
  const slotsPerRow = 4;
  const numSlotRows = Math.ceil(availableSlots.length / slotsPerRow);

  // For demo: attendee is required for all; title/description/location only for Team/Personal
  const needsTeamOrPersonalFields = calendar === "Team" || calendar === "Personal";

  // --- AUTOCOMPLETE for attendee input
  const attendeeSuggestions = DUMMY_CONTACTS.filter(
    (c) =>
      c.toLowerCase().includes(attendeeInput.toLowerCase()) &&
      !attendees.includes(c)
  ).slice(0, 7);

  // Form submission (dummy for now)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace with real submit logic
    alert(
      `Scheduled!\n${JSON.stringify(
        {
          calendar,
          date: date ? format(date, "PPP") : "",
          time,
          attendees,
          ...(needsTeamOrPersonalFields && { title, description, location, locationDetail }),
        },
        null,
        2
      )}`
    );
    onOpenChange(false);
  }

  // Conditional location detail
  function renderLocationDetailField() {
    switch (location) {
      case "Video":
        return (
          <div>
            <label className="block text-sm font-medium mb-1 mt-3" htmlFor="video-url">
              Video meeting URL
            </label>
            <Input
              id="video-url"
              type="url"
              placeholder="https://zoom.us/..."
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
            />
          </div>
        );
      case "Phone":
        return (
          <div>
            <label className="block text-sm font-medium mb-1 mt-3" htmlFor="phone-num">
              Phone number
            </label>
            <Input
              id="phone-num"
              type="tel"
              placeholder="(555) 123-4567"
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
            />
          </div>
        );
      case "In-Person":
        return (
          <div>
            <label className="block text-sm font-medium mb-1 mt-3" htmlFor="address">
              Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="Physical address"
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
            />
          </div>
        );
      case "Other":
        return (
          <div>
            <label className="block text-sm font-medium mb-1 mt-3" htmlFor="other-detail">
              Other details
            </label>
            <Input
              id="other-detail"
              type="text"
              value={locationDetail}
              placeholder="Enter details"
              onChange={(e) => setLocationDetail(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "schedule" ? "Schedule Appointment" : "Reschedule Appointment"}
          </DialogTitle>
          <DialogDescription>
            Fill in the appointment details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          {/* Calendar Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Calendar <span className="text-red-500">*</span></label>
            <select
              className="w-full border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              value={calendar}
              onChange={(e) => setCalendar(e.target.value)}
              required
            >
              <option value="Select" disabled>Select</option>
              {CALENDARS.map((c) => (
                <option value={c.value} key={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1 mt-2">Date</label>
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
                fromDate={new Date()}
              />
            </div>
          </div>
          {/* Time Picker */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1 mt-2">Time</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block ml-2 cursor-help text-xs text-muted-foreground">
                      ?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select a time slot for your appointment.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div
              className={numSlotRows > 3 ? "max-h-[168px] overflow-y-auto border rounded-md p-2" : "flex flex-wrap gap-2"}
              style={numSlotRows > 3 ? { display: "grid", gridTemplateColumns: `repeat(${slotsPerRow}, minmax(72px,1fr))`, gap: "0.5rem" } : {}}
            >
              {date && calendar !== "Select" ? (
                availableSlots.length === 0 ? (
                  <span className="text-xs text-gray-400 py-2 col-span-4">No slots available.</span>
                ) : (
                  availableSlots.map((slot) => (
                    <Button
                      type="button"
                      size="sm"
                      variant={time === slot ? "default" : "outline"}
                      className={time === slot ? "ring-2 ring-primary" : ""}
                      key={slot}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))
                )
              ) : (
                <span className="text-xs text-gray-400 py-2 col-span-4">Pick a calendar and date first.</span>
              )}
            </div>
          </div>
          {/* Attendees Autocomplete */}
          <div>
            <label className="block text-sm font-medium mb-1 mt-2">
              Attendees <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                placeholder="Begin typing to search or add attendee"
                value={attendeeInput}
                onChange={(e) => {
                  setAttendeeInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full"
                maxLength={64}
                aria-label="Search or add attendee"
              />
              {/* Suggestions dropdown */}
              {showSuggestions && attendeeInput.length > 0 && (
                <div className="absolute left-0 z-30 mt-1 w-full bg-white border rounded shadow-md max-h-44 overflow-y-auto">
                  {attendeeSuggestions.length === 0 ? (
                    <div
                      className="px-3 py-2 text-xs text-gray-500 cursor-default select-none"
                      tabIndex={-1}
                    >
                      No matches – press Enter to add "{attendeeInput}"
                    </div>
                  ) : (
                    attendeeSuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="px-3 py-2 cursor-pointer hover:bg-primary/10 select-none"
                        onMouseDown={() => {
                          setAttendees([...attendees, suggestion]);
                          setAttendeeInput("");
                        }}
                      >
                        {suggestion}
                      </div>
                    ))
                  )}
                </div>
              )}
              {/* Add on Enter even if not existing */}
              <input
                type="submit"
                tabIndex={-1}
                hidden
                onClick={(e) => e.preventDefault()}
              />
            </div>
            {/* On Enter: Add to attendees */}
            <div className="flex gap-2 flex-wrap mt-2">
              {attendees.map((name, idx) => (
                <span key={name + idx} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-xs text-blue-900 border border-blue-200">
                  {name}
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-red-500 focus:outline-none"
                    onClick={() =>
                      setAttendees(attendees.filter((n) => n !== name))
                    }
                    aria-label={`Remove ${name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {/* Handler: Add input name if user presses Enter */}
            <input
              type="text"
              style={{ position: "absolute", left: "-10000px" }}
              tabIndex={-1}
              value=""
              onKeyDown={(e: any) => {
                if (
                  e.key === "Enter" &&
                  attendeeInput.trim() &&
                  !attendees.includes(attendeeInput.trim())
                ) {
                  setAttendees([...attendees, attendeeInput.trim()]);
                  setAttendeeInput("");
                  setShowSuggestions(false);
                  e.preventDefault();
                }
              }}
              readOnly
            />
          </div>

          {/* Conditional extra fields for Team/Personal */}
          {needsTeamOrPersonalFields && (
            <div className="space-y-3 bg-muted/50 rounded-md p-2 border mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Meeting title"
                  required={needsTeamOrPersonalFields}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the event..."
                  rows={3}
                  required={needsTeamOrPersonalFields}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocationDetail("");
                  }}
                  required={needsTeamOrPersonalFields}
                >
                  <option value="">Select location...</option>
                  {LOCATIONS.map((loc) => (
                    <option value={loc.value} key={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Location detail: only if location chosen */}
              {location && renderLocationDetailField()}
            </div>
          )}
          <DialogFooter className="mt-3">
            <Button
              type="submit"
              disabled={
                !calendar || calendar === "Select" ||
                !date ||
                !time ||
                attendees.length === 0 ||
                (needsTeamOrPersonalFields &&
                  (!title || !description || !location || !locationDetail))
              }
              className="w-full"
            >
              {mode === "schedule" ? "Schedule Appointment" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
