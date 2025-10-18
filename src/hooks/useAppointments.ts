import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseToAppointment } from "@/utils/appointmentTransformers";

interface UseAppointmentsOptions {
  appointmentType: 'Lead' | 'Client';
  enabled: boolean;
}

export const useAppointments = ({ appointmentType, enabled }: UseAppointmentsOptions) => {
  return useQuery({
    queryKey: ['appointments', appointmentType],
    queryFn: async () => {
      // Get current user's agency ID
      const { data: agencyData, error: agencyError } = await supabase
        .rpc('current_user_agency_id');
      
      if (agencyError) throw agencyError;
      if (!agencyData) return [];

      // Fetch appointments with all related data
      const { data, error } = await supabase
        .from('schedule_appointments')
        .select(`
          id,
          appointment_type,
          start_time,
          end_time,
          booking_details,
          calendar_owner_id,
          agency_id,
          host:people!schedule_appointments_calendar_owner_id_fkey(
            id,
            first_name,
            last_name
          ),
          schedule_appointment_attendees(
            attendee_id,
            attendee:people!schedule_appointment_attendees_attendee_id_fkey(
              id,
              first_name,
              last_name,
              people_contacts(
                email,
                phone
              ),
              people_assign_service(
                service:settings_services_and_fees(
                  service
                )
              )
            )
          ),
          schedule_appointment_notes(
            appointment_note,
            call_log_1,
            call_log_2,
            call_log_3
          )
        `)
        .eq('appointment_type', appointmentType)
        .eq('agency_id', agencyData)
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Get latest outcome for each appointment
      const appointmentIds = data?.map(a => a.id) || [];
      const { data: outcomesData } = await supabase
        .from('schedule_appointment_outcomes_log')
        .select('appointment_id, outcome, created_at')
        .in('appointment_id', appointmentIds)
        .order('created_at', { ascending: false });

      // Map latest outcome per appointment
      const latestOutcomes = new Map();
      outcomesData?.forEach(outcome => {
        if (!latestOutcomes.has(outcome.appointment_id)) {
          latestOutcomes.set(outcome.appointment_id, outcome.outcome);
        }
      });

      // Transform data to match Appointment interface
      return data?.map(appt => 
        transformSupabaseToAppointment(appt, latestOutcomes.get(appt.id))
      ) || [];
    },
    enabled,
    staleTime: 30000, // 30 seconds
  });
};
