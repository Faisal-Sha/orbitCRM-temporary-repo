import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FormInput, User, ChevronDown, ChevronUp, Users, FileText, StickyNote, Calendar, X, Video } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAppointments } from "@/hooks/useAppointments";
import { useAppointmentNotes } from "@/hooks/useAppointmentNotes";
import { useAppointmentOutcomes } from "@/hooks/useAppointmentOutcomes";

const ListView = () => {
  // Filters, search, appointment expanded state
  const [type, setType] = useState("intakes");
  const [date, setDate] = useState("today");
  const [search, setSearch] = useState("");
  const [loadAmount, setLoadAmount] = useState(INITIAL_LOAD);

// Helper function to determine if appointment notes should be editable
const isNoteEditable = (appt: any, currentDateFilter: string) => {
  // Canceled appointments are never editable (show cancellation reason instead)
  if (appt.outcome === "Canceled") {
    return false;
  }
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  
  // Editable for today and future appointments (not past)
  return appt.startMs >= todayStart;
};

// Helper function to determine if appointment outcomes should be editable
const isOutcomeEditable = (appt: any) => {
  // Canceled appointments are never editable
  if (appt.outcome === "Canceled") {
    return false;
  }
  
  const now = new Date();
  const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() - 1;
  
  // Disable outcomes for appointments that are yesterday or older
  return appt.startMs > yesterdayEnd;
};

// Helper function to determine if Assessment/Cancel actions should be hidden
const shouldHideEditActions = (appt: any) => {
  // Hide for canceled appointments
  if (appt.outcome === "Canceled") {
    return true;
  }
  
  // Hide for past appointments (yesterday and older)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  return appt.startMs < todayStart;
};

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  // Mock data for Team/Personal/All views
  const [mockApptsData, setMockApptsData] = useState(generateAppointments(MAX_APPOINTMENTS));
  
  // Get current user's person_id for mutations
  const { data: currentPersonId } = useQuery({
    queryKey: ['currentPersonId'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('current_user_person_id');
      if (error) throw error;
      return data;
    }
  });

  // Fetch from Supabase for intakes/clients only
  const shouldFetchFromSupabase = type === 'intakes' || type === 'clients';
  const { data: supabaseAppts, isLoading } = useAppointments({
    appointmentType: type === 'intakes' ? 'Lead' : 'Client',
    enabled: shouldFetchFromSupabase
  });

  // Use Supabase data for intakes/clients, mock data for others
  const apptsData = shouldFetchFromSupabase ? (supabaseAppts || []) : mockApptsData;

  // Get mutation functions
  const { updateNote, updateCallLog } = useAppointmentNotes();
  const { logOutcome } = useAppointmentOutcomes();
  
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
    const nowMs = Date.now();
    
    let raw = apptsData;
    
    // Filter by type and search
    raw = raw.filter(a => 
      (type === "all" ? true : a.type === type) && 
      (search === "" ? true : 
        a.clientFullName?.toLowerCase().includes(search.toLowerCase()) || 
        a.email?.toLowerCase().includes(search.toLowerCase()) || 
        a.clinicianFullName?.toLowerCase().includes(search.toLowerCase())
      )
    );
    
    // Filter by date range
    raw = raw.filter(a => {
      switch (date) {
        case "today":
          // Show all events for today (past and upcoming), exclude canceled
          return a.startMs >= todayStart && 
                 a.startMs <= todayEnd && 
                 a.outcome !== "Canceled";
        
        case "upcoming":
          // Show events after today, exclude canceled
          return a.startMs > todayEnd && a.outcome !== "Canceled";
        
        case "past":
          // Show events before now (including earlier today), exclude canceled
          return a.startMs < nowMs && a.outcome !== "Canceled";
        
        case "canceled":
          // Show only canceled events (all dates)
          return a.outcome === "Canceled";
        
        default:
          return true;
      }
    });
    
    // Group appointments by groupDateDisplay
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
  }, [type, date, search, loadAmount, apptsData]);

  // Handlers for expandable rows and inline editing
  function handleExpand(apptId: string) {
    // Close all other expanded appointments
    const isCurrentlyExpanded = expanded[apptId];
    if (!isCurrentlyExpanded) {
      setExpanded({ [apptId]: true });
    } else {
      setExpanded({ [apptId]: false });
    }
  }
  
  function handleEdit(apptId: string, field: string, newVal: string) {
    if (shouldFetchFromSupabase && field === 'outcome' && currentPersonId) {
      // Log outcome to Supabase for intakes/clients
      logOutcome({
        appointmentId: apptId,
        personId: currentPersonId,
        outcome: newVal
      });
    } else {
      // Mock data update for other views
      setMockApptsData(appts => appts.map(a => a.id === apptId ? {
        ...a,
        [field]: newVal
      } : a));
    }
  }
  
  function handleEditObj(apptId: string, fields: Partial<any>) {
    setMockApptsData(appts => appts.map(a => a.id === apptId ? { ...a, ...fields } : a));
  }
  
  function handleCreateNote(apptId: string, note: string) {
    if (shouldFetchFromSupabase && currentPersonId) {
      updateNote({
        appointmentId: apptId,
        personId: currentPersonId,
        note: note
      });
    } else {
      setMockApptsData(appts => appts.map(a => a.id === apptId ? {
        ...a,
        note
      } : a));
    }
  }

  function handleCallLogToggle(apptId: string, callIndex: number) {
    if (shouldFetchFromSupabase && currentPersonId) {
      // Update call log in Supabase for intakes/clients
      const appt = apptsData.find(a => a.id === apptId);
      const currentValue = appt?.callLogs?.[callIndex];
      
      updateCallLog({
        appointmentId: apptId,
        personId: currentPersonId,
        logNumber: (callIndex + 1) as 1 | 2 | 3,
        checked: !currentValue
      });
    } else {
      // Mock data update for other views
      setMockApptsData(appts => appts.map(a => {
        if (a.id === apptId && a.callLogs) {
          const newCallLogs = [...a.callLogs];
          newCallLogs[callIndex] = !newCallLogs[callIndex];
          return { ...a, callLogs: newCallLogs };
        }
        return a;
      }));
    }
  }

  // State for inline note editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState<string>("");

  function startNoteEdit(apptId: string, currentNote: string) {
    setEditingNoteId(apptId);
    setEditingNoteValue(currentNote);
  }

  function saveNoteEdit(apptId: string) {
    if (shouldFetchFromSupabase && currentPersonId) {
      // Save note to Supabase for intakes/clients
      updateNote({
        appointmentId: apptId,
        personId: currentPersonId,
        note: editingNoteValue.trim() || null
      });
    } else {
      // Mock data update for other views
      if (editingNoteValue.trim() === "") {
        handleEdit(apptId, "note", undefined as any);
      } else {
        handleEdit(apptId, "note", editingNoteValue);
      }
    }
    setEditingNoteId(null);
    setEditingNoteValue("");
  }

  function cancelNoteEdit() {
    setEditingNoteId(null);
    setEditingNoteValue("");
  }
  
  function openUserProfile(appt: any) {
    setUserProfileUser({
      person_id: appt.attendeeId || '',
      name: appt.clientFullName || appt.clinicianFullName,
      interest: "Client",
      inquiryDate: appt.groupDateDisplay,
      email: appt.email,
      phone: appt.phone
    });
    setUserProfileOpen(true);
  }

  // Functions to open forms in new tabs
  function openAssessmentForm(clientName: string, attendeeId?: string) {
    const url = `/records/assessment-form?client=${encodeURIComponent(clientName)}${attendeeId ? `&personId=${attendeeId}` : ''}`;
    window.open(url, '_blank');
  }

  function openProgressNotesForm(clientName: string, attendeeId?: string) {
    const url = `/records/progress-notes-form?client=${encodeURIComponent(clientName)}${attendeeId ? `&personId=${attendeeId}` : ''}`;
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

  // Render helpers - Simple note icon without tooltip
  function renderNoteIcon(note: string | undefined) {
    if (typeof note === "string" && note.trim() !== "") {
      return <FileText className="h-3.5 w-3.5 text-blue-600" />;
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
                      // Calculate call count for display
                      const callCount = appt.callLogs ? appt.callLogs.filter(Boolean).length : 0;
                      const displayProviderName = callCount > 0 
                        ? `${appt.clinicianFullName} (${callCount})`
                        : appt.clinicianFullName;
                      
                      return (
                        <React.Fragment key={appt.id}>
                          <tr className="border-b group hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-xs">{appt.time}</td>
                            <td className="px-2 py-2">{appt.service}</td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                {appt.clientFullName}
                                {appt.attendeeNote && (
                                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center"><AlertIconWithTooltip level={appt.alertLevel} /></td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                {displayProviderName}
                                {appt.note && (
                                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2">
                        <InlineOutcomeDropdown
                          value={appt.outcome}
                          options={["Due", "No Show", "New Client", "Unqualified", "Doubtful", "Remove"]}
                          onChange={val => handleEdit(appt.id, "outcome", val)}
                          badgeClass={getIntakeOutcomeBadgeProps(appt.outcome).className}
                          getBadgeProps={getIntakeOutcomeBadgeProps}
                          disabled={!isOutcomeEditable(appt)}
                        />
                            </td>
                            <td className="pl-2 pr-4 py-2 text-end">
                              <button onClick={() => handleExpand(appt.id)} aria-label={expanded[appt.id] ? "Collapse" : "Expand"} className="p-1 focus:outline-none transition-colors" tabIndex={0}>
                                {expanded[appt.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                          {expanded[appt.id] && (
                            <tr className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-b">
                              <td colSpan={8} className="px-6 py-6">
                                <div className="max-w-4xl mx-auto">
                                  {/* Contact Information Section */}
                                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                          <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <label className="text-xs text-muted-foreground block mb-1">Email</label>
                                          <p className="text-sm text-gray-900">{appt.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                          <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                                          <p className="text-sm text-gray-900">{appt.phone}</p>
                                        </div>
                                      </div>
                                      
                                      {/* Meeting URL */}
                                      {appt.meetingUrl && (
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            <Video className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <label className="text-xs text-muted-foreground block mb-1">Meeting URL</label>
                                            <a
                                              href={appt.meetingUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                              {appt.meetingUrl}
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                          <StickyNote className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <label className="text-xs text-muted-foreground block mb-1">Attendee Note</label>
                                          {appt.attendeeNote ? (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <p className="text-sm text-gray-900 truncate cursor-default">
                                                    {appt.attendeeNote.length > 50 ? `${appt.attendeeNote.substring(0, 50)}...` : appt.attendeeNote}
                                                  </p>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                                                  {appt.attendeeNote}
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          ) : (
                                            <p className="text-sm text-muted-foreground italic">No note</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Reschedule Reasons */}
                                      {appt.rescheduleReasons && appt.rescheduleReasons.length > 0 && (
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            <Calendar className="h-4 w-4 text-amber-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <label className="text-xs text-muted-foreground block mb-1">
                                              Reschedule Reasons
                                            </label>
                                            <div className="space-y-2">
                                              {appt.rescheduleReasons.map((reason, index) => (
                                                <div key={index} className="text-sm text-gray-900 p-2 bg-amber-50 border border-amber-200 rounded">
                                                  <span className="font-medium text-amber-700">#{index + 1}:</span> {reason}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <StickyNote className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground block mb-1">
                      {appt.outcome === "Canceled" ? "Cancellation Reason" : "Assessor Note"}
                    </label>
                    
                    {appt.outcome === "Canceled" ? (
                      // Display cancellation reason (non-editable)
                      appt.cancellationReason ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-gray-900 truncate cursor-default">
                                {appt.cancellationReason.length > 50 
                                  ? `${appt.cancellationReason.substring(0, 50)}...` 
                                  : appt.cancellationReason}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.cancellationReason}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No cancellation reason provided</p>
                      )
                    ) : !isNoteEditable(appt, date) ? (
                      // Display note as read-only (for past dates)
                      appt.note ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-gray-900 truncate cursor-default">
                                {appt.note.length > 50 ? `${appt.note.substring(0, 50)}...` : appt.note}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.note}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No note</p>
                      )
                    ) : (
                      // Original editable logic (for today's appointments)
                      editingNoteId === appt.id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            value={editingNoteValue}
                            onChange={(e) => setEditingNoteValue(e.target.value)}
                            className="text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveNoteEdit(appt.id);
                              } else if (e.key === "Escape") {
                                cancelNoteEdit();
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveNoteEdit(appt.id)}
                              className="text-xs h-7"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelNoteEdit}
                              className="text-xs h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : appt.note === undefined || appt.note === "" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 w-full justify-start"
                          onClick={() => startNoteEdit(appt.id, "")}
                        >
                          + Add Note
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className="text-sm text-gray-900 cursor-pointer px-2 py-1.5 rounded hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                                onClick={() => startNoteEdit(appt.id, appt.note || "")}
                              >
                                {appt.note.length > 50 ? `${appt.note.substring(0, 50)}...` : appt.note}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.note}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}
                  </div>
                </div>
                                    </div>
                                  </div>

                                  {/* Call Logs and Actions Section */}
                                  {appt.isTimeRange ? (
                                    <div className="flex gap-4">
                                      {/* Call Logs Section - 1/3 width */}
                                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-1/3">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Call Logs</h4>
                                        <div className="flex flex-col gap-3">
                                          {appt.callLogs?.map((checked, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                              <Checkbox
                                                id={`call-${appt.id}-${index}`}
                                                checked={checked}
                                                onCheckedChange={() => handleCallLogToggle(appt.id, index)}
                                              />
                                              <label
                                                htmlFor={`call-${appt.id}-${index}`}
                                                className="text-sm text-gray-700 cursor-pointer"
                                              >
                                                Call {index + 1}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Actions Section - 2/3 width */}
                                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-2/3">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Actions</h4>
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                          <button
                                            type="button"
                                            onClick={() => openEditModalForAppt(appt)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                          >
                                            <Calendar className="h-4 w-4" />
                                            <span>Reschedule</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => openUserProfile(appt)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                          >
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                          </button>

                                           {!shouldHideEditActions(appt) && (
                                             <button
                                               type="button"
                                               onClick={() => openAssessmentForm(appt.clientFullName, appt.attendeeId)}
                                               className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                             >
                                               <FormInput className="h-4 w-4" />
                                               <span>Assessment</span>
                                             </button>
                                           )}

                                          <button
                                            type="button"
                                            onClick={() => {/* No action for now */}}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                          >
                                            <FileText className="h-4 w-4" />
                                            <span>Transcript</span>
                                          </button>

                                           {!shouldHideEditActions(appt) && (
                                             <button
                                               type="button"
                                               onClick={() => openCancelDialog(appt)}
                                               className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-destructive/5 hover:border-destructive/30 transition-all text-sm font-medium text-gray-700 hover:text-destructive shadow-sm"
                                             >
                                               <X className="h-4 w-4" />
                                               <span>Cancel</span>
                                             </button>
                                           )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Actions Section for non-time-range appointments */
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Actions</h4>
                                      <div className="flex flex-wrap items-center justify-center gap-3">
                                        <button
                                          type="button"
                                          onClick={() => openEditModalForAppt(appt)}
                                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                        >
                                          <Calendar className="h-4 w-4" />
                                          <span>Reschedule</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => openUserProfile(appt)}
                                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                        >
                                          <User className="h-4 w-4" />
                                          <span>Profile</span>
                                        </button>

                                         {!shouldHideEditActions(appt) && (
                                           <button
                                             type="button"
                                             onClick={() => openAssessmentForm(appt.clientFullName, appt.attendeeId)}
                                             className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                           >
                                             <FormInput className="h-4 w-4" />
                                             <span>Assessment</span>
                                           </button>
                                         )}

                                         {!shouldHideEditActions(appt) && (
                                           <button
                                             type="button"
                                             onClick={() => openCancelDialog(appt)}
                                             className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-destructive/5 hover:border-destructive/30 transition-all text-sm font-medium text-gray-700 hover:text-destructive shadow-sm"
                                           >
                                             <X className="h-4 w-4" />
                                             <span>Cancel</span>
                                           </button>
                                         )}
                                      </div>
                                    </div>
                                  )}
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
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                {appt.clientFullName}
                                {appt.attendeeNote && (
                                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center"><AlertIconWithTooltip level={appt.alertLevel} /></td>
                            <td className="px-2 py-2 text-center"><GrowthStatusCell stage={appt.growthStage} /></td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                {appt.clinicianFullName}
                                {appt.note && (
                                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2">
                        <InlineOutcomeDropdown
                          value={appt.outcome}
                          options={["Due", "Success", "No Show"]}
                          onChange={val => handleEdit(appt.id, "outcome", val)}
                          badgeClass={getClientOutcomeBadgeProps(appt.outcome).className}
                          getBadgeProps={getClientOutcomeBadgeProps}
                          disabled={!isOutcomeEditable(appt)}
                        />
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
                                <div className="flex flex-col gap-6">
                                   {/* Contact Information Section */}
                                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Contact Information</h4>
                                    <div className="flex flex-col gap-6">
                                      {/* Row 1: Email and Phone */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Email - Non-editable */}
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            <Mail className="h-4 w-4 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <label className="text-xs text-muted-foreground block mb-1">Email</label>
                                            <p className="text-sm text-gray-900 break-all">{appt.email}</p>
                                          </div>
                                        </div>

                                        {/* Phone - Non-editable */}
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            <Phone className="h-4 w-4 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                                            <p className="text-sm text-gray-900">{appt.phone}</p>
                                          </div>
                                        </div>
                                        
                                        {/* Meeting URL */}
                                        {appt.meetingUrl && (
                                          <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                              <Video className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <label className="text-xs text-muted-foreground block mb-1">Meeting URL</label>
                                              <a
                                                href={appt.meetingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                              >
                                                {appt.meetingUrl}
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Row 2: Attendee Note and Provider Note */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Attendee Note - Non-editable */}
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            <StickyNote className="h-4 w-4 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <label className="text-xs text-muted-foreground block mb-1">Attendee Note</label>
                                            {appt.attendeeNote ? (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <p className="text-sm text-gray-900 truncate cursor-default">
                                                      {appt.attendeeNote.length > 50 ? `${appt.attendeeNote.substring(0, 50)}...` : appt.attendeeNote}
                                                    </p>
                                                  </TooltipTrigger>
                                                  <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                                                    {appt.attendeeNote}
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            ) : (
                                              <p className="text-sm text-muted-foreground italic">No note</p>
                                             )}
                                          </div>
                                        </div>

                                        {/* Reschedule Reasons */}
                                        {appt.rescheduleReasons && appt.rescheduleReasons.length > 0 && (
                                          <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                              <Calendar className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <label className="text-xs text-muted-foreground block mb-1">
                                                Reschedule Reasons
                                              </label>
                                              <div className="space-y-2">
                                                {appt.rescheduleReasons.map((reason, index) => (
                                                  <div key={index} className="text-sm text-gray-900 p-2 bg-amber-50 border border-amber-200 rounded">
                                                    <span className="font-medium text-amber-700">#{index + 1}:</span> {reason}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                         {/* Provider Note - Editable */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <StickyNote className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground block mb-1">
                      {appt.outcome === "Canceled" ? "Cancellation Reason" : "Provider Note"}
                    </label>
                    
                    {appt.outcome === "Canceled" ? (
                      // Display cancellation reason (non-editable)
                      appt.cancellationReason ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-gray-900 truncate cursor-default">
                                {appt.cancellationReason.length > 50 
                                  ? `${appt.cancellationReason.substring(0, 50)}...` 
                                  : appt.cancellationReason}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.cancellationReason}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No cancellation reason provided</p>
                      )
                    ) : !isNoteEditable(appt, date) ? (
                      // Display note as read-only (for past dates)
                      appt.note ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-gray-900 truncate cursor-default">
                                {appt.note.length > 50 ? `${appt.note.substring(0, 50)}...` : appt.note}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.note}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No note</p>
                      )
                    ) : (
                      // Original editable logic (for today's appointments)
                      editingNoteId === appt.id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            value={editingNoteValue}
                            onChange={(e) => setEditingNoteValue(e.target.value)}
                            className="text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveNoteEdit(appt.id);
                              } else if (e.key === "Escape") {
                                cancelNoteEdit();
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveNoteEdit(appt.id)}
                              className="text-xs h-7"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelNoteEdit}
                              className="text-xs h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : appt.note === undefined || appt.note === "" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 w-full justify-start"
                          onClick={() => startNoteEdit(appt.id, "")}
                        >
                          + Add Note
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className="text-sm text-gray-900 cursor-pointer px-2 py-1.5 rounded hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                                onClick={() => startNoteEdit(appt.id, appt.note || "")}
                              >
                                {appt.note.length > 50 ? `${appt.note.substring(0, 50)}...` : appt.note}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border border-gray-200 max-w-xs">
                              {appt.note}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                                             )}
                                           </div>
                                         </div>

                                         {/* Reschedule Reasons */}
                                         {appt.rescheduleReasons && appt.rescheduleReasons.length > 0 && (
                                           <div className="flex items-start gap-3 mt-4">
                                             <div className="mt-0.5">
                                               <Calendar className="h-4 w-4 text-amber-600" />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                               <label className="text-xs text-muted-foreground block mb-1">
                                                 Reschedule Reasons
                                               </label>
                                               <div className="space-y-2">
                                                 {appt.rescheduleReasons.map((reason, index) => (
                                                   <div key={index} className="text-sm text-gray-900 p-2 bg-amber-50 border border-amber-200 rounded">
                                                     <span className="font-medium text-amber-700">#{index + 1}:</span> {reason}
                                                   </div>
                                                 ))}
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                   </div>

                                   {/* Actions Section */}
                                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Actions</h4>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => openEditModalForAppt(appt)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                      >
                                        <Calendar className="h-4 w-4" />
                                        <span>Reschedule</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => openUserProfile(appt)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                      >
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                      </button>

                                       {!shouldHideEditActions(appt) && (
                                         <button
                                           type="button"
                                           onClick={() => openProgressNotesForm(appt.clientFullName, appt.attendeeId)}
                                           className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                         >
                                           <StickyNote className="h-4 w-4" />
                                           <span>Progress Note</span>
                                         </button>
                                       )}

                                       <button
                                         type="button"
                                         onClick={() => {/* No action for now */}}
                                         className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-medium text-gray-700 hover:text-primary shadow-sm"
                                       >
                                         <FileText className="h-4 w-4" />
                                         <span>Transcript</span>
                                       </button>

                                       {!shouldHideEditActions(appt) && (
                                         <button
                                           type="button"
                                           onClick={() => openCancelDialog(appt)}
                                           className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-destructive/5 hover:border-destructive/30 transition-all text-sm font-medium text-gray-700 hover:text-destructive shadow-sm"
                                         >
                                           <X className="h-4 w-4" />
                                           <span>Cancel</span>
                                         </button>
                                       )}
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
