
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarCard } from "./CalendarCard";
import { CalendarSettingsModal } from "./CalendarSettingsModal";
import { INITIAL_CALENDARS, CARD_COLORS, CATEGORY_OPTIONS } from "./constants";

const CalendarManagement = () => {
  const [calendars, setCalendars] = useState(INITIAL_CALENDARS);
  const [showSettingsId, setShowSettingsId] = useState<string | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [showShareEmbedId, setShowShareEmbedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>({});
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  
  // Custom fields state
  const [customFields, setCustomFields] = useState([
    { id: "field0", label: "Email", required: true },
    { id: "field1", label: "Phone", required: false }
  ]);
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState("");
  
  // Meeting location state
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingAddress, setMeetingAddress] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingPhone, setMeetingPhone] = useState("");
  const [meetingOther, setMeetingOther] = useState("");
  
  // Field editing state
  const [editingPhoneFormat, setEditingPhoneFormat] = useState<{ [id: string]: string }>({});
  const [editingFieldType, setEditingFieldType] = useState<{ [id: string]: "text"|"textarea"|"phone" }>({});
  
  // Availability state
  const [calendarAvailability, setCalendarAvailability] = useState(() => {
    const days: any = {};
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(day =>
      days[day] = { enabled: true, ranges: [{ from: "09:00", to: "12:00" }, { from: "13:00", to: "17:00" }] }
    );
    return days;
  });
  
  // Schedule state
  const [scheduleOption, setScheduleOption] = useState("");
  const [dateRange, setDateRange] = useState<{from: Date|null, to: Date|null}>({from: null, to: null});
  const [numUpcomingDays, setNumUpcomingDays] = useState<string>("");
  const [selectedGlobalAvailability, setSelectedGlobalAvailability] = useState("general");
  
  // Confirmation toast
  const [showConfirmation, setShowConfirmation] = useState(false);

  const openSettingsModal = (calendar: any | null) => {
    setActiveSettingsTab("general");
    setShowSettingsId(calendar ? calendar.id : "NEW");
    setEditing(
      calendar
        ? { ...calendar }
        : {
            title: "",
            description: "",
            color: CARD_COLORS[0],
            category: CATEGORY_OPTIONS[0],
            participants: 1,
            type: "1on1",
          }
    );
  };

  const handleSaveSettings = () => {
    if (showSettingsId === "NEW") {
      if (!editing.title?.trim()) return;
      setCalendars([
        ...calendars,
        {
          ...editing,
          id: `${editing.title.trim().toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random()*1000)}`,
        },
      ]);
    } else {
      setCalendars(
        calendars.map(c => c.id === showSettingsId ? { ...c, ...editing } : c)
      );
    }
    setShowSettingsId(null);
    setEditing({});
  };

  const handleToggleCalendar = (id: string) => {
    setCalendars(
      calendars.map(c =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  const handleDeleteCalendar = (id: string) => {
    setCalendars(calendars.filter(c => c.id !== id));
    setShowDeleteId(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Confirmation toast */}
      {showConfirmation && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded px-4 py-2 shadow-lg z-50 animate-fade-in">
          Changes saved!
        </div>
      )}

      {/* New Calendar Button */}
      <div className="flex justify-end items-center mb-4">
        <Button size="sm" onClick={() => openSettingsModal(null)}>
          <Plus className="mr-1" /> New Calendar
        </Button>
      </div>

      {/* Calendar List */}
      <div className="rounded-lg border shadow bg-white p-4 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {calendars.map(c => (
            <CalendarCard
              key={c.id}
              calendar={c}
              onToggle={handleToggleCalendar}
              onEdit={openSettingsModal}
              onDelete={handleDeleteCalendar}
              showDeleteId={showDeleteId}
              setShowDeleteId={setShowDeleteId}
              showShareEmbedId={showShareEmbedId}
              setShowShareEmbedId={setShowShareEmbedId}
            />
          ))}
        </div>
      </div>

      {/* Calendar Settings Modal */}
      <CalendarSettingsModal
        open={!!showSettingsId}
        onClose={() => setShowSettingsId(null)}
        editing={editing}
        setEditing={setEditing}
        onSave={handleSaveSettings}
        isNew={showSettingsId === "NEW"}
        activeTab={activeSettingsTab}
        setActiveTab={setActiveSettingsTab}
        customFields={customFields}
        setCustomFields={setCustomFields}
        newCustomFieldLabel={newCustomFieldLabel}
        setNewCustomFieldLabel={setNewCustomFieldLabel}
        meetingLocation={meetingLocation}
        setMeetingLocation={setMeetingLocation}
        meetingAddress={meetingAddress}
        setMeetingAddress={setMeetingAddress}
        meetingUrl={meetingUrl}
        setMeetingUrl={setMeetingUrl}
        meetingPhone={meetingPhone}
        setMeetingPhone={setMeetingPhone}
        meetingOther={meetingOther}
        setMeetingOther={setMeetingOther}
        editingPhoneFormat={editingPhoneFormat}
        setEditingPhoneFormat={setEditingPhoneFormat}
        editingFieldType={editingFieldType}
        setEditingFieldType={setEditingFieldType}
        calendarAvailability={calendarAvailability}
        setCalendarAvailability={setCalendarAvailability}
        scheduleOption={scheduleOption}
        setScheduleOption={setScheduleOption}
        dateRange={dateRange}
        setDateRange={setDateRange}
        numUpcomingDays={numUpcomingDays}
        setNumUpcomingDays={setNumUpcomingDays}
        selectedGlobalAvailability={selectedGlobalAvailability}
        setSelectedGlobalAvailability={setSelectedGlobalAvailability}
      />
    </div>
  );
};

export default CalendarManagement;
