import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LogOutcomeParams {
  appointmentId: string;
  personId: string;
  outcome: string;
}

export const useAppointmentOutcomes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logOutcome = useMutation({
    mutationFn: async ({ appointmentId, personId, outcome }: LogOutcomeParams) => {
      const { error } = await supabase
        .from('schedule_appointment_outcomes_log')
        .insert({
          appointment_id: appointmentId,
          person_id: personId,
          outcome: outcome
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Outcome logged",
        description: "The outcome has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error logging outcome",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    logOutcome: logOutcome.mutate,
  };
};
