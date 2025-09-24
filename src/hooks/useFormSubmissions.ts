import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FormSubmission {
  id: string;
  agency_id: string;
  form_id: string | null;
  sub_track_id: string | null;
  submission_data: any;
  submission_status: string;
  submitted_by_id: string;
  archived_at: string | null;
  archived_by_user_id: string | null;
  deleted_at: string | null;
  deleted_by_user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  updated_by_id: string | null;
  is_deleted: boolean;
}

export const useFormSubmissions = (filters?: {
  formId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const queryClient = useQueryClient();

  // Fetch form submissions
  const {
    data: submissions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['form-submissions', filters],
    queryFn: async (): Promise<FormSubmission[]> => {
      let query = supabase
        .from('forms_submissions')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.formId) {
        query = query.eq('form_id', filters.formId);
      }
      if (filters?.status) {
        query = query.eq('submission_status', filters.status);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  // Archive submission mutation
  const archiveSubmission = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('forms_submissions')
        .update({
          archived_at: new Date().toISOString(),
          archived_by_user_id: user?.id || null,
          submission_status: 'archived'
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
      toast.success('Submission archived successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to archive submission: ${error.message}`);
    },
  });

  // Soft delete submission mutation
  const deleteSubmission = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('forms_submissions')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by_user_id: user?.id || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
      toast.success('Submission deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete submission: ${error.message}`);
    },
  });

  // Update submission status mutation
  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('forms_submissions')
        .update({
          submission_status: status,
          updated_by_id: user?.id || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
      toast.success('Submission status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  return {
    submissions,
    isLoading,
    error,
    refetch,
    archiveSubmission: archiveSubmission.mutate,
    deleteSubmission: deleteSubmission.mutate,
    updateSubmissionStatus: updateSubmissionStatus.mutate,
    isArchiving: archiveSubmission.isPending,
    isDeleting: deleteSubmission.isPending,
    isUpdatingStatus: updateSubmissionStatus.isPending,
  };
};