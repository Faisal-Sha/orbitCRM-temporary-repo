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
  staff_type_label_id?: string | null;
  label_name?: string | null;
  label_color?: string | null;
  text_color?: string | null;
  font_weight?: string | null;
}

interface RpcResponse {
  success: boolean;
  message?: string;
  role_id?: string;
  staff_type_id?: string;
}

export interface StaffTypeWithCount extends StaffType {
  count: number;
}

export const useStaffTypes = () => {
  const [staffTypes, setStaffTypes] = useState<StaffTypeWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_staff_types_with_counts');

      if (error) throw error;

      setStaffTypes(data as StaffTypeWithCount[]);
    } catch (error) {
      console.error('Error fetching staff types:', error);
      setError(error.message || 'Failed to fetch staff types');
      
      // Check if it's an access denied error
      if (error.message?.includes('Access denied')) {
        toast.error('Access denied. Admin or owner role required to view staff types.');
      } else {
        toast.error('Failed to load staff types');
      }
    } finally {
      setLoading(false);
    }
  };

  const addStaffType = async (staffType: StaffTypeEnum, staffTypeLabelId?: string) => {
    try {
      // Get current user ID for created_by and updated_by fields
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('add_staff_type', {
        p_staff_type: staffType,
        p_staff_type_label_id: staffTypeLabelId || null
      })

      if (error) throw error;

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Staff type added successfully');
        await fetchStaffTypes(); // Refresh the list
        return { success: true, staff_type_id: response.staff_type_id };
      } else {
        throw new Error(response?.message || 'Failed to add staff type');
      }
    } catch (error: any) {
      console.error('Error adding staff type:', error);
      toast.error(error.message || 'Failed to create staff type');
      return { success: false, error: error.message };
    }
  };

  const updateStaffType = async (id: string, staffType: StaffTypeEnum, staffTypeLabelId?: string) => {
    try {

      const { data, error } = await supabase.rpc('update_staff_type', {
        p_staff_type_id: id,
        p_staff_type: staffType,
        p_staff_type_label_id: staffTypeLabelId || null
      })

      if (error) throw error;

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Staff type updated successfully');
        await fetchStaffTypes(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to update staff type');
      }
    } catch (error: any) {
      console.error('Error updating staff type:', error);
      toast.error(error.message || 'Failed to update staff type');
      return { success: false, error: error.message };
    }
  };

  const deleteStaffType = async (id: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_staff_type', {
        p_staff_type_id: id
      })

      if (error) throw error;

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Staff type deleted successfully');
        await fetchStaffTypes(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to delete staff type');
      }
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