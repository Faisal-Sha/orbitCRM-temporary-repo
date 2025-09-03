import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserRole {
  id: string;
  role_name: string;
  user_count: number;
  created_at: string;
  updated_at: string;
}

interface RpcResponse {
  success: boolean;
  message?: string;
  role_id?: string;
}

export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_roles_with_counts');

      if (fetchError) {
        throw fetchError;
      }

      setRoles(data || []);
    } catch (err: any) {
      console.error('Error fetching user roles:', err);
      setError(err.message || 'Failed to fetch user roles');
      
      // Check if it's an access denied error
      if (err.message?.includes('Access denied')) {
        toast.error('Access denied. Admin or owner role required to view roles.');
      } else {
        toast.error('Failed to load user roles');
      }
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (roleName: string) => {
    try {
      const { data, error: addError } = await supabase.rpc('add_user_role', {
        p_role_name: roleName
      });

      if (addError) {
        throw addError;
      }

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Role added successfully');
        await fetchRoles(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to add role');
      }
    } catch (err: any) {
      console.error('Error adding role:', err);
      const errorMessage = err.message || 'Failed to add role';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateRole = async (roleId: string, roleName: string) => {
    try {
      const { data, error: updateError } = await supabase.rpc('update_user_role', {
        p_role_id: roleId,
        p_role_name: roleName
      });

      if (updateError) {
        throw updateError;
      }

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Role updated successfully');
        await fetchRoles(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to update role');
      }
    } catch (err: any) {
      console.error('Error updating role:', err);
      const errorMessage = err.message || 'Failed to update role';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      const { data, error: deleteError } = await supabase.rpc('delete_user_role', {
        p_role_id: roleId
      });

      if (deleteError) {
        throw deleteError;
      }

      const response = data as unknown as RpcResponse;
      if (response?.success) {
        toast.success(response.message || 'Role deleted successfully');
        await fetchRoles(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to delete role');
      }
    } catch (err: any) {
      console.error('Error deleting role:', err);
      const errorMessage = err.message || 'Failed to delete role';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    addRole,
    updateRole,
    deleteRole
  };
};