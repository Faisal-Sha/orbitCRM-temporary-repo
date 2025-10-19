import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendeeNote {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  noteType: 'attendee' | 'assessor' | 'provider' | 'reschedule' | 'cancellation';
  noteText: string;
  createdAt: string;
  isCurrentAppointment: boolean;
}

interface UseAttendeeNotesHistoryParams {
  appointmentId: string;
  attendeeEmail: string;
  attendeePhone: string;
  agencyId: string | null;
  enabled?: boolean;
}

export const useAttendeeNotesHistory = ({
  appointmentId,
  attendeeEmail,
  attendeePhone,
  agencyId,
  enabled = true,
}: UseAttendeeNotesHistoryParams) => {
  return useQuery({
    queryKey: ['attendee-notes-history', attendeeEmail, attendeePhone, agencyId],
    queryFn: async (): Promise<AttendeeNote[]> => {
      if (!agencyId) return [];

      const notes: AttendeeNote[] = [];

      // Get all appointments for this attendee by matching email or phone
      const { data: appointments, error: appointmentsError } = await supabase
        .from('schedule_appointments')
        .select(`
          id,
          start_time,
          appointment_status,
          cancellation_reason,
          booking_details,
          schedule_appointment_attendees!inner (
            attendee_id,
            removed_at,
            people!inner (
              id,
              people_contacts!inner (
                email,
                phone
              )
            )
          ),
          schedule_appointment_notes (
            appointment_note,
            created_at
          )
        `)
        .eq('agency_id', agencyId)
        .is('schedule_appointment_attendees.removed_at', null)
        .order('start_time', { ascending: false });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        return [];
      }

      // Filter appointments that match the attendee's email or phone
      const matchedAppointments = appointments?.filter((appt: any) => {
        const attendees = appt.schedule_appointment_attendees || [];
        return attendees.some((att: any) => {
          const contacts = att.people?.people_contacts || [];
          return contacts.some((contact: any) => 
            contact.email === attendeeEmail || contact.phone === attendeePhone
          );
        });
      }) || [];

      // Process each appointment to extract notes
      for (const appt of matchedAppointments) {
        const isCurrentAppt = appt.id === appointmentId;
        const apptDate = new Date(appt.start_time);
        const formattedDate = apptDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const formattedTime = apptDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // Extract attendee note from booking_details
        const bookingDetails = appt.booking_details as any;
        const attendeeNote = bookingDetails?.responses?.notes;
        if (attendeeNote) {
          notes.push({
            id: `${appt.id}-attendee`,
            appointmentId: appt.id,
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            noteType: 'attendee',
            noteText: attendeeNote,
            createdAt: appt.start_time,
            isCurrentAppointment: isCurrentAppt,
          });
        }

        // Extract assessor/provider note
        const noteRecord = appt.schedule_appointment_notes?.[0];
        if (noteRecord?.appointment_note) {
          notes.push({
            id: `${appt.id}-assessor`,
            appointmentId: appt.id,
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            noteType: isCurrentAppt ? 'assessor' : 'provider',
            noteText: noteRecord.appointment_note,
            createdAt: noteRecord.created_at || appt.start_time,
            isCurrentAppointment: isCurrentAppt,
          });
        }

        // Extract cancellation reason
        if (appt.cancellation_reason) {
          notes.push({
            id: `${appt.id}-cancellation`,
            appointmentId: appt.id,
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            noteType: 'cancellation',
            noteText: appt.cancellation_reason,
            createdAt: appt.start_time,
            isCurrentAppointment: isCurrentAppt,
          });
        }
      }

      // Get reschedule reasons from trigger log
      const appointmentIds = matchedAppointments.map((a: any) => a.id);
      if (appointmentIds.length > 0) {
        const { data: triggerLogs } = await supabase
          .from('schedule_appointment_trigger_log')
          .select('appointment_id, raw_event_payload, created_at')
          .in('appointment_id', appointmentIds)
          .eq('trigger_event', 'BOOKING_RESCHEDULED')
          .order('created_at', { ascending: false });

        triggerLogs?.forEach((log: any) => {
          const rescheduleReason = log.raw_event_payload?.rescheduleReason;
          if (rescheduleReason) {
            const matchedAppt = matchedAppointments.find((a: any) => a.id === log.appointment_id);
            if (matchedAppt) {
              const apptDate = new Date(matchedAppt.start_time);
              notes.push({
                id: `${log.appointment_id}-reschedule-${log.created_at}`,
                appointmentId: log.appointment_id,
                appointmentDate: apptDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
                appointmentTime: apptDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }),
                noteType: 'reschedule',
                noteText: rescheduleReason,
                createdAt: log.created_at,
                isCurrentAppointment: log.appointment_id === appointmentId,
              });
            }
          }
        });
      }

      // Sort notes by date (newest first)
      return notes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: enabled && !!agencyId && !!attendeeEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
