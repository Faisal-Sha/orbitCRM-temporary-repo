
import { FilterOptions } from "./types";

export const TYPE_OPTIONS: FilterOptions[] = [
  { value: "intakes", label: "Intakes" },
  { value: "clients", label: "Clients" },
  { value: "team", label: "Team" },
  { value: "personal", label: "Personal" },
  { value: "all", label: "All" }
];

export const DATE_OPTIONS: FilterOptions[] = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "canceled", label: "Canceled" }
];

export const FULL_NAMES = [
  "Emma Johnson", "Liam Thompson", "Olivia Williams", "Noah Brown", "Ava Taylor",
  "Sophia Lee", "Mason White", "Isabella Harris", "Lucas Martin", "Mia Clark",
  "Ethan Garcia", "Charlotte Kim", "Amelia Hall", "Benjamin Scott", "Harper Davis",
  "Elijah Adams", "Ella Lewis", "Jack Walker", "Grace Young", "Henry Allen",
  "Emily King", "Jackson Wright", "Scarlett Moore", "Sebastian Baker", "Chloe Turner",
  "Alexander Wood", "Penelope Davis", "Logan Evans", "Layla Nelson", "Carter Parker"
];

export const CLINICIAN_NAMES = ["Dr. Susan Miller", "Dr. Kevin Rivera", "Dr. Angela Nguyen"];
export const SERVICES = ["Counseling", "Therapy", "SUD", "Family Session", "Assessment", "Psychiatric Consult", "Career Coaching", "Couples Therapy"];
export const OUTCOMES_INTAKES = ["Due", "No Show", "New Client", "Unqualified", "Doubtful", "Remove"];
export const OUTCOMES_CLIENTS = ["Due", "Success", "No Show"];
export const MEETING_TITLES = ["Project Kickoff", "Team Sync", "Staff Check-in", "Planning Meeting", "Strategy Review", "Quarterly Review", "Wellness Session", "Quarterly Update"];
export const DESC_TEAM = ["Weekly status review & blockers discussion.", "Brainstorming for upcoming client project.", "Share new protocols with team.", "Project launch - next steps."];
export const GROWTH_STAGES = ["foundation", "developing", "established"];
export const TIME_RANGES = ["9 AM – 12 PM", "1 PM – 4 PM", "2 PM – 5 PM", "10 AM – 1 PM", "3 PM – 6 PM"];

export const ALL_ATTENDEE_NAMES = [
  ...FULL_NAMES,
  "Sophia Lee", "Benjamin Scott", "Elijah Adams", "Ella Lewis", "Jack Walker",
  "Grace Young", "Henry Allen", "Emily King"
];

export const INITIAL_LOAD = 20;
export const LOAD_MORE_AMOUNT = 15;
export const MAX_APPOINTMENTS = 64;
