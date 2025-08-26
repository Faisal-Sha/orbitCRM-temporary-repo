import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";

// Data mirrors ListView structure for full compatibility
const FULL_NAMES = [
  "Emma Johnson", "Liam Thompson", "Olivia Williams", "Noah Brown", "Ava Taylor",
  "Sophia Lee", "Mason White", "Isabella Harris", "Lucas Martin", "Mia Clark",
  "Ethan Garcia", "Charlotte Kim", "Amelia Hall", "Benjamin Scott", "Harper Davis",
  "Elijah Adams", "Ella Lewis", "Jack Walker", "Grace Young", "Henry Allen",
  "Emily King", "Jackson Wright", "Scarlett Moore", "Sebastian Baker", "Chloe Turner",
  "Alexander Wood", "Penelope Davis", "Logan Evans", "Layla Nelson", "Carter Parker"
];
const CLINICIAN_NAMES = [
  "Dr. Susan Miller", "Dr. Kevin Rivera", "Dr. Angela Nguyen"
];
const SERVICES = [
  "Counseling", "Therapy", "SUD", "Family Session", "Assessment",
  "Psychiatric Consult", "Career Coaching", "Couples Therapy"
];
const TYPE_COLORS: Record<string, string> = {
  intakes: "bg-green-100 text-green-700",
  clients: "bg-blue-100 text-blue-700",
  team: "bg-purple-100 text-purple-700",
  personal: "bg-pink-100 text-pink-700"
};
const TYPE_LABELS: Record<string, string> = {
  intakes: "Intake",
  clients: "Client",
  team: "Team",
  personal: "Personal",
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function genWeeklyAppointments(weekOffset: number = 0) {
  // Calculate current week (Sunday to Saturday)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  // 22 realistic appointments, randomly spread
  const appts: any[] = [];
  for (let i = 0; i < 22; i++) {
    const dayIdx = i % 7;
    const dt = new Date(startOfWeek);
    dt.setDate(dt.getDate() + dayIdx);
    const type = i % 8 < 2 ? "intakes" : i % 8 < 4 ? "clients" : i % 8 < 6 ? "team" : "personal";
    const calendar = TYPE_LABELS[type];
    const hr = 9 + ((i * 3) % 8);
    const min = [0, 15, 30, 45][i % 4];
    appts.push({
      id: "appt_" + i + "_" + weekOffset,
      date: new Date(dt),
      day: dt.getDay(),
      time: `${hr}:${min === 0 ? "00" : min}`,
      client: FULL_NAMES[i % FULL_NAMES.length],
      clinician: CLINICIAN_NAMES[i % CLINICIAN_NAMES.length],
      service: SERVICES[i % SERVICES.length],
      calendar,
      colorCls: TYPE_COLORS[type],
      type,
      label: calendar,
    });
  }
  return appts;
}

// -- Quick Modal Implementation for demonstration (no database) --
function EditAppointmentModal({ open, appointment, onClose }) {
  if (!open || !appointment) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative animate-in fade-in" tabIndex={0}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 transition text-xl rounded p-1">&times;</button>
        <h2 className="text-lg font-semibold mb-4">Appointment Actions</h2>
        <div className="mb-4">
          <div className="mb-2">
            <span className={`rounded px-2 py-1 text-xs font-semibold mr-2 ${appointment.colorCls}`}>{appointment.label}</span>
            <span className="text-xs font-mono text-muted-foreground">{appointment.time}, {appointment.client}</span>
          </div>
          <div className="text-sm font-medium truncate mb-1">{appointment.service}</div>
          <div className="text-xs text-gray-400">{appointment.clinician}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="default" className="w-full" onClick={() => alert('Edit (demo only)')}>
            Edit Appointment
          </Button>
          <Button variant="outline" className="w-full" onClick={() => alert('Reschedule (demo only)')}>
            Reschedule
          </Button>
          <Button variant="destructive" className="w-full" onClick={() => alert('Cancel (demo only)')}>
            Cancel Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}

const WeekView = () => {
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = this week
  const appointments = useMemo(() => genWeeklyAppointments(currentWeek), [currentWeek]);
  // Map appointments by weekday index
  const apptsByDay: Record<number, any[]> = {};
  appointments.forEach(a => {
    apptsByDay[a.day] = apptsByDay[a.day] || [];
    apptsByDay[a.day].push(a);
  });

  // Compute week range label
  const refDate = new Date();
  refDate.setDate(refDate.getDate() - refDate.getDay() + currentWeek * 7);
  const weekStart = new Date(refDate);
  const weekEnd = new Date(refDate);
  weekEnd.setDate(weekStart.getDate() + 6);

  function formatHeaderRange() {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return (
      weekStart.toLocaleDateString(undefined, options) +
      " — " +
      weekEnd.toLocaleDateString(undefined, options)
    );
  }

  // Modal control
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editAppt, setEditAppt] = useState<any | null>(null);

  // When appointment cell is clicked:
  function handleApptClick(appt: any) {
    setEditAppt({
      ...appt,
      calendar: appt.label,
      date: appt.date,
      time: appt.time,
      attendees: [appt.client, appt.clinician], // dummy mapping
      title: appt.label === "Team" || appt.label === "Personal" ? appt.client : "",
      description: "", // you can map real value if present
      location: "",
      locationDetail: "",
    });
    setScheduleOpen(true);
  }

  return (
    <div className="app-card flex flex-col gap-6 w-full min-h-[350px] animate-fade-in">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous week"
            onClick={() => setCurrentWeek((w) => w - 1)}
            className="rounded-full p-0 w-8 h-8 border-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="font-semibold px-3 text-base">
            {formatHeaderRange()}
          </div>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next week"
            onClick={() => setCurrentWeek((w) => w + 1)}
            className="rounded-full p-0 w-8 h-8 border-muted"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 rounded px-4 py-2 shadow"
          onClick={() => setScheduleOpen(true)}
        >
          + Create Appointment
        </Button>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto fade-in">
        <div className="grid grid-cols-7 gap-4 bg-muted/50 rounded-lg min-w-[900px]">
          {WEEKDAYS.map((day, idx) => (
            <div
              key={day}
              className="flex flex-col min-h-[265px] max-h-none bg-background rounded-lg border shadow-sm overflow-visible"
            >
              {/* Day Header */}
              <div className="bg-muted px-3 py-2 flex flex-col items-center border-b">
                <span className="font-semibold text-sm text-muted-foreground">{day}</span>
                <span className="text-xs mt-0.5 text-gray-400">
                  {(() => {
                    const d = new Date(weekStart);
                    d.setDate(weekStart.getDate() + idx);
                    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                  })()}
                </span>
              </div>
              {/* Appointments */}
              <div className="flex-1 flex flex-col gap-2 px-2 py-3 overflow-visible">
                {apptsByDay[idx] && apptsByDay[idx].length > 0 ? (
                  apptsByDay[idx].map((appt) => (
                    <div key={appt.id}
                      className="flex flex-col gap-1 bg-white border rounded px-2 py-2 shadow-[0_2px_10px_-5px_rgba(20,40,120,0.1)] transition hover:shadow-md hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleApptClick(appt)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${appt.colorCls} rounded px-2 py-0.5 text-xs font-semibold`}>
                          {appt.label}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">{appt.time}</span>
                      </div>
                      <div className="text-sm font-medium truncate">{appt.client}</div>
                      <div className="text-[12px] text-muted-foreground truncate">{appt.service}</div>
                      <div className="text-[11px] text-gray-400 truncate">{appt.clinician}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center text-gray-300 mt-8">No appointments</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Remove old EditAppointmentModal */}
      {/* Add ScheduleAppointmentModal for editing */}
      <ScheduleAppointmentModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        mode="reschedule"
        initialValues={editAppt}
      />
      {/* Also keep the Create Appointment button/modal as before (for new appointments) */}
    </div>
  );
};

export default WeekView;

// NOTE: This file is now getting long (~225+ lines); please consider asking me to refactor it into smaller files for maintainability!
