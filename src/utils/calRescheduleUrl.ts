/**
 * Generates a Cal.com reschedule URL based on appointment data
 * 
 * URL Format: {baseUrl}?rescheduleUid={calBookingId}&rescheduledBy=appointments%40companioned.org
 * 
 * @param calBookingId - The Cal.com booking UID from schedule_appointments.cal_booking_id
 * @param calendarUrl - The base Cal.com URL from cal_calendar_users.calendar_url
 * @returns Complete reschedule URL or null if data is missing
 */
export const generateCalRescheduleUrl = (
  calBookingId: string | undefined,
  calendarUrl: string | undefined
): string | null => {
  // Validate required data
  if (!calBookingId || !calendarUrl) {
    console.warn('Missing required data for reschedule URL:', { calBookingId, calendarUrl });
    return null;
  }

  // Hardcoded rescheduledBy email (URL encoded)
  const rescheduledByEmail = 'appointments%40companioned.org';

  // Construct the URL
  const url = `${calendarUrl}?rescheduleUid=${calBookingId}&rescheduledBy=${rescheduledByEmail}`;
  
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
