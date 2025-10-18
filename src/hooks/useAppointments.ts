import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUserAgency } from './useCurrentUserAgency';
import { transformSupabaseToAppointment } from '@/utils/appointmentTransformers';
import { Appointment } from '@/components/appointments/listview/types';

export const useAppointments = (appointmentType: 'intakes' | 'clients' | 'all') => {
  const { agencyId, loading: agencyLoading } = useCurrentUserAgency();

  return useQuery({
    queryKey: ['appointments', appointmentType, agencyId],
    queryFn: async () => {
      if (!agencyId) {
        throw new Error('No agency access');
      }

      // Build the query
      let query = supabase
        .from('schedule_appointments')
        .select(`
          *,
          calendar_owner:people!schedule_appointments_calendar_owner_id_fkey(
            id,
            first_name,
            middle_name,
            last_name
          ),
          notes:schedule_appointment_notes(
            id,
            appointment_note,
            call_log_1,
            call_log_2,
            call_log_3
          ),
          latest_outcome:schedule_appointment_outcomes_log(
            outcome,
            created_at
          )
        `)
        .eq('agency_id', agencyId)
        .order('start_time', { ascending: true });

      // Filter by appointment type if not "all"
      if (appointmentType === 'intakes') {
        query = query.eq('appointment_type', 'Lead');
      } else if (appointmentType === 'clients') {
        query = query.eq('appointment_type', 'Client');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match Appointment interface
      const appointments: Appointment[] = (data || []).map((appt) => 
        transformSupabaseToAppointment(appt)
      );

      return appointments;
    },
    enabled: !agencyLoading && !!agencyId,
  });
};
