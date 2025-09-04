import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DataLabel {
  id: string;
  name: string;
  category: string;
  color: string;
  textColor: string;
  fontWeight: string;
}

export const useDataLabels = () => {
  return useQuery({
    queryKey: ['data-labels'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_data_labels');
      if (error) throw error;
      return (data as unknown as DataLabel[]) || [];
    }
  });
};