import { format } from "date-fns";
import { getFormattedPhoneDisplay } from "./phoneFormatting";
import { calculateAlertLevel, AlertData } from "./alertLevelCalculation";

export const transformSupabaseToAppointment = (
  row: any, 
  latestOutcome?: string, 
  serviceByPersonId?: Record<string, string>,
  rescheduleReasons?: string[],
  alertData?: AlertData
) => {
  const bookingDetails = row.booking_details || {};
  
  // Get attendee data from the first attendee
  const attendeeData = row.schedule_appointment_attendees?.[0];
  const attendee = attendeeData?.attendee;
  const attendeeContact = attendee?.people_contacts?.[0];
  const attendeeService = attendee?.people_assign_service?.[0];
  
  // Extract email from booking_details or people_contacts
  const email = bookingDetails.attendees?.[0]?.email 
    || bookingDetails.responses?.email?.value 
    || attendeeContact?.email
    || '';
  
  // Extract phone/location from booking_details or people_contacts
  let phoneLocation = bookingDetails.location 
    || bookingDetails.responses?.location?.value?.value
    || attendeeContact?.phone
    || '';
  
  // Format phone number to USA format if it looks like a phone number
  if (phoneLocation && phoneLocation.match(/^\+?[\d\s-]+$/)) {
    phoneLocation = getFormattedPhoneDisplay(phoneLocation, 'United States');
  }
  
  // Extract attendee note
  const attendeeNote = bookingDetails.responses?.notes?.value 
    || bookingDetails.additionalNotes 
    || bookingDetails.notes
    || '';
  
  // Use reschedule reasons from trigger logs (if provided)
  // Otherwise fall back to booking_details for backward compatibility
  let finalRescheduleReasons: string[] = [];
  if (rescheduleReasons && rescheduleReasons.length > 0) {
    finalRescheduleReasons = rescheduleReasons;
  } else {
    // Fallback: Extract from booking_details (old approach)
    const rescheduleData = bookingDetails.responses?.rescheduleReason?.value;
    if (rescheduleData) {
      if (Array.isArray(rescheduleData)) {
        finalRescheduleReasons = rescheduleData.filter(r => r && typeof r === 'string' && r.trim());
      } else if (typeof rescheduleData === 'string' && rescheduleData.trim()) {
        finalRescheduleReasons = [rescheduleData.trim()];
      }
    }
    
    // Secondary fallback: Check old direct path
    if (finalRescheduleReasons.length === 0 && bookingDetails.rescheduleReason) {
      if (Array.isArray(bookingDetails.rescheduleReason)) {
        finalRescheduleReasons = bookingDetails.rescheduleReason.filter(r => r && typeof r === 'string' && r.trim());
      } else if (typeof bookingDetails.rescheduleReason === 'string' && bookingDetails.rescheduleReason.trim()) {
        finalRescheduleReasons = [bookingDetails.rescheduleReason.trim()];
      }
    }
  }
  
  // Extract meeting URL from responses
  const meetingURL = bookingDetails.responses?.meetingURL?.value || '';
  
  // Format date and time
  const startTime = new Date(row.start_time);
  const groupDate = format(startTime, 'yyyy-MM-dd');
  const groupDateDisplay = format(startTime, 'MMM d');
  const time = format(startTime, 'h:mm a');
  const startMs = startTime.getTime();
  const startISO = row.start_time;
  
  // Determine appointment type
  const type = row.appointment_type === 'Lead' ? 'intakes' : 'clients';
  
  // Get service name - prefer map lookup, fallback to nested paths
  const serviceFromMap = attendee?.id ? serviceByPersonId?.[attendee.id] : undefined;
  const service = serviceFromMap
    || attendeeService?.service?.service 
    || attendeeService?.settings_services_and_fees?.service
    || '';
  
  // Get attendee full name
  const clientFullName = attendee 
    ? `${attendee.first_name} ${attendee.last_name}`.trim()
    : '';
  
  // Get host full name
  const clinicianFullName = row.host 
    ? `${row.host.first_name} ${row.host.last_name}`.trim()
    : '';
  
  // Get note and call logs from schedule_appointment_notes
  const notesData = row.schedule_appointment_notes?.[0];
  const note = notesData?.appointment_note || undefined;
  const callLogs = [
    !!notesData?.call_log_1,
    !!notesData?.call_log_2,
    !!notesData?.call_log_3
  ];
  
  // Determine outcome - prioritize appointment_status='canceled', then latest outcome log
  // NOTE: When appointment_status changes to "canceled", this outcome should be logged 
  // in schedule_appointment_outcomes_log table (via Cal.com webhook handler)
  let outcome: string;
  if (row.appointment_status === 'canceled') {
    outcome = 'Canceled';
  } else {
    outcome = latestOutcome || 'Due';
  }
  
  // Get cancellation reason for canceled appointments
  const cancellationReason = row.cancellation_reason || '';
  
  // Hide Call Logs for now - will be enabled when time range format is implemented
  // Currently only displaying start_time (e.g., "1 PM")
  // Future: Show Call Logs only when time range format is detected (e.g., "1 PM - 4 PM")
  const isTimeRange = false;
  
  // TODO: Enable when time range format is implemented:
  // const endTime = row.end_time ? new Date(row.end_time) : null;
  // const hasTimeRange = endTime && endTime.getTime() !== startTime.getTime();
  // const isTimeRange = type === 'intakes' && hasTimeRange;
  
  // Calculate alert level
  const alertLevel = alertData 
    ? calculateAlertLevel(alertData)
    : 'grey';
  
  return {
    id: row.id,
    groupDate,
    groupDateDisplay,
    time,
    isTimeRange,
    type: type as "intakes" | "clients" | "team" | "personal",
    service,
    clientFullName,
    clinicianFullName,
    email,
    phone: phoneLocation,
    attendeeNote,
    note,
    callLogs,
    outcome,
    cancellationReason,
    startMs,
    startISO,
    rescheduleReasons: finalRescheduleReasons,
    meetingUrl: meetingURL,
    calBookingId: row.cal_booking_id || '',
    calendarOwnerId: row.calendar_owner_id || '',
    rescheduledByEmail: row.rescheduled_by_email || '',
    canceledByEmail: row.canceled_by_email || '',
    // Alert data
    alertLevel: alertLevel as "red" | "yellow" | "grey",
    alertData,
    growthStage: 'foundation' as "foundation" | "developing" | "established",
    // Store IDs for mutations and navigation
    appointmentId: row.id,
    attendeeId: attendee?.id || '',
    // Other fields with defaults
    numberOfInvitees: 1,
    attendees: [clientFullName],
    meetingTitle: `${service} Session`,
    description: '',
    location: phoneLocation,
    address: '',
    otherDetails: '',
  };
};
