import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LogOutcomeParams {
  appointmentId: string;
  personId: string;
  outcome: string;
}

export const useAppointmentOutcomes = () => {
  const queryClient = useQueryClient();

  const logOutcome = useMutation({
    mutationFn: async ({ appointmentId, personId, outcome }: LogOutcomeParams) => {
      const { data, error } = await supabase
        .from('schedule_appointment_outcomes_log')
        .insert({
          appointment_id: appointmentId,
          person_id: personId,
          outcome: outcome,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Outcome updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to log outcome: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    logOutcome,
  };
};
