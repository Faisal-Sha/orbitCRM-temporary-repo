import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InsuranceProvider {
  id: string;
  insurance_provider: string | null;
  insurance_category: 'medicaid' | 'medicare' | 'dual' | 'private';
  insurance_status: 'active' | 'inactive';
  agency_id: string;
  created_at: string;
  updated_at: string;
}

export interface InsuranceFormData {
  name: string;
  category: string;
  status: string;
}

export const useInsurances = (agencyId?: string) => {
  const [insurances, setInsurances] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInsurances = async () => {
    if (!agencyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings_services_insurances')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setInsurances(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch insurances: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addInsurance = async (formData: InsuranceFormData) => {
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
        .from('settings_services_insurances')
        .insert([
          {
            agency_id: agencyId,
            insurance_provider: formData.name,
            insurance_category: formData.category as InsuranceProvider['insurance_category'],
            insurance_status: formData.status as InsuranceProvider['insurance_status'],
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setInsurances(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Insurance provider added successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to add insurance: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const updateInsurance = async (id: string, formData: InsuranceFormData) => {
    try {
      const { data, error } = await supabase
        .from('settings_services_insurances')
        .update({
          insurance_provider: formData.name,
          insurance_category: formData.category as InsuranceProvider['insurance_category'],
          insurance_status: formData.status as InsuranceProvider['insurance_status'],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setInsurances(prev => 
        prev.map(insurance => 
          insurance.id === id ? data : insurance
        )
      );
      
      toast({
        title: "Success",
        description: "Insurance provider updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to update insurance: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const deleteInsurance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('settings_services_insurances')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setInsurances(prev => prev.filter(insurance => insurance.id !== id));
      toast({
        title: "Success",
        description: "Insurance provider deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: `Failed to delete insurance: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  return {
    insurances,
    loading,
    error,
    addInsurance,
    updateInsurance,
    deleteInsurance,
    refetch: fetchInsurances,
  };
};