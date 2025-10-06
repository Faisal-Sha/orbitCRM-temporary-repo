import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DomainData {
  protocol: string;
  domain: string;
}

export const usePrimaryDomain = () => {
  const [domain, setDomain] = useState<DomainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_primary_org_domain');
        
        if (error) throw error;
        
        // data can be null or a DomainData object
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const domainObj = data as Record<string, unknown>;
          if ('protocol' in domainObj && 'domain' in domainObj && 
              typeof domainObj.protocol === 'string' && typeof domainObj.domain === 'string') {
            setDomain({
              protocol: domainObj.protocol,
              domain: domainObj.domain
            });
          } else {
            setDomain(null);
          }
        } else {
          setDomain(null);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch domain';
        setError(errorMessage);
        console.error('Error fetching primary domain:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, []);

  return { domain, loading, error };
};
