import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeadRecord {
  lead_id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export const useLeads = () => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async (): Promise<LeadRecord[]> => {
      const { data, error } = await supabase.rpc("get_leads_data");
      
      if (error) {
        console.error("Failed to fetch leads:", error);
        throw new Error(`Failed to fetch leads: ${error.message}`);
      }
      
      return (data as LeadRecord[]) || [];
    },
  });
};