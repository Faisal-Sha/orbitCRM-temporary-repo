import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UpdateNoteParams {
  appointmentId: string;
  personId: string;
  note: string;
}

interface UpdateCallLogParams {
  appointmentId: string;
  personId: string;
  callIndex: 0 | 1 | 2;
  checked: boolean;
}

export const useAppointmentNotes = () => {
  const queryClient = useQueryClient();

  const updateNote = useMutation({
    mutationFn: async ({ appointmentId, personId, note }: UpdateNoteParams) => {
      // Check if a note record exists
      const { data: existing } = await supabase
        .from('schedule_appointment_notes')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('person_id', personId)
        .maybeSingle();

      if (existing) {
        // Update existing note
        const { data, error } = await supabase
          .from('schedule_appointment_notes')
          .update({ appointment_note: note })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new note
        const { data, error } = await supabase
          .from('schedule_appointment_notes')
          .insert({
            appointment_id: appointmentId,
            person_id: personId,
            appointment_note: note,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Note updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update note: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateCallLog = useMutation({
    mutationFn: async ({ appointmentId, personId, callIndex, checked }: UpdateCallLogParams) => {
      const callLogField = `call_log_${callIndex + 1}` as 'call_log_1' | 'call_log_2' | 'call_log_3';
      const callLogValue = checked ? new Date().toISOString() : null;

      // Check if a note record exists
      const { data: existing } = await supabase
        .from('schedule_appointment_notes')
        .select('id')
        .eq('appointment_id', appointmentId)
        .eq('person_id', personId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('schedule_appointment_notes')
          .update({ [callLogField]: callLogValue })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new record with the call log
        const { data, error } = await supabase
          .from('schedule_appointment_notes')
          .insert({
            appointment_id: appointmentId,
            person_id: personId,
            [callLogField]: callLogValue,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update call log: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    updateNote,
    updateCallLog,
  };
};
