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
      // Get people who have referral records
      const { data, error } = await supabase
        .from('people')
        .select(`
          id,
          first_name,
          last_name,
          status,
          created_at,
          people_contacts(email, phone),
          people_referrals(referred_by_name)
        `)
        .not('people_referrals', 'is', null)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Failed to fetch referrals:", error);
        throw new Error(`Failed to fetch referrals: ${error.message}`);
      }
      
      // Transform data to match expected format
      const referralData = (data || []).map(person => ({
        lead_id: person.id,
        person_id: person.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.people_contacts?.[0]?.email || null,
        phone: person.people_contacts?.[0]?.phone || null,
        created_at: person.created_at,
        lead_goals: null,
        preferences: null,
        expectation: null,
        note: null,
        status: person.status
      })) as ReferralRecord[];
      
      return referralData;
    },
  });
};