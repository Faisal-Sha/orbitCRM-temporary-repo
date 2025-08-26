import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";

// Dummy data logic as in ListView/WeekView
const FULL_NAMES = [
  "Emma Johnson", "Liam Thompson", "Olivia Williams", "Noah Brown", "Ava Taylor",
  "Sophia Lee", "Mason White", "Isabella Harris", "Lucas Martin", "Mia Clark",
  "Ethan Garcia", "Charlotte Kim", "Amelia Hall", "Benjamin Scott", "Harper Davis"
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
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate a month of appointments
function genMonthAppointments(month: number, year: number) {
  // Randomly scatter 38 appointments
  let appts: any[] = [];
  for (let i = 1; i <= 38; i++) {
    const type = i % 8 < 2 ? "intakes" : i % 8 < 4 ? "clients" : i % 8 < 6 ? "team" : "personal";
    const calendar = type.charAt(0).toUpperCase() + type.slice(1);
    // Assign a date in current month randomly
    const d = Math.floor(Math.random() * 28) + 1;
    const date = new Date(year, month, d);
    appts.push({
      id: "appt_" + i,
      date,
      time: ((8 + (i % 9)) % 12 + 8) + ":" + (i % 2 === 0 ? "00" : "30"),
      client: FULL_NAMES[i % FULL_NAMES.length],
      clinician: CLINICIAN_NAMES[i % CLINICIAN_NAMES.length],
      service: SERVICES[i % SERVICES.length],
      calendar,
      colorCls: TYPE_COLORS[type],
      type,
    });
  }
  return appts;
}

function getMonthInfo(monthIdx: number, year: number) {
  // Days in the month
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  // Day of week (0=Sunday) the month starts on
  const firstDay = new Date(year, monthIdx, 1).getDay();
  // Day of week (0=Sunday) the month ends on
  const lastDay = new Date(year, monthIdx, daysInMonth).getDay();
  return { daysInMonth, firstDay, lastDay };
}

// Quick Modal (copy from WeekView for visual only)
function EditAppointmentModal({ open, appointment, onClose }) {
  if (!open || !appointment) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative animate-in fade-in" tabIndex={0}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 transition text-xl rounded p-1">&times;</button>
        <h2 className="text-lg font-semibold mb-4">Appointment Actions</h2>
        <div className="mb-4">
          <div className="mb-2">
            <span className={`rounded px-2 py-1 text-xs font-semibold mr-2 ${appointment.colorCls}`}>{appointment.calendar}</span>
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

const MonthView = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const { daysInMonth, firstDay, lastDay } = getMonthInfo(currentMonth, currentYear);

  // All appointments
  const appointments = useMemo(() => genMonthAppointments(currentMonth, currentYear), [currentMonth, currentYear]);
  // Group appts by day
  const apptsByDay: Record<number, any[]> = {};
  appointments.forEach(a => {
    const d = a.date.getDate();
    apptsByDay[d] = apptsByDay[d] || [];
    apptsByDay[d].push(a);
  });

  const gotoPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };
  const gotoNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Modal logic
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editAppt, setEditAppt] = useState<any | null>(null);

  // NEW: Schedule modal
  function handleApptClick(appt: any) {
    setEditAppt({
      ...appt,
      calendar: appt.calendar,
      date: appt.date,
      time: appt.time,
      attendees: [appt.client, appt.clinician], // dummy mapping
      title: appt.calendar === "Team" || appt.calendar === "Personal" ? appt.client : "",
      description: "",
      location: "",
      locationDetail: "",
    });
    setScheduleOpen(true);
  }

  // --- Generate 6 calendar rows (weeks), each with 7 days (fill in blank if outside of month)
  const calendarRows: { dateNum: number | null, outOfMonth: boolean }[][] = [];
  let week: { dateNum: number | null, outOfMonth: boolean }[] = [];
  let day = 1;
  // Fill week blanks before the 1st
  for (let i = 0; i < firstDay; ++i) week.push({ dateNum: null, outOfMonth: true });
  // Fill actual days
  for (let i = 1; i <= daysInMonth; ++i) {
    week.push({ dateNum: i, outOfMonth: false });
    if (week.length === 7) {
      calendarRows.push(week);
      week = [];
    }
  }
  // Fill trailing blanks after last day
  if (week.length > 0) {
    while (week.length < 7) week.push({ dateNum: null, outOfMonth: true });
    calendarRows.push(week);
  }
  // Minimum 5 weeks (optionally 6 for long months)
  while (calendarRows.length < 6) {
    calendarRows.push(Array(7).fill({ dateNum: null, outOfMonth: true }));
  }

  return (
    <div className="app-card flex flex-col gap-6 min-h-[320px]">
      {/* Nav/Action Bar */}
      <div className="flex items-center justify-between gap-6 mb-2">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={gotoPrevMonth}>
            &lt;
          </Button>
          <div className="font-semibold px-2 text-base">
            {new Date(currentYear, currentMonth).toLocaleString(undefined, { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="sm" onClick={gotoNextMonth}>
            &gt;
          </Button>
        </div>
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => setScheduleOpen(true)}
        >
          + Create Appointment
        </Button>
      </div>
      {/* Month Calendar Layout (Responsive) */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[820px]">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className="text-center font-semibold py-2 text-muted-foreground bg-muted rounded-t-md">{d}</div>
          ))}
          {/* Render each week row */}
          {calendarRows.map((weekRow, weekIdx) => (
            weekRow.map((cell, i) => {
              if (cell.outOfMonth) {
                // Render empty cells
                return (
                  <div key={`empty-${weekIdx}-${i}`} className="h-20 bg-transparent"></div>
                );
              }
              const dateNum = cell.dateNum!;
              const appts = apptsByDay[dateNum] || [];
              const todayMark =
                dateNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              return (
                <div
                  key={dateNum + '-' + weekIdx}
                  className={cn(
                    "rounded-md px-1 pb-2 min-h-[90px] bg-white border shadow-sm hover:shadow transition flex flex-col items-stretch",
                    todayMark && "border-primary ring-1 ring-primary/70"
                  )}
                >
                  <div className={cn("font-medium text-xs pt-1 px-1", todayMark && "text-primary")}>{dateNum}</div>
                  {/* Appts list */}
                  <div className="flex flex-col gap-1 pt-1">
                    {appts.length === 0 ? (
                      <span className="text-[11px] text-gray-300 text-center">—</span>
                    ) : (
                      appts.slice(0, 2).map(appt => (
                        <div
                          key={appt.id}
                          className="flex flex-col bg-muted mt-0 px-1 py-0.5 rounded hover:bg-muted/80 cursor-pointer"
                          onClick={() => handleApptClick(appt)}
                        >
                          <span className={cn("rounded px-1 py-0 text-[11px] font-medium mb-0.5 mt-0.5", appt.colorCls)}>
                            {appt.calendar}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{appt.time} {appt.client}</span>
                          <span className="text-[10px] text-gray-400">{appt.service}</span>
                        </div>
                      ))
                    )}
                    {appts.length > 2 && (
                      <span className="text-gray-400 text-xs text-center">+{appts.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })
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
    </div>
  );
};
function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

export default MonthView;

// NOTE: This file is now getting long (~211+ lines); please consider asking me to refactor it into smaller files for maintainability!
