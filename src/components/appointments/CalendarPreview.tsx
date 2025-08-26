
import React, { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dummy calendar & settings (simulates Calendar Settings fields)
const DUMMY_SETTINGS = {
  title: "Sales Call",
  description:
    "Please find a time that works best for you to learn more about our product.",
  durationMin: 30,
  conferencing: true,
  fields: [
    { id: "name", label: "Name", enabled: true, type: "text", required: true },
    { id: "email", label: "Email", enabled: true, type: "email", required: true },
    { id: "phone", label: "Phone", enabled: false, type: "tel", required: false },
    { id: "notes", label: "Notes", enabled: true, type: "textarea", required: false },
  ],
  timezone: "Eastern Time - US & Canada",
  profileImg:
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
  profileName: "Nkem Nwankwo"
};

// Dummy availability: 3 slots per working day for next 21 days
const createAvailability = () => {
  const avail = {};
  for (let i = 0; i < 21; i++) {
    const date = addDays(new Date(), i);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends
    const key = format(date, "yyyy-MM-dd");
    avail[key] = [
      "13:00",
      "16:00",
      "16:30"
    ];
  }
  return avail;
};
const AVAILABILITY = createAvailability();

export default function CalendarPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const availableDatesArr = useMemo(() => Object.keys(AVAILABILITY).map((dayStr) => new Date(dayStr)), []);
  const activeFields = useMemo(() => DUMMY_SETTINGS.fields.filter((f) => f.enabled), []);

  // New layout with reduced vertical spacing, clear separations, modern style
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-1">
      <div
        className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl bg-white/95 rounded-2xl border border-blue-100 overflow-hidden"
      >
        {/* LEFT: Profile and meeting info, compacted */}
        <div className="bg-gradient-to-tr from-blue-100/80 via-blue-50 to-blue-100 p-5 flex flex-col border-r border-blue-100">
          <div className="flex gap-2 items-center mb-3">
            <img
              src={DUMMY_SETTINGS.profileImg}
              alt={DUMMY_SETTINGS.profileName}
              className="rounded-full h-10 w-10 object-cover border-2 border-blue-200 shadow"
            />
            <div>
              <div className="text-base font-bold text-blue-900">{DUMMY_SETTINGS.profileName}</div>
              <div className="text-lg font-semibold leading-5 text-blue-800">{DUMMY_SETTINGS.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-800 mb-1">
            <Clock size={16} className="opacity-70" />
            <span>{DUMMY_SETTINGS.durationMin} min</span>
          </div>
          {DUMMY_SETTINGS.conferencing && (
            <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
              <Video size={13} className="opacity-80" />
              <span>Web conferencing upon confirmation.</span>
            </div>
          )}
          <div className="text-gray-700 text-xs mb-2">{DUMMY_SETTINGS.description}</div>
          <div className="flex-1"></div>
          <div className="text-xs text-blue-700/80 font-medium flex items-center gap-1 pt-2 border-t border-blue-100 mt-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>
              {DUMMY_SETTINGS.timezone}
              <span className="ml-1 text-gray-400">({format(new Date(), "p")})</span>
            </span>
          </div>
        </div>

        {/* RIGHT: Calendar + times + form + confirmation */}
        <div className="flex flex-col min-h-[420px] bg-white p-5">
          <div className="font-semibold text-xl text-blue-900 mb-3">Book your meeting</div>
          {/* Calendar at top (visually boxed) */}
          {!showForm && !confirmation && (
            <div className="flex flex-col gap-2">
              <div className="rounded-xl border border-blue-100 bg-white shadow-sm px-2 pt-2 pb-3 w-full mb-2">
                <ShadcnCalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => {
                    setSelectedDate(date!);
                    setSelectedTime(null);
                  }}
                  className="p-3 pointer-events-auto rounded-xl"
                  modifiers={{ available: availableDatesArr }}
                  modifiersClassNames={{
                    available: "text-blue-800 bg-blue-100 font-semibold"
                  }}
                  disabled={date =>
                    !AVAILABILITY[format(date, "yyyy-MM-dd")]
                  }
                />
              </div>
              {/* Time slots below Calendar */}
              <div className="mt-1 w-full">
                {selectedDate ? (
                  <>
                    <div className="mb-1 text-sm text-gray-700 font-semibold text-center">
                      {format(selectedDate, "PPPP")}
                    </div>
                    <div className="flex flex-row gap-2 justify-center mb-1">
                      {AVAILABILITY[format(selectedDate, "yyyy-MM-dd")]?.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          className={`
                            min-w-[90px] py-2 px-3 text-base
                            ${selectedTime === slot ?
                              "bg-blue-700 text-white border-blue-700 shadow" :
                              "border-blue-200 text-blue-800 bg-white hover:bg-blue-50"}
                            animate-fade-in
                          `}
                          onClick={() => {
                            setSelectedTime(slot);
                            setShowForm(true);
                          }}
                        >
                          {format(
                            new Date(`2000-01-01T${slot}`),
                            "h:mmaaa"
                          ).replace("AM", "am").replace("PM", "pm")}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-center text-[15px] pb-2">Select a date to view time slots</div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          {showForm && !confirmation && (
            <form
              className="flex flex-col gap-3 mt-2 rounded-xl border border-blue-100 bg-blue-50/90 shadow px-5 py-5 animate-fade-in"
              onSubmit={e => {
                e.preventDefault();
                setConfirmation(true);
              }}
            >
              <div className="mb-0.5 text-center">
                <div className="font-semibold text-blue-800">
                  {format(selectedDate!, "PPPP")} &middot; {format(new Date(`2000-01-01T${selectedTime}`), "h:mmaaa").replace("AM", "am").replace("PM", "pm")}
                </div>
              </div>
              {/* No tooltips, only labels */}
              <div className="flex flex-col gap-3">
                {activeFields.map(field => (
                  <div key={field.id} className="flex flex-col gap-0.5">
                    <Label htmlFor={field.id} className={field.required ? "font-medium" : ""}>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200 shadow-sm resize-none text-sm"
                        required={field.required}
                        value={formValues[field.id] || ""}
                        rows={3}
                        onChange={e => setFormValues(v => ({ ...v, [field.id]: e.target.value }))}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        required={field.required}
                        className="bg-white border border-blue-200 rounded-lg focus:ring-blue-200 focus:border-blue-400 shadow-sm text-sm"
                        value={formValues[field.id] || ""}
                        onChange={e => setFormValues(v => ({ ...v, [field.id]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                className="w-full mt-2 text-base py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition font-semibold shadow"
              >
                Book Appointment
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full rounded-lg"
                onClick={() => {
                  setShowForm(false);
                  setSelectedTime(null);
                }}
              >
                Back
              </Button>
            </form>
          )}

          {/* Confirmation: clean, big, just Thank You */}
          {confirmation && (
            <div className="flex flex-col items-center justify-center h-full py-16 animate-scale-in bg-blue-50/80 rounded-xl border border-blue-200 shadow mt-7">
              <div className="text-green-600 text-3xl font-extrabold mb-4">Thank You!</div>
              <div className="text-blue-900 text-lg font-semibold mb-2">
                Your appointment is confirmed.
              </div>
              <div className="mb-1 text-gray-700 text-center">
                <span className="font-semibold">{DUMMY_SETTINGS.title}</span> <br />
                {format(selectedDate!, "PPPP")}<br />
                <span className="text-base">{format(new Date(`2000-01-01T${selectedTime}`), "h:mmaaa").replace("AM", "am").replace("PM", "pm")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
