import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions<T> {
  table: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: { old: T; new: T }) => void;
  onDelete?: (payload: { old: T }) => void;
  enabled?: boolean;
}

export const useRealtimeSubscription = <T = any>({
  table,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    console.log(`🔄 Setting up realtime subscription for table: ${table}`);

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
        },
        (payload) => {
          console.log(`📝 INSERT event on ${table}:`, payload);
          if (onInsert) {
            onInsert(payload.new as T);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
        },
        (payload) => {
          console.log(`✏️ UPDATE event on ${table}:`, payload);
          if (onUpdate) {
            onUpdate({ old: payload.old as T, new: payload.new as T });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
        },
        (payload) => {
          console.log(`🗑️ DELETE event on ${table}:`, payload);
          if (onDelete) {
            onDelete({ old: payload.old as T });
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Realtime subscription status for ${table}:`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log(`🔌 Unsubscribing from ${table} realtime`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, onInsert, onUpdate, onDelete, enabled]);

  return channelRef.current;
};