import { useState, useEffect, useCallback } from 'react';
import { ClientData } from '@/components/people/clients/types';
import { generateDischargedData } from '@/components/people/clients/data';

export const useDischargedClients = () => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDischargedClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, using dummy data. In the future, this could be connected to a database
      const dischargedData = generateDischargedData().sort((a, b) => {
        const dateA = new Date(a.dateDischarged || '');
        const dateB = new Date(b.dateDischarged || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      setData(dischargedData);
    } catch (err) {
      console.error('Error fetching discharged clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch discharged clients');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDischargedClients();
  }, [fetchDischargedClients]);

  // Listen for status update events
  useEffect(() => {
    const handleStatusUpdate = () => {
      fetchDischargedClients();
    };

    window.addEventListener('userprofile:status-updated', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('userprofile:status-updated', handleStatusUpdate);
    };
  }, [fetchDischargedClients]);

  return { data, loading, error, refetch: fetchDischargedClients };
};