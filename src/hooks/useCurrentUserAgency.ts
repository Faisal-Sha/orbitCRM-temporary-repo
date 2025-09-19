import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentUserAgency = () => {
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserAgency = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('current_user_agency_id');
        
        if (error) {
          throw error;
        }
        
        setAgencyId(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agency ID';
        setError(errorMessage);
        console.error('Error fetching current user agency:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserAgency();
  }, []);

  return { agencyId, loading, error };
};