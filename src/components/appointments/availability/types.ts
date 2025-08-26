
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type TimeSlot = { from: string; to: string };
export type DaysOfWeek = Record<Day, TimeSlot[]>;

export interface Availability {
  id: string;
  name: string;
  timezone: string;
  days: DaysOfWeek;
  holidays: string[];
}

export interface DaySlotState {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface AvailabilityForm {
  name: string;
  timezone: string;
  days: DaysOfWeek;
  holidays: string[];
}
