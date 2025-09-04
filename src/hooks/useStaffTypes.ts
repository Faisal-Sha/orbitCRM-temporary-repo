import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type StaffTypeEnum = 'specialist_marketer' | 'clinical_assessor' | 'clinical_supervisor' | 'case_manager' | 'admin_support' | 'sales_rep' | 'specialist_hr' | 'specialist_it' | 'specialist_finance' | 'leadership_team_lead' | 'leadership_exec';

export interface StaffType {
  id: string;
  staff_type: StaffTypeEnum;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface StaffTypeWithCount extends StaffType {
  count: number;
}

export const useStaffTypes = () => {
  const [staffTypes, setStaffTypes] = useState<StaffTypeWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffTypes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('app_user_staff_types')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For now, set count to 0 since we don't have staff assignment yet
      const staffTypesWithCount = data.map(staffType => ({
        ...staffType,
        count: 0
      }));

      setStaffTypes(staffTypesWithCount);
    } catch (error) {
      console.error('Error fetching staff types:', error);
      toast.error('Failed to load staff types');
    } finally {
      setLoading(false);
    }
  };

  const addStaffType = async (staffType: StaffTypeEnum) => {
    try {
      const { data, error } = await supabase
        .from('app_user_staff_types')
        .insert({ staff_type: staffType })
        .select()
        .single();

      if (error) throw error;

      const newStaffType = { ...data, count: 0 };
      setStaffTypes(prev => [newStaffType, ...prev]);
      
      toast.success('Staff type created successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding staff type:', error);
      toast.error(error.message || 'Failed to create staff type');
      return { success: false, error: error.message };
    }
  };

  const updateStaffType = async (id: string, staffType: StaffTypeEnum) => {
    try {
      const { data, error } = await supabase
        .from('app_user_staff_types')
        .update({ staff_type: staffType })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStaffTypes(prev => prev.map(st => 
        st.id === id ? { ...data, count: st.count } : st
      ));
      
      toast.success('Staff type updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating staff type:', error);
      toast.error(error.message || 'Failed to update staff type');
      return { success: false, error: error.message };
    }
  };

  const deleteStaffType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_user_staff_types')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      setStaffTypes(prev => prev.filter(st => st.id !== id));
      
      toast.success('Staff type deleted successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting staff type:', error);
      toast.error(error.message || 'Failed to delete staff type');
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  return {
    staffTypes,
    loading,
    addStaffType,
    updateStaffType,
    deleteStaffType,
    refetch: fetchStaffTypes
  };
};