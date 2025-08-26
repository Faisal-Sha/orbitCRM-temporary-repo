
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityCard } from "./availability/AvailabilityCard";
import { AvailabilityForm } from "./availability/AvailabilityForm";
import { MonthCalendarView } from "./availability/MonthCalendarView";
import { Availability, AvailabilityForm as FormType, DaySlotState } from "./availability/types";
import { DUMMY_AVAILABILITIES, ALL_DAYS } from "./availability/constants";
import { normalizeDays } from "./availability/utils";

const AvailabilityManagement = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>(DUMMY_AVAILABILITIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "month">("list");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [editMonth, setEditMonth] = useState(new Date());
  const [editHolidays, setEditHolidays] = useState<Date[]>([]);
  const [showCreateHolidayModal, setShowCreateHolidayModal] = useState(false);
  const [daySlotState, setDaySlotState] = useState(() =>
    ALL_DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: true, slots: [{ from: "09:00", to: "12:00" }] }
    }), {} as Record<typeof ALL_DAYS[number], DaySlotState>)
  );
  const [monthAvail, setMonthAvail] = useState<{ [key: string]: { enabled: boolean, ranges: string[] } }>({});
  const [listHolidayModal, setListHolidayModal] = useState<{ open: boolean; holidays: string[]; availabilityName: string; index: number }>({ open: false, holidays: [], availabilityName: '', index: -1 });
  const [monthActiveId, setMonthActiveId] = useState<string>(DUMMY_AVAILABILITIES[0]?.id || "");

  const [form, setForm] = useState<FormType>({
    name: "",
    timezone: "America/New_York",
    days: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: []
    },
    holidays: [],
  });

  function resetForm() {
    setForm({
      name: "",
      timezone: "America/New_York",
      days: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: []
      },
      holidays: [],
    });
    setDaySlotState(
      ALL_DAYS.reduce((acc, day) => ({
        ...acc,
        [day]: { enabled: true, slots: [{ from: "09:00", to: "12:00" }] }
      }), {} as Record<typeof ALL_DAYS[number], DaySlotState>)
    );
    setEditHolidays([]);
  }

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const newDays = {} as any;
    ALL_DAYS.forEach(day => {
      newDays[day] = daySlotState[day].enabled
        ? daySlotState[day].slots.filter(slot => slot.from && slot.to)
        : [];
    });
    setAvailabilities([
      ...availabilities,
      {
        ...form,
        id: form.name.trim().toLowerCase().replace(/\s+/g, "-"),
        days: normalizeDays(newDays),
        holidays: [...form.holidays]
      },
    ]);
    setCreating(false);
    resetForm();
  };

  const handleEdit = (avail: Availability) => {
    setEditingId(avail.id);
    setForm({
      name: avail.name,
      timezone: avail.timezone,
      days: normalizeDays(avail.days),
      holidays: [...avail.holidays]
    });
    setDaySlotState(
      ALL_DAYS.reduce((acc, day) => ({
        ...acc,
        [day]: {
          enabled: (avail.days[day] && avail.days[day].length > 0),
          slots: [...(avail.days[day] || [])]
        }
      }), {} as Record<typeof ALL_DAYS[number], DaySlotState>)
    );
    setEditHolidays(
      avail.holidays.map(d => new Date(d))
        .filter(d => !isNaN(d.valueOf()))
    );
  };

  const handleSave = () => {
    const editedDays = {} as any;
    ALL_DAYS.forEach(day => {
      editedDays[day] = daySlotState[day].enabled
        ? daySlotState[day].slots.filter(slot => slot.from && slot.to)
        : [];
    });
    setAvailabilities(
      availabilities.map(a =>
        a.id === editingId
          ? {
              ...form,
              id: editingId!,
              days: normalizeDays(editedDays),
              holidays: [...form.holidays]
            }
          : a
      )
    );
    setEditingId(null);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1200);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAvailabilities(availabilities.filter(a => a.id !== id));
    setDeleteId(null);
  };

  const handleRemoveHoliday = (availabilityIndex: number, holidayIndex: number) => {
    setAvailabilities(avails =>
      avails.map((item, i) =>
        i === availabilityIndex
          ? { ...item, holidays: item.holidays.filter((_, j) => j !== holidayIndex) }
          : item
      )
    );
    setListHolidayModal(modal =>
      ({ ...modal, holidays: modal.holidays.filter((_, i) => i !== holidayIndex) })
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <div className="font-semibold text-xl flex gap-2 items-center">
          <CalendarIcon size={22} className="text-primary" />
          Global Availabilities
        </div>
        <Button size="sm" onClick={() => { resetForm(); setCreating(true); }}>
          <Plus size={15} className="mr-1" />
          New Availability
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Tabs value={activeTab} onValueChange={tab => setActiveTab(tab as any)}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="month">Month View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {showSaved && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded px-4 py-2 shadow-lg z-50 animate-fade-in">
          Changes saved!
        </div>
      )}

      {activeTab === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availabilities.length === 0 ? (
            <div className="text-gray-400 text-center py-8 col-span-2">No availabilities found.</div>
          ) : (
            availabilities.map((avail, aidx) => (
              <AvailabilityCard
                key={avail.id}
                availability={avail}
                index={aidx}
                onEdit={handleEdit}
                onDelete={setDeleteId}
                holidayModal={listHolidayModal}
                setHolidayModal={setListHolidayModal}
                onRemoveHoliday={handleRemoveHoliday}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "month" && (
        <MonthCalendarView
          availabilities={availabilities}
          monthActiveId={monthActiveId}
          setMonthActiveId={setMonthActiveId}
          editMonth={editMonth}
          setEditMonth={setEditMonth}
          monthAvail={monthAvail}
          setMonthAvail={setMonthAvail}
        />
      )}

      <AvailabilityForm
        open={creating || !!editingId}
        onClose={() => {
          setCreating(false);
          setEditingId(null);
        }}
        form={form}
        setForm={setForm}
        daySlotState={daySlotState}
        setDaySlotState={setDaySlotState}
        editHolidays={editHolidays}
        setEditHolidays={setEditHolidays}
        showCreateHolidayModal={showCreateHolidayModal}
        setShowCreateHolidayModal={setShowCreateHolidayModal}
        onSubmit={!!editingId ? handleSave : handleCreate}
        isEditing={!!editingId}
      />

      <Dialog open={!!deleteId} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Availability?</DialogTitle>
          </DialogHeader>
          <div>Delete this global availability schedule? This action cannot be undone.</div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteId!)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilityManagement;
