import { useState, useEffect, useCallback } from 'react';
import { NoShowData } from '@/components/people/leads/types';
import { generateNoShowsData } from '@/components/people/leads/data';

export const useNoShows = () => {
  const [data, setData] = useState<NoShowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNoShows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, using dummy data. In the future, this could be connected to a database
      const noShowsData = generateNoShowsData().sort((a, b) => {
        const dateA = new Date(a.inquiryDate);
        const dateB = new Date(b.inquiryDate);
        return dateB.getTime() - dateA.getTime();
      });
      
      setData(noShowsData);
    } catch (err) {
      console.error('Error fetching no shows:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch no shows');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoShows();
  }, [fetchNoShows]);

  // Listen for status update events
  useEffect(() => {
    const handleStatusUpdate = () => {
      fetchNoShows();
    };

    window.addEventListener('userprofile:status-updated', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('userprofile:status-updated', handleStatusUpdate);
    };
  }, [fetchNoShows]);

  return { data, loading, error, refetch: fetchNoShows };
};