import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdateNoteParams {
  appointmentId: string;
  personId: string;
  note: string | null;
}

interface UpdateCallLogParams {
  appointmentId: string;
  personId: string;
  logNumber: 1 | 2 | 3;
  checked: boolean;
}

export const useAppointmentNotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateNote = useMutation({
    mutationFn: async ({ appointmentId, personId, note }: UpdateNoteParams) => {
      // Check if note record exists
      const { data: existing } = await supabase
        .from('schedule_appointment_notes')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('person_id', personId)
        .maybeSingle();

      if (existing) {
        // Update existing note
        const { error } = await supabase
          .from('schedule_appointment_notes')
          .update({ 
            appointment_note: note,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new note
        const { error } = await supabase
          .from('schedule_appointment_notes')
          .insert({
            appointment_id: appointmentId,
            person_id: personId,
            appointment_note: note
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Note updated",
        description: "The note has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCallLog = useMutation({
    mutationFn: async ({ appointmentId, personId, logNumber, checked }: UpdateCallLogParams) => {
      // Check if note record exists
      const { data: existing } = await supabase
        .from('schedule_appointment_notes')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('person_id', personId)
        .maybeSingle();

      const columnName = `call_log_${logNumber}`;
      const value = checked ? new Date().toISOString() : '';

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('schedule_appointment_notes')
          .update({ 
            [columnName]: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('schedule_appointment_notes')
          .insert({
            appointment_id: appointmentId,
            person_id: personId,
            [columnName]: value
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating call log",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateNote: updateNote.mutate,
    updateCallLog: updateCallLog.mutate,
  };
};
