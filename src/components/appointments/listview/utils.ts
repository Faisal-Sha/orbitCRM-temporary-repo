
import { Appointment } from "./types";
import {
  FULL_NAMES, CLINICIAN_NAMES, SERVICES, OUTCOMES_INTAKES, OUTCOMES_CLIENTS,
  MEETING_TITLES, DESC_TEAM, GROWTH_STAGES, TIME_RANGES
} from "./constants";

export function initialsOf(name: string) {
  const parts = name.split(" ");
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name;
}

export function generateAppointments(count: number): Appointment[] {
  const datePool = [
    { date: "2025-06-12", display: "12 June 2025" },
    { date: "2025-06-11", display: "11 June 2025" },
    { date: "2025-06-10", display: "10 June 2025" },
    { date: "2025-06-09", display: "9 June 2025" },
    { date: "2025-06-08", display: "8 June 2025" }
  ];
  
    const attendeesBase = ["Emma Johnson", "Liam Thompson", "Olivia Williams", "Noah Brown", "Sophia Lee"];
    const appointments: Appointment[] = [];
  
  for (let i = 0; i < count; i++) {
    const group = datePool[i % datePool.length];
    const type = i % 10 < 3 ? "intakes" : i % 10 < 6 ? "clients" : i % 10 < 8 ? "team" : "personal";
    let alertLevel: "red" | "yellow" | "grey" = "grey";
    
    if (type === "intakes" || type === "clients") {
      alertLevel = i % 7 === 0 ? "red" : i % 5 === 0 ? "yellow" : "grey";
    }
    
    const firstName = FULL_NAMES[i % FULL_NAMES.length];
    const clientFullName = firstName;
    const clinicianFullName = CLINICIAN_NAMES[i % CLINICIAN_NAMES.length];
    const meetingTitle = type === "team" || type === "personal" ? MEETING_TITLES[(i + 3) % MEETING_TITLES.length] + " " + (i % 3 + 1) : undefined;
    const numInvitees = 2 + i % 3;
    const attendees = attendeesBase.slice(0, numInvitees);
    const note = i % 5 === 0 && type !== "personal" ? "Please bring last session notes for review." : i % 6 === 0 && type === "clients" ? "" : undefined;
    const attendeeNote = type === "intakes" && i % 4 === 0 ? "Looking forward to the session. I have some questions about the treatment plan." : undefined;
    
    const isTimeRange = (type === "intakes" && i % 3 === 0);
    let time;
    if (isTimeRange) {
      time = TIME_RANGES[i % TIME_RANGES.length];
    } else {
      const hr = 9 + i % 7;
      const min = i % 3 === 0 ? "00" : i % 3 === 1 ? "30" : "15";
      const period = hr < 12 ? "AM" : "PM";
      time = `${hr <= 12 ? hr : hr - 12}:${min} ${period}`;
    }
    
    const description = type === "team" || type === "personal" ? DESC_TEAM[(i + 1) % DESC_TEAM.length] : undefined;
    const location = type === "team" || type === "personal" ? ["Main Office", "Zoom", "Conference Room"][i % 3] : undefined;

    appointments.push({
      id: "appt_" + i,
      groupDate: group.date,
      groupDateDisplay: group.display,
      time,
      isTimeRange,
      type: type as any,
      service: SERVICES[(i + 2) % SERVICES.length],
      clientFullName,
      clinicianFullName,
      meetingTitle,
      numberOfInvitees: numInvitees,
      attendees,
      alertLevel,
      note,
      attendeeNote,
      email: `${firstName.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      phone: `+1 (555) 234-${1200 + i}`,
      growthStage: GROWTH_STAGES[i % GROWTH_STAGES.length] as any,
      outcome: type === "intakes" ? OUTCOMES_INTAKES[i % OUTCOMES_INTAKES.length] : type === "clients" ? OUTCOMES_CLIENTS[i % OUTCOMES_CLIENTS.length] : "",
      meetingUrl: type === "team" || type === "personal" ? "https://zoom.us/j/123456789" : "",
      description,
      location: location,
      callLogs: isTimeRange ? [false, false, false] : undefined,
    });
  }
  return appointments;
}

export function getIntakeOutcomeBadgeProps(outcome: string) {
  switch (outcome) {
    case "New Client": return { className: "bg-green-100 text-green-800", label: "New Client" };
    case "Due": return { className: "bg-yellow-100 text-yellow-800", label: "Due" };
    case "No Show": return { className: "bg-gray-200 text-gray-700", label: "No Show" };
    case "Unqualified": return { className: "bg-orange-100 text-orange-800", label: "Unqualified" };
    case "Doubtful": return { className: "bg-pink-100 text-pink-800", label: "Doubtful" };
    case "Remove": return { className: "bg-slate-100 text-slate-800", label: "Remove" };
    default: return { className: "bg-gray-100 text-gray-800", label: outcome || "None" };
  }
}

export function getClientOutcomeBadgeProps(outcome: string) {
  switch (outcome) {
    case "Success": return { className: "bg-green-100 text-green-800", label: "Success" };
    case "No Answer": return { className: "bg-yellow-100 text-yellow-800", label: "No Answer" };
    case "Rescheduled": return { className: "bg-blue-100 text-blue-800", label: "Rescheduled" };
    case "Cancel":
    case "Canceled":
    case "Cancelled": return { className: "bg-red-100 text-red-800", label: "Cancelled" };
    default: return { className: "bg-gray-100 text-gray-800", label: outcome || "None" };
  }
}
