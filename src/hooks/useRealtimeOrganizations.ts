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
    onInsert: (newOrg) => {
      console.log('🏢 New organization added:', newOrg);
      // For INSERT, we need to refetch since we need admin data from the RPC function
      fetchOrganizations();
    },
    onUpdate: ({ old: oldOrg, new: newOrg }) => {
      console.log('🏢 Organization updated:', { old: oldOrg, new: newOrg });
      // For UPDATE, we can update the specific organization
      setOrganizations(prev => 
        prev.map(org => 
          org.id === newOrg.id 
            ? { 
                ...org, 
                organization_name: newOrg.organization_name,
                organization_state: newOrg.organization_state,
                status: newOrg.status 
              }
            : org
        )
      );
    },
    onDelete: ({ old: deletedOrg }) => {
      console.log('🏢 Organization deleted:', deletedOrg);
      // For DELETE, remove from the list
      setOrganizations(prev => prev.filter(org => org.id !== deletedOrg.id));
    },
  });

  return {
    organizations,
    loading,
    refetch: fetchOrganizations,
  };
};