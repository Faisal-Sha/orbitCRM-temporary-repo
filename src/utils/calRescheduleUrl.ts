/**
 * Generates a Cal.com reschedule URL based on appointment data
 * 
 * URL Format: {baseUrl}?rescheduleUid={calBookingId}&rescheduledBy={userEmail}
 * 
 * @param calBookingId - The Cal.com booking UID from schedule_appointments.cal_booking_id
 * @param calendarUrl - The base Cal.com URL from cal_calendar_users.calendar_url
 * @param rescheduledByEmail - Email of the user performing the reschedule action (from people_contacts)
 * @returns Complete reschedule URL or null if data is missing
 */
export const generateCalRescheduleUrl = (
  calBookingId: string | undefined,
  calendarUrl: string | undefined,
  rescheduledByEmail?: string | null
): string | null => {
  // Validate required data
  if (!calBookingId || !calendarUrl) {
    console.warn('Missing required data for reschedule URL:', { calBookingId, calendarUrl });
    return null;
  }

  // Use provided email or fallback to default, then URL-encode it
  const emailToUse = rescheduledByEmail || 'appointments@companioned.org';
  const encodedEmail = encodeURIComponent(emailToUse);

  // Construct the URL
  const url = `${calendarUrl}?rescheduleUid=${calBookingId}&rescheduledBy=${encodedEmail}`;
  
  return url;
};

/**
 * Opens Cal.com reschedule URL in a new tab
 */
export const openCalRescheduleUrl = (url: string | null) => {
  if (!url) {
    console.error('Cannot open reschedule URL: URL is null');
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

/**
 * Generates a Cal.com cancellation URL based on booking ID
 * 
 * URL Format: https://app.cal.com/booking/{calBookingId}?cancel=true
 * 
 * @param calBookingId - The Cal.com booking UID from schedule_appointments.cal_booking_id
 * @returns Complete cancellation URL or null if booking ID is missing
 */
export const generateCalCancelUrl = (
  calBookingId: string | undefined
): string | null => {
  // Validate required data
  if (!calBookingId) {
    console.warn('Missing cal_booking_id for cancellation URL');
    return null;
  }

  // Fixed Cal.com cancellation base URL
  const baseUrl = 'https://app.cal.com/booking';

  // Construct the URL: https://app.cal.com/booking/{id}?cancel=true
  const url = `${baseUrl}/${calBookingId}?cancel=true`;
  
  return url;
};

/**
 * Opens Cal.com cancellation URL in a new tab
 */
export const openCalCancelUrl = (url: string | null) => {
  if (!url) {
    console.error('Cannot open cancellation URL: URL is null');
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

/**
 * Generates a Cal.com URL for scheduling a NEW appointment (not rescheduling existing)
 * Used for canceled/past appointments where we want to schedule fresh with prefilled data
 * 
 * URL Format: {calendarUrl}?name={fullName}&attendee_id={personId}&email={email}&appointment_type={type}&calendar_owner_id={ownerId}&location={...}&meetingURL={url}
 * 
 * @param calendarUrl - The base Cal.com URL from cal_calendar_users.calendar_url
 * @param attendeeData - Object containing attendee information to prefill
 * @param appointmentType - 'Lead' or 'Client'
 * @param calendarOwnerId - The calendar owner's person_id
 * @returns Complete new appointment URL with prefilled data
 */
export const generateNewAppointmentUrl = (
  calendarUrl: string,
  attendeeData: {
    personId: string;
    fullName: string;
    email: string;
    phone?: string;
    meetingUrl?: string;
  },
  appointmentType: 'Lead' | 'Client',
  calendarOwnerId: string
): string => {
  const params = new URLSearchParams();
  
  params.append('name', attendeeData.fullName);
  params.append('attendee_id', attendeeData.personId);
  params.append('email', attendeeData.email);
  params.append('appointment_type', appointmentType);
  params.append('calendar_owner_id', calendarOwnerId);

  // Add meeting URL if provided
  if (attendeeData.meetingUrl) {
    params.append('meetingURL', attendeeData.meetingUrl);
  }

  // Manually construct location parameter to avoid double-encoding
  let url = `${calendarUrl}?${params.toString()}`;
  
  if (attendeeData.phone) {
    // Extract digits only from phone number
    const cleanDigits = attendeeData.phone.replace(/\D/g, '');
    // Construct location JSON parameter (manually to prevent double encoding)
    url += `&location={"value":"phone","optionValue":"%2B1${cleanDigits}"}`;
  }

  return url;
};
