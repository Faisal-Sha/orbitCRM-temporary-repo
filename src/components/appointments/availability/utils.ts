
import { Day, DaysOfWeek, TimeSlot } from "./types";
import { ALL_DAYS } from "./constants";

export function normalizeDays(raw: Partial<Record<Day, TimeSlot[]>>): DaysOfWeek {
  return {
    Mon: Array.isArray(raw.Mon) ? raw.Mon : [],
    Tue: Array.isArray(raw.Tue) ? raw.Tue : [],
    Wed: Array.isArray(raw.Wed) ? raw.Wed : [],
    Thu: Array.isArray(raw.Thu) ? raw.Thu : [],
    Fri: Array.isArray(raw.Fri) ? raw.Fri : [],
    Sat: Array.isArray(raw.Sat) ? raw.Sat : [],
    Sun: Array.isArray(raw.Sun) ? raw.Sun : [],
  };
}

export function getMonthInfoV2(month: number, year: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const jsFirstDay = new Date(year, month, 1).getDay();
  const firstDay = (jsFirstDay + 6) % 7;
  const jsLastDay = new Date(year, month, daysInMonth).getDay();
  const lastDay = (jsLastDay + 6) % 7;
  return { daysInMonth, firstDay, lastDay };
}
