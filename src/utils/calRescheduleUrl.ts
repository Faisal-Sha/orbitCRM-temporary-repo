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
