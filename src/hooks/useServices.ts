import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  service: string | null;
  service_category: 'adults' | 'teens';
  service_status: 'active' | 'inactive';
  service_fee: string | null;
  service_fee_type: 'per hour' | 'per session' | 'per day' | 'flat fee';
  agency_id: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  name: string;
  category: string;
  fee: string;
  feeType: string;
  status: string;
}

export const useServices = (agencyId?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    if (!agencyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings_services_and_fees')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setServices(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch services: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (formData: ServiceFormData) => {
    if (!agencyId) {
      toast({
        title: "Error",
        description: "Agency ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('settings_services_and_fees')
        .insert([
          {
            agency_id: agencyId,
            service: formData.name,
            service_category: formData.category as Service['service_category'],
            service_status: formData.status as Service['service_status'],
            service_fee: formData.fee,
            service_fee_type: formData.feeType as Service['service_fee_type'],
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setServices(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to add service: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const updateService = async (id: string, formData: ServiceFormData) => {
    try {
      const { data, error } = await supabase
        .from('settings_services_and_fees')
        .update({
          service: formData.name,
          service_category: formData.category as Service['service_category'],
          service_status: formData.status as Service['service_status'],
          service_fee: formData.fee,
          service_fee_type: formData.feeType as Service['service_fee_type'],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setServices(prev => 
        prev.map(service => 
          service.id === id ? data : service
        )
      );
      
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to update service: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('settings_services_and_fees')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to delete service: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, [agencyId]);

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};