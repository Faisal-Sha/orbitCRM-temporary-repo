import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DataLabel {
  id: string;
  name: string;
  category: string;
  color: string;
  textColor: string;
  fontWeight: string;
}

interface RpcResult {
  success: boolean;
  message?: string;
  label_id?: string;
}

export const useDataLabels = () => {
  const [labels, setLabels] = useState<DataLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_data_labels');
      if (error) throw error;

      // get_data_labels returns a JSON array (or []), already shaped with the right keys
      const arr = (data as unknown as DataLabel[]) ?? [];
      setLabels(arr);
    } catch (err: any) {
      console.error('Error fetching data labels:', err);
      setError(err.message || 'Failed to fetch data labels');
      toast.error('Failed to load labels');
    } finally {
      setLoading(false);
    }
  };

  const addLabel = async (input: {
    name: string;
    category: string;
    color: string;
    textColor: string;
    fontWeight: string;
  }) => {
    try {
      const { data, error } = await supabase.rpc('add_data_label', {
        p_label_name: input.name,
        p_label_category: input.category,
        p_label_color: input.color,
        p_text_color: input.textColor,
        p_font_weight: input.fontWeight,
      });
      if (error) throw error;

      const res = data as unknown as RpcResult;
      if (res?.success) {
        toast.success(res.message || 'Label created successfully');
        await fetchLabels();
        return { success: true };
      } else {
        const msg = res?.message || 'Failed to create label';
        toast.error(msg);
        return { success: false, error: msg };
      }
    } catch (err: any) {
      console.error('Error adding label:', err);
      const msg = err.message || 'Failed to create label';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const updateLabel = async (labelId: string, input: {
    name: string;
    category: string;
    color: string;
    textColor: string;
    fontWeight: string;
  }) => {
    try {
      const { data, error } = await supabase.rpc('update_data_label', {
        p_label_id: labelId,
        p_label_name: input.name,
        p_label_category: input.category,
        p_label_color: input.color,
        p_text_color: input.textColor,
        p_font_weight: input.fontWeight,
      });
      if (error) throw error;

      const res = data as unknown as RpcResult;
      if (res?.success) {
        toast.success(res.message || 'Label updated successfully');
        await fetchLabels();
        return { success: true };
      } else {
        const msg = res?.message || 'Failed to update label';
        toast.error(msg);
        return { success: false, error: msg };
      }
    } catch (err: any) {
      console.error('Error updating label:', err);
      const msg = err.message || 'Failed to update label';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const deleteLabel = async (labelId: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_data_label', {
        p_label_id: labelId,
      });
      if (error) throw error;

      const res = data as unknown as RpcResult;
      if (res?.success) {
        toast.success(res.message || 'Label deleted successfully');
        await fetchLabels();
        return { success: true };
      } else {
        const msg = res?.message || 'Failed to delete label';
        toast.error(msg);
        return { success: false, error: msg };
      }
    } catch (err: any) {
      console.error('Error deleting label:', err);
      const msg = err.message || 'Failed to delete label';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return {
    labels,
    loading,
    error,
    refetch: fetchLabels,
    addLabel,
    updateLabel,
    deleteLabel,
  };
};