import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationCountry = () => {
  const [country, setCountry] = useState<string>('United States');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationCountry = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.rpc('get_organization_settings');

        if (error) throw error;

        if (data && typeof data === 'object' && 'success' in data) {
          const result = data as any;
          
          if (result.success && result.settings && result.settings.country) {
            setCountry(result.settings.country);
          }
        }
      } catch (err: any) {
        console.error('Error fetching organization country:', err);
        setError(err.message || 'Failed to fetch organization country');
        // Keep default fallback
        setCountry('United States');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationCountry();
  }, []);

  return { country, loading, error };
};
