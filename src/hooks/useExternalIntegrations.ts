import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ExternalIntegration {
  id: string;
  service_provider: string;
  category: string;
  configuration: Record<string, string>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

interface CreateIntegrationData {
  service_provider: string;
  category: string;
  configuration: Record<string, string>;
}

interface UpdateIntegrationData {
  id: string;
  service_provider?: string;
  category?: string;
  configuration?: Record<string, string>;
}

export const useExternalIntegrations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all non-deleted integrations
  const { data: integrations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['external-integrations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('settings_integrations_external')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ExternalIntegration[];
    },
  });

  // Create new integration
  const { mutate: createIntegration, isPending: isCreating } = useMutation({
    mutationFn: async (integrationData: CreateIntegrationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('settings_integrations_external')
        .insert({
          service_provider: integrationData.service_provider,
          category: integrationData.category,
          configuration: integrationData.configuration,
          created_by: user.id,
          updated_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Success",
        description: "Integration added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add integration",
        variant: "destructive",
      });
    },
  });

  // Update existing integration
  const { mutate: updateIntegration, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateIntegrationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('settings_integrations_external')
        .update({
          ...updateData,
          updated_by: user.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Success",
        description: "Integration updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update integration",
        variant: "destructive",
      });
    },
  });

  // Soft delete integration
  const { mutate: deleteIntegration, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('settings_integrations_external')
        .update({
          is_deleted: true,
          deleted_by: user.id,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-integrations'] });
      toast({
        title: "Success",
        description: "Integration deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete integration",
        variant: "destructive",
      });
    },
  });

  return {
    integrations,
    isLoading,
    error,
    refetch,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
