import { format } from 'date-fns';
import { Appointment } from '@/components/appointments/listview/types';

interface BookingDetails {
  attendee_name?: string;
  attendee_email?: string;
  location?: string;
  additional_note?: string;
  [key: string]: any;
}

export const transformSupabaseToAppointment = (appt: any): Appointment => {
  const bookingDetails = (appt.booking_details as BookingDetails) || {};
  const calendarOwner = appt.calendar_owner;
  const notes = appt.notes?.[0]; // Get first note record
  const latestOutcome = appt.latest_outcome?.sort((a: any, b: any) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )?.[0];

  const startTime = new Date(appt.start_time);
  const groupDate = format(startTime, 'yyyy-MM-dd');
  const groupDateDisplay = format(startTime, 'MMMM d, yyyy');
  const time = format(startTime, 'h:mm a');

  // Determine appointment type
  let type: "intakes" | "clients" | "team" | "personal" = "intakes";
  if (appt.appointment_type === 'Lead') {
    type = "intakes";
  } else if (appt.appointment_type === 'Client') {
    type = "clients";
  }

  // Build full name for calendar owner
  const clinicianFullName = calendarOwner
    ? `${calendarOwner.first_name || ''} ${calendarOwner.middle_name || ''} ${calendarOwner.last_name || ''}`.trim()
    : '';

  // Parse call logs to boolean array
  const callLogs: boolean[] = [
    !!notes?.call_log_1,
    !!notes?.call_log_2,
    !!notes?.call_log_3,
  ];

  return {
    id: appt.id,
    groupDate,
    groupDateDisplay,
    time,
    isTimeRange: false,
    type,
    service: bookingDetails.service || 'CPST', // Default service
    clientFullName: bookingDetails.attendee_name || '',
    clinicianFullName,
    meetingTitle: bookingDetails.meeting_title,
    numberOfInvitees: 1,
    attendees: bookingDetails.attendee_name ? [bookingDetails.attendee_name] : [],
    alertLevel: 'grey' as const, // TODO: Implement alert level logic
    note: notes?.appointment_note || undefined,
    attendeeNote: bookingDetails.additional_note,
    email: bookingDetails.attendee_email || '',
    phone: bookingDetails.attendee_phone || '',
    growthStage: 'foundation' as const, // TODO: Implement growth stage logic
    outcome: latestOutcome?.outcome || 'Due',
    meetingUrl: appt.location === 'Video' ? appt.location_details : undefined,
    description: bookingDetails.description,
    location: appt.location,
    address: appt.location === 'In-Person' ? appt.location_details : undefined,
    otherDetails: appt.location === 'Other' ? appt.location_details : undefined,
    callLogs,
  };
};
