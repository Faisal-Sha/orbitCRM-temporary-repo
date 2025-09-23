import { useState, useEffect, useCallback } from 'react';
import { ClientData } from '@/components/people/clients/types';
import { generateIssuesData } from '@/components/people/clients/data';

export const useIssuesClients = () => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssuesClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, using dummy data. In the future, this could be connected to a database
      const issuesData = generateIssuesData().sort((a, b) => {
        const dateA = new Date(a.dateFlagged || '');
        const dateB = new Date(b.dateFlagged || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      setData(issuesData);
    } catch (err) {
      console.error('Error fetching clients with issues:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients with issues');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssuesClients();
  }, [fetchIssuesClients]);

  // Listen for status update events
  useEffect(() => {
    const handleStatusUpdate = () => {
      fetchIssuesClients();
    };

    window.addEventListener('userprofile:status-updated', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('userprofile:status-updated', handleStatusUpdate);
    };
  }, [fetchIssuesClients]);

  return { data, loading, error, refetch: fetchIssuesClients };
};