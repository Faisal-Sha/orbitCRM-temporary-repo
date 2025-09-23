import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientData } from '@/components/people/clients/types';
import { providerList } from '@/components/people/clients/data';

interface ActiveClientRecord {
  person_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

const generateDummyProvider = (index: number) => {
  return providerList[index % providerList.length];
};

const generateDummyGrowthStage = (index: number): "foundation" | "developing" | "established" => {
  const stages: ("foundation" | "developing" | "established")[] = ["foundation", "developing", "established"];
  return stages[index % stages.length];
};

const generateDummyDateStarted = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  });
};

export const useActiveClients = () => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveClients = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: clientsData, error: fetchError } = await supabase
          .rpc('get_active_clients_data');

        if (fetchError) {
          throw fetchError;
        }

        // Transform database data to ClientData format with dummy data
        const transformedData: ClientData[] = (clientsData || []).map((client: ActiveClientRecord, index: number) => ({
          person_id: client.person_id,
          name: `${client.first_name} ${client.last_name}`,
          dateStarted: generateDummyDateStarted(client.created_at),
          provider: generateDummyProvider(index),
          email: client.email || '',
          phone: client.phone || '',
          growthStage: generateDummyGrowthStage(index),
          status: client.status,
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching active clients:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch clients');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveClients();
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
};