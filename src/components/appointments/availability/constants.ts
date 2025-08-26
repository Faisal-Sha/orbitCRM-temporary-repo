
import { Day, Availability } from "./types";

export const ALL_DAYS: readonly Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const TIMEZONES = [
  "America/New_York", 
  "America/Los_Angeles", 
  "Europe/London", 
  "Asia/Tokyo", 
  "Australia/Sydney"
];

export const DUMMY_AVAILABILITIES: Availability[] = [
  {
    id: "general",
    name: "General",
    timezone: "America/New_York",
    days: {
      Mon: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }],
      Tue: [{ from: "09:00", to: "17:00" }],
      Wed: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }],
      Thu: [],
      Fri: [{ from: "09:00", to: "13:00" }],
      Sat: [],
      Sun: [],
    },
    holidays: ["2025-07-04", "2025-12-25"]
  },
  {
    id: "personal",
    name: "Personal",
    timezone: "Europe/London",
    days: {
      Mon: [{ from: "17:00", to: "19:00" }],
      Tue: [],
      Wed: [{ from: "17:00", to: "19:00" }],
      Thu: [],
      Fri: [],
      Sat: [{ from: "10:00", to: "13:00" }],
      Sun: [],
    },
    holidays: []
  }
];

export const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4).toString().padStart(2, "0");
  const minute = (i % 4 * 15).toString().padStart(2, "0");
  return `${hour}:${minute}`;
});
