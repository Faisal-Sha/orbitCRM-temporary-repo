import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface Organization {
  id: string;
  organization_name: string;
  organization_state: string;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  user_count: number;
  storage_used: string;
}

export const useRealtimeOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase.rpc('get_organizations_with_admins');
      
      if (error) {
        console.error('Error fetching organizations:', error);
        return;
      }

      setOrganizations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Set up realtime subscription
  useRealtimeSubscription<any>({
    table: 'app_organizations',
    onInsert: () => {
      // Refetch all organizations when a new one is added
      fetchOrganizations();
    },
    onUpdate: () => {
      // Refetch all organizations when one is updated
      fetchOrganizations();
    },
    onDelete: () => {
      // Refetch all organizations when one is deleted
      fetchOrganizations();
    },
  });

  return {
    organizations,
    loading,
    refetch: fetchOrganizations,
  };
};