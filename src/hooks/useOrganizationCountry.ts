import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationCountry = () => {
  const [country, setCountry] = useState<string>('United States');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizationCountry = async () => {
      try {
        const { data, error } = await supabase.rpc('get_organization_settings');
        
        if (error) {
          console.error('Error fetching organization settings:', error);
          return;
        }

        if (data && typeof data === 'object' && 'country' in data && data.country) {
          setCountry(String(data.country));
        }
      } catch (error) {
        console.error('Error fetching organization country:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationCountry();
  }, []);

  return { country, loading };
};