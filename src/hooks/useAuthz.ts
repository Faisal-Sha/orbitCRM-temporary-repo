// src/hooks/useAuthz.ts
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthz = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      qc.invalidateQueries({ queryKey: ["auth", "permissions"] });
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auth", "permissions"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("current_user_permissions");
      if (error) throw error;
      return (data || []) as string[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const set = useMemo(() => new Set(data || []), [data]);

  const can = (perm: string) => set.has(perm);
  const hasAny = (perms: string[]) => perms.some(p => set.has(p));
  const hasAll = (perms: string[]) => perms.every(p => set.has(p));

  return { perms: data || [], can, hasAny, hasAll, isLoading, isError, error };
};
