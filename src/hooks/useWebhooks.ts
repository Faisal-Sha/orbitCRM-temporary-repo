import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebhookItem {
  id: string;
  webhook_name: string;
  webhook_api_endpoint: string;
  webhook_api_secret: string;
  status: string;
  created_at: string;
  updated_at: string;
  agency_id: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateWebhookData {
  webhook_name: string;
  webhook_api_secret?: string;
  status?: string;
}

export interface UpdateWebhookData {
  webhook_name?: string;
  webhook_api_secret?: string;
  status?: string;
}

export const useWebhooks = () => {
  const queryClient = useQueryClient();

  // Fetch all webhooks
  const {
    data: webhooks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async (): Promise<WebhookItem[]> => {
      const { data, error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'GET' },
      });

      if (error) throw error;
      return data || [];
    },
  });

  // Create webhook mutation
  const createWebhook = useMutation({
    mutationFn: async (webhookData: CreateWebhookData): Promise<WebhookItem> => {
      const { data, error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'POST', ...webhookData },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create webhook: ${error.message}`);
    },
  });

  // Update webhook mutation
  const updateWebhook = useMutation({
    mutationFn: async ({ id, ...data }: UpdateWebhookData & { id: string }): Promise<WebhookItem> => {
      const { data: result, error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'PUT', id, ...data },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update webhook: ${error.message}`);
    },
  });

  // Delete webhook mutation
  const deleteWebhook = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'DELETE', id },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete webhook: ${error.message}`);
    },
  });

  return {
    webhooks,
    isLoading,
    error,
    refetch,
    createWebhook: createWebhook.mutate,
    updateWebhook: updateWebhook.mutate,
    deleteWebhook: deleteWebhook.mutate,
    isCreating: createWebhook.isPending,
    isUpdating: updateWebhook.isPending,
    isDeleting: deleteWebhook.isPending,
  };
};