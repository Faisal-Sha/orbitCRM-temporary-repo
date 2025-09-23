import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface ReferralRecord {
  lead_id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  lead_goals: string | null;
  preferences: string | null;
  expectation: string | null;
  note: string | null;
  status: string;
}

export const useReferrals = () => {
  const queryClient = useQueryClient();

  // Subscribe to real-time updates for person status changes
  useEffect(() => {
    const channel = supabase
      .channel('person-status-changes-referrals')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'people',
          filter: 'status=eq.Referral'
        },
        () => {
          // Invalidate and refetch the referrals data when status changes
          queryClient.invalidateQueries({ queryKey: ["referrals"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["referrals"],
    queryFn: async (): Promise<ReferralRecord[]> => {
      const { data, error } = await supabase.rpc("get_leads_data");
      
      if (error) {
        console.error("Failed to fetch referrals:", error);
        throw new Error(`Failed to fetch referrals: ${error.message}`);
      }
      
      // Filter for referrals only
      const referralData = (data as ReferralRecord[])?.filter(record => record.status === 'Referral') || [];
      
      return referralData;
    },
  });
};