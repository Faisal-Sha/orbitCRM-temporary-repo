
export const INITIAL_CALENDARS = [
  {
    id: "intakes",
    title: "Intakes",
    description: "Handle new intakes appointments.",
    color: "#7E69AB",
    category: "Work",
    enabled: true,
    participants: 1,
    type: "1on1",
  },
  {
    id: "clients",
    title: "Clients",
    description: "All client follow-ups.",
    color: "#33C3F0",
    category: "Work",
    enabled: true,
    participants: 1,
    type: "1on1",
  },
  {
    id: "team",
    title: "Team",
    description: "Team meetings.",
    color: "#D3E4FD",
    category: "Internal",
    enabled: true,
    participants: 5,
    type: "group",
  },
  {
    id: "personal",
    title: "Personal",
    description: "Personal calendar.",
    color: "#E5DEFF",
    category: "Personal",
    enabled: true,
    participants: 1,
    type: "1on1",
  },
];

export const CATEGORY_OPTIONS = ["Work", "Internal", "Personal"];
export const INTERVAL_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export const CARD_COLORS = [
  "#7E69AB", "#33C3F0", "#E5DEFF", "#F2FCE2",
  "#FEF7CD", "#FEC6A1", "#D3E4FD", "#E5DEFF", "#FFDEE2"
];

export const MEETING_LOCATIONS = [
  { label: "Video", value: "video" },
  { label: "Phone", value: "phone" },
  { label: "In-person", value: "in_person" },
  { label: "Other", value: "other" },
];

export const DUMMY_PHONE_FORMATS = [
  { label: "(123) 456-7890", value: "us" },
  { label: "+44 7911 123456", value: "uk" },
  { label: "+91 98765 43210", value: "in" },
  { label: "+61 491 570 156", value: "au" },
];

export const AVAILABILITY_SCHEDULES = [
  { id: "general", label: "General Availability" },
  { id: "personal", label: "Personal Availability" },
  { id: "extended", label: "Extended Hours" },
  { id: "limited", label: "Limited Days Off" },
  { id: "custom", label: "Custom Availability" }
];

export const PRESET_TIME_RANGES = [
  "09:00 AM - 12:00 PM",
  "01:00 PM - 05:00 PM",
  "06:00 PM - 08:00 PM",
  "All Day"
];

export function padTime(num: number) {
  return String(num).padStart(2, "0");
}

export function defaultTime() {
  return { from: "09:00", to: "12:00" };
}
