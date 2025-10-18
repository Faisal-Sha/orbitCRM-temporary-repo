import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FormInput, User, ChevronDown, ChevronUp, Users, FileText, StickyNote, Calendar, X } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";
import ScheduleAppointmentModal from "@/components/appointments/ScheduleAppointmentModal";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Import new components
import { TYPE_OPTIONS, DATE_OPTIONS, INITIAL_LOAD, LOAD_MORE_AMOUNT, MAX_APPOINTMENTS } from "./listview/constants";
import { generateAppointments, getIntakeOutcomeBadgeProps, getClientOutcomeBadgeProps } from "./listview/utils";
import { Appointment } from "./listview/types";
import { TypeLabel } from "./listview/components/TypeLabel";
import { GrowthStatusCell } from "./listview/components/GrowthStatusCell";
import { AlertIconWithTooltip } from "./listview/components/AlertIconWithTooltip";
import { EditableCell } from "./listview/components/EditableCell";
import { InlineOutcomeDropdown } from "./listview/components/InlineOutcomeDropdown";

const ListView = () => {
  // Filters, search, appointment expanded state
  const [type, setType] = useState("all");
  const [date, setDate] = useState("today");
  const [search, setSearch] = useState("");
  const [loadAmount, setLoadAmount] = useState(INITIAL_LOAD);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Demo: Track edits to dummy data inline
  const [apptsData, setApptsData] = useState(generateAppointments(MAX_APPOINTMENTS));
  // For UserProfile panel demo
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [userProfileUser, setUserProfileUser] = useState<any>(null);

  // Editing for team/personal
  const [editDetails, setEditDetails] = useState<{ [id: string]: boolean }>({});
  const [pendingEdits, setPendingEdits] = useState<{ [id: string]: { description?: string, location?: string, locationType?: string, locationDetails?: string, attendees?: string[] } }>({});
  // Restore this line for attendee search/autocomplete
  const [attendeeSearch, setAttendeeSearch] = useState<{ [id: string]: string }>({});
  // Add new local state for editing meeting titles per appointment
  const [pendingTitleEdits, setPendingTitleEdits] = useState<{ [id: string]: string }>({});
  // Add state for schedule modal open/close
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // TEAM/PERSONAL cancel confirmation dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelDialogAppt, setCancelDialogAppt] = useState<any | null>(null);

  // Generate, filter, group, and slice dummy appointments
  const groupedAppts = useMemo(() => {
    let raw = apptsData;
    raw = raw.filter(a => (type === "all" ? true : a.type === type) && (search === "" ? true : a.clientFullName?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()) || a.clinicianFullName?.toLowerCase().includes(search.toLowerCase())));
    // Group appointments by groupDate
    const grouped: Record<string, any[]> = {};
    raw.slice(0, loadAmount).forEach(a => {
      if (!grouped[a.groupDateDisplay]) grouped[a.groupDateDisplay] = [];
      grouped[a.groupDateDisplay].push(a);
    });
    return {
      grouped,
      total: raw.length,
      shown: Math.min(loadAmount, raw.length),
      hasMore: raw.length > loadAmount
    };
  }, [type, search, loadAmount, apptsData]);

  // Handlers for expandable rows and inline editing
  function handleExpand(apptId: string) {
    setExpanded(e => ({
      ...e,
      [apptId]: !e[apptId]
    }));
  }
  
  function handleEdit(apptId: string, field: string, newVal: string) {
    setApptsData(appts => appts.map(a => a.id === apptId ? {
      ...a,
      [field]: newVal
    } : a));
  }
  
  function handleEditObj(apptId: string, fields: Partial<any>) {
    setApptsData(appts => appts.map(a => a.id === apptId ? { ...a, ...fields } : a));
  }
  
  function handleCreateNote(apptId: string, note: string) {
    setApptsData(appts => appts.map(a => a.id === apptId ? {
      ...a,
      note
    } : a));
  }
  
  function openUserProfile(appt: any) {
    setUserProfileUser({
      name: appt.clientFullName || appt.clinicianFullName,
      interest: "Client",
      inquiryDate: appt.groupDateDisplay,
      email: appt.email,
      phone: appt.phone
    });
    setUserProfileOpen(true);
  }

  // Functions to open forms in new tabs
  function openAssessmentForm(clientName: string) {
    const url = `/records/assessment-form?client=${encodeURIComponent(clientName)}`;
    window.open(url, '_blank');
  }

  function openProgressNotesForm(clientName: string) {
    const url = `/records/progress-notes-form?client=${encodeURIComponent(clientName)}`;
    window.open(url, '_blank');
  }

  // For attendee add/remove in editing mode
  function handleAddAttendee(apptId: string, name: string) {
    setPendingEdits(pe => {
      const current = pe[apptId]?.attendees || [];
      if (!current.includes(name)) {
        return {
          ...pe,
          [apptId]: { ...pe[apptId], attendees: [...current, name] }
        };
      }
      return pe;
    });
    setAttendeeSearch(as => ({ ...as, [apptId]: "" }));
  }
  
  function handleRemoveAttendee(apptId: string, name: string) {
    setPendingEdits(pe => {
      const current = pe[apptId]?.attendees || [];
      return {
        ...pe,
        [apptId]: { ...pe[apptId], attendees: current.filter((n: string) => n !== name) }
      };
    });
  }
  
  function handleAttendeeSearchChange(apptId: string, value: string) {
    setAttendeeSearch(as => ({ ...as, [apptId]: value }));
  }

  // When Cancel is confirmed in dialog, cancel meeting
  function confirmCancelMeeting(appt: any) {
    handleEdit(appt.id, "description", `${appt.description ?? ""} (Canceled)`);
    setEditDetails(e => ({ ...e, [appt.id]: false }));
    setCancelDialogAppt(null);
    setCancelDialogOpen(false);
  }

  // Render helpers
  function renderNoteIcon(note: string | undefined) {
    if (typeof note === "string" && note.trim() !== "") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-1 inline-flex items-center text-primary" tabIndex={0}>
                <StickyNote className="w-4 h-4" aria-label="Has note" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Has note</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  }

  // --- NEW: Edit & Cancel Icon Action handlers ---
  function handleEditIconClick(appt: any) {
    // For this demo, show a toast or alert; in production, open edit modal/panel.
    alert("Edit action for: " + (appt.clientFullName || appt.id));
  }
  function handleCancelIconClick(appt: any) {
    alert("Cancel action for: " + (appt.clientFullName || appt.id));
  }

  // Add new state for edit mode
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalInitialValues, setEditModalInitialValues] = useState<any | null>(null);

  // Handler to open edit modal
  function openEditModalForAppt(appt: any) {
    setEditModalInitialValues({
      ...appt,
      // Map fields to expected ScheduleAppointmentModal props as needed
      calendar: (appt.type === "intakes" && "Intakes") ||
                (appt.type === "clients" && "Clients") ||
                (appt.type === "team" && "Team") ||
                (appt.type === "personal" && "Personal"),
      // Try to parse date, time, attendees, title etc.
      // These keys are dummy mappings for the modal, real integration would depend on real backend logic
      date: appt.groupDate ? new Date(appt.groupDate) : undefined,
      time: appt.time,
      attendees: appt.attendees || [],
      title: appt.meetingTitle || "",
      description: appt.description || "",
      location: appt.location || "",
      locationDetail:
          appt.location === "Video"
            ? appt.meetingUrl
            : appt.location === "Phone"
              ? appt.phone
              : appt.location === "In-Person"
                ? appt.address
                : appt.location === "Other"
                  ? appt.otherDetails
                  : "",
    });
    setEditModalOpen(true);
  }

  // Handler to open cancel dialog for any appointment
  function openCancelDialog(appt: any) {
    setCancelDialogAppt(appt);
    setCancelDialogOpen(true);
  }

  // ---------- MAIN RENDER ----------
  return (
    <div className="app-card p-4 md:p-6 space-y-6 relative">
      {/* ----- UserProfilePanel demo modal ---- */}
      <UserProfilePanel open={userProfileOpen} onClose={() => setUserProfileOpen(false)} user={userProfileUser} />

      {/* Add the schedule appointment modal */}
      <ScheduleAppointmentModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        mode="schedule"
      />

      {/* Add the edit appointment modal */}
      <ScheduleAppointmentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        mode="reschedule"
        initialValues={editModalInitialValues}
      />

      {/* Cancel confirmation modal for all filter views */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel appointment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelDialogOpen(false)}>
              No, keep
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (cancelDialogAppt) confirmCancelMeeting(cancelDialogAppt);
              }}
            >
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Filters/Search Header --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center sm:items-end">
          <select className="rounded-md border border-gray-200 px-3 py-2 text-sm w-[138px] bg-white focus:ring-2 focus:ring-primary/40" value={type} onChange={e => setType(e.target.value)}>
            {TYPE_OPTIONS.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
          <select className="rounded-md border border-gray-200 px-3 py-2 text-sm w-[152px] bg-white focus:ring-2 focus:ring-primary/40" value={date} onChange={e => setDate(e.target.value)}>
            {DATE_OPTIONS.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
          <Input className="max-w-[220px] text-sm" placeholder="Search appointments" value={search} onChange={e => setSearch(e.target.value)} />
          <span className="ml-2 mt-2 sm:mt-0 text-muted-foreground whitespace-nowrap text-sm">
            {groupedAppts.total} found
          </span>
        </div>
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto shadow"
          onClick={() => setScheduleModalOpen(true)}
        >
          + Create Appointment
        </Button>
      </div>
      {/* ---------- TABLE ----------- */}
      <div className="overflow-x-auto rounded-lg border shadow-sm mt-2">
        {Object.keys(groupedAppts.grouped).length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No appointments found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <tbody>
              {Object.entries(groupedAppts.grouped).map(([dateHeader, appointments], iDate) => (
                <React.Fragment key={dateHeader}>
                  <tr>
                    <td colSpan={20} className="bg-gray-100 text-base px-4 py-3 font-bold border-b text-left rounded-t-lg tracking-wide uppercase text-gray-700 shadow-inner">
                      {dateHeader}
                    </td>
                  </tr>
                  {appointments.map((appt: any, i) => {
                    if (type === "all") {
                      return (
                        <tr key={appt.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap text-xs">{appt.time}</td>
                          <td className="px-2 py-2"><TypeLabel type={appt.type} /></td>
                          <td className="px-2 py-2">{appt.clientFullName || appt.meetingTitle}</td>
                        </tr>
                      );
                    }
                    if (appt.type === "intakes") {
                      // For intakes with time ranges, hide provider name if status is Pending
                      const shouldHideProvider = appt.outcome === "Pending" && appt.isTimeRange;
                      const displayProviderName = shouldHideProvider ? "" : appt.clinicianFullName;
                      
                      return (
                        <React.Fragment key={appt.id}>
                          <tr className="border-b group hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-xs">{appt.time}</td>
                            <td className="px-2 py-2">{appt.service}</td>
                            <td className="px-2 py-2">{appt.clientFullName}</td>
                            <td className="px-2 py-2 text-center"><AlertIconWithTooltip level={appt.alertLevel} /></td>
                            <td className="px-2 py-2">{displayProviderName}</td>
                            <td className="px-2 py-2 flex items-center gap-1">
                              <InlineOutcomeDropdown
                                value={appt.outcome}
                                options={["New Client", "Pending", "Rescheduled", "Cancelled", "No Show", "Not Eligible", "Doubtful", "Unsubscribe"]}
                                onChange={val => handleEdit(appt.id, "outcome", val)}
                                badgeClass={getIntakeOutcomeBadgeProps(appt.outcome).className}
                              />
                              {renderNoteIcon(appt.note)}
                            </td>
                            <td className="pl-2 pr-4 py-2 text-end">
                              <button onClick={() => handleExpand(appt.id)} aria-label={expanded[appt.id] ? "Collapse" : "Expand"} className="p-1 focus:outline-none transition-colors" tabIndex={0}>
                                {expanded[appt.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                          {expanded[appt.id] && (
                            <tr className="bg-gray-50 border-b">
                              <td colSpan={8} className="px-0 py-8">
                                <div className="flex flex-col items-center gap-12 justify-center">
                                  <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left w-full justify-center">
                                    {/* --- ICONS: Edit, UserProfile, Note, Cancel --- */}
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[140px]">
                                      <Mail className="h-5 w-5 text-muted-foreground mx-auto" />
                                      <EditableCell
                                        value={appt.email}
                                        maxLen={64}
                                        onSave={val => handleEdit(appt.id, "email", val)}
                                        className="w-[150px] mx-auto"
                                        type="email"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[130px]">
                                      <Phone className="h-5 w-5 text-muted-foreground mx-auto" />
                                      <EditableCell
                                        value={appt.phone}
                                        maxLen={18}
                                        onSave={val => handleEdit(appt.id, "phone", val)}
                                        className="w-[130px] mx-auto"
                                        type="tel"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[150px]">
                                      <FormInput className="h-5 w-5 text-muted-foreground mx-auto" />
                                      {appt.note === undefined ? (
                                        <span>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs"
                                            onClick={() => handleCreateNote(appt.id, "Type your note here.")}
                                          >
                                            + Add Note
                                          </Button>
                                        </span>
                                      ) : (
                                        <EditableCell
                                          value={appt.note}
                                          maxLen={120}
                                          onSave={val => handleEdit(appt.id, "note", val)}
                                          className="w-[160px] mx-auto"
                                        />
                                      )}
                                    </div>
                                    {/* ICON BUTTON GROUP, ORDER: Edit (Calendar), UserProfile, Note (Assessment), Transcript (for time-range only), Cancel */}
                                    <div className="flex flex-row justify-center items-center gap-4 flex-1 min-w-[85px]">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              type="button"
                                              onClick={() => openEditModalForAppt(appt)}
                                              className="rounded-full p-1 hover:bg-primary/10 focus:outline-none transition"
                                            >
                                              <Calendar className="h-6 w-6 text-primary" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>Edit appointment</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span
                                        className="cursor-pointer rounded-full hover:bg-primary/10 p-1 transition"
                                        title="View profile"
                                        tabIndex={0}
                                        onClick={() => openUserProfile(appt)}
                                        role="button"
                                      >
                                        <User className="h-6 w-6 text-primary" />
                                      </span>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              type="button"
                                              onClick={() => openAssessmentForm(appt.clientFullName)}
                                              className="rounded-full p-1 hover:bg-primary/10 focus:outline-none transition"
                                            >
                                              <StickyNote className="w-6 h-6 text-primary" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>Assessment form</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      {appt.isTimeRange && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                type="button"
                                                onClick={() => {/* No action for now */}}
                                                className="rounded-full p-1 hover:bg-primary/10 focus:outline-none transition"
                                              >
                                                <FileText className="w-6 h-6 text-primary" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Transcript</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      <button
                                        type="button"
                                        title="Cancel appointment"
                                        onClick={() => openCancelDialog(appt)}
                                        className="rounded-full p-1 hover:bg-destructive/10 focus:outline-none transition"
                                      >
                                        <X className="h-6 w-6 text-destructive" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }
                    if (appt.type === "clients") {
                      return (
                        <React.Fragment key={appt.id}>
                          <tr className="border-b group hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-xs">{appt.time}</td>
                            <td className="px-2 py-2">{appt.service}</td>
                            <td className="px-2 py-2">{appt.clientFullName}</td>
                            <td className="px-2 py-2 text-center"><AlertIconWithTooltip level={appt.alertLevel} /></td>
                            <td className="px-2 py-2 text-center"><GrowthStatusCell stage={appt.growthStage} /></td>
                            <td className="px-2 py-2 flex items-center gap-1">
                              <InlineOutcomeDropdown
                                value={appt.outcome}
                                options={["Success", "No Answer", "Rescheduled", "Cancel"]}
                                onChange={val => handleEdit(appt.id, "outcome", val)}
                                badgeClass={getClientOutcomeBadgeProps(appt.outcome).className}
                              />
                              {renderNoteIcon(appt.note)}
                            </td>
                            <td className="pl-2 pr-4 py-2 text-end">
                              <button onClick={() => handleExpand(appt.id)} aria-label={expanded[appt.id] ? "Collapse" : "Expand"} className="p-1 focus:outline-none transition-colors" tabIndex={0}>
                                {expanded[appt.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                          {expanded[appt.id] && (
                            <tr className="bg-gray-50 border-b">
                              <td colSpan={8} className="px-0 py-8">
                                <div className="flex flex-col items-center gap-12 justify-center">
                                  <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left w-full justify-center">
                                    {/* --- ICONS: Edit, UserProfile, Note, Cancel --- */}
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[140px]">
                                      <Mail className="h-5 w-5 text-muted-foreground mx-auto" />
                                      <EditableCell
                                        value={appt.email}
                                        maxLen={64}
                                        onSave={val => handleEdit(appt.id, "email", val)}
                                        className="w-[150px] mx-auto"
                                        type="email"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[130px]">
                                      <Phone className="h-5 w-5 text-muted-foreground mx-auto" />
                                      <EditableCell
                                        value={appt.phone}
                                        maxLen={18}
                                        onSave={val => handleEdit(appt.id, "phone", val)}
                                        className="w-[130px] mx-auto"
                                        type="tel"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-[150px]">
                                      <FormInput className="h-5 w-5 text-muted-foreground mx-auto" />
                                      {appt.note === undefined ? (
                                        <span>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs"
                                            onClick={() => handleCreateNote(appt.id, "Type your note here.")}
                                          >
                                            + Add Note
                                          </Button>
                                        </span>
                                      ) : (
                                        <EditableCell
                                          value={appt.note}
                                          maxLen={120}
                                          onSave={val => handleEdit(appt.id, "note", val)}
                                          className="w-[160px] mx-auto"
                                        />
                                      )}
                                    </div>
                                    {/* ICON BUTTON GROUP, ORDER: Edit (Calendar), UserProfile, Note (Progress Notes), Cancel */}
                                    <div className="flex flex-row justify-center items-center gap-4 flex-1 min-w-[85px]">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              type="button"
                                              onClick={() => openEditModalForAppt(appt)}
                                              className="rounded-full p-1 hover:bg-primary/10 focus:outline-none transition"
                                            >
                                              <Calendar className="h-6 w-6 text-primary" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>Edit appointment</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span
                                        className="cursor-pointer rounded-full hover:bg-primary/10 p-1 transition"
                                        title="View profile"
                                        tabIndex={0}
                                        onClick={() => openUserProfile(appt)}
                                        role="button"
                                      >
                                        <User className="h-6 w-6 text-primary" />
                                      </span>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              type="button"
                                              onClick={() => openProgressNotesForm(appt.clientFullName)}
                                              className="rounded-full p-1 hover:bg-primary/10 focus:outline-none transition"
                                            >
                                              <StickyNote className="w-6 h-6 text-primary" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>Progress note form</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <button
                                        type="button"
                                        title="Cancel appointment"
                                        onClick={() => openCancelDialog(appt)}
                                        className="rounded-full p-1 hover:bg-destructive/10 focus:outline-none transition"
                                      >
                                        <X className="h-6 w-6 text-destructive" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }
                    if (appt.type === "team" || appt.type === "personal") {
                      // Expanded row no longer supports editing; always display readonly details.
                      const titleVal = appt.meetingTitle;
                      const descVal = appt.description;
                      let locTypeVal = appt.location;
                      let locDetailsVal = "";
                      if (appt.location === "Video") locDetailsVal = appt.meetingUrl || "";
                      else if (appt.location === "Phone") locDetailsVal = appt.phone || "";
                      else if (appt.location === "In-Person") locDetailsVal = appt.address || "";
                      else if (appt.location === "Other") locDetailsVal = appt.otherDetails || "";
                      else locDetailsVal = "";

                      const attendeesList = appt.attendees ?? [];

                      return (
                        <React.Fragment key={appt.id}>
                          <tr className="border-b group hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-xs">{appt.time}</td>
                            <td className="px-2 py-2">{appt.meetingTitle}</td>
                            <td className="px-2 py-2 flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground" /><span>{appt.numberOfInvitees}</span></td>
                            <td className="pl-2 pr-4 py-2 text-end">
                              <button onClick={() => handleExpand(appt.id)} aria-label={expanded[appt.id] ? "Collapse" : "Expand"} className="p-1 focus:outline-none transition-colors" tabIndex={0}>
                                {expanded[appt.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                          {expanded[appt.id] && (
                            <tr className="bg-gray-50 border-b">
                              <td colSpan={8} className="px-0 py-8">
                                <div className="flex flex-col items-center md:items-center gap-8">
                                  <div className="flex flex-col gap-4 items-center w-full max-w-3xl px-2">
                                    <div className="flex flex-col md:flex-row flex-wrap gap-8 w-full justify-center mb-2">
                                      <div className="mb-2 flex-1 min-w-[200px]">
                                        <div className="font-bold text-gray-800 mb-1 flex gap-2 items-center">
                                          Title:
                                          <span className="font-medium text-gray-700">{titleVal || <span className="text-muted-foreground">—</span>}</span>
                                        </div>
                                        {descVal && (
                                          <div className="text-sm text-muted-foreground mb-1">
                                            {descVal}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-[200px]">
                                        <div className="font-bold text-gray-800 flex gap-2 items-center mb-1">
                                          Location Type:
                                          <span className="font-medium text-gray-700">{locTypeVal || <span className="text-muted-foreground">—</span>}</span>
                                        </div>
                                        <div className="font-bold text-gray-800 flex gap-2 items-center mb-1">
                                          Location Details:
                                          <span className="font-medium text-gray-700 break-all">
                                            {locDetailsVal
                                              ? <span className="break-all">{(locTypeVal === "Video" && locDetailsVal.startsWith("http")) ? (<a href={locDetailsVal} className="underline text-primary hover:text-primary/80" target="_blank" rel="noopener">{locDetailsVal}</a>) : locDetailsVal}</span>
                                              : <span className="text-muted-foreground">—</span>
                                            }
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-[160px]">
                                        <div className="font-bold text-gray-800 mb-1">
                                          Attendees:
                                        </div>
                                        {attendeesList.length === 0 ? (
                                          <span className="text-muted-foreground">No attendees</span>
                                        ) : (
                                          <div className="flex flex-wrap gap-2">
                                            {attendeesList.map((n: string, idx: number) => (
                                              <span key={n + idx} className="inline-block px-2 py-0.5 rounded bg-muted/50 text-xs text-gray-700">{n}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-center mt-6">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="px-4"
                                        type="button"
                                        onClick={() => openEditModalForAppt(appt)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="px-4"
                                        type="button"
                                        onClick={() => {
                                          setCancelDialogOpen(true);
                                          setCancelDialogAppt(appt);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* --------- LOAD MORE -------- */}
      {groupedAppts.hasMore && <div className="flex justify-center mt-5 mb-2">
          <Button onClick={() => setLoadAmount(a => a + LOAD_MORE_AMOUNT)} size="sm" className="bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300">
            Load More
          </Button>
        </div>}
    </div>
  );
};

export default ListView;
