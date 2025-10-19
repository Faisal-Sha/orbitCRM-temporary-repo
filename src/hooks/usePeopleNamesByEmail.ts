import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to fetch people names by their email addresses
 * Returns a map of email -> full name
 */
export const usePeopleNamesByEmail = (emails: (string | null | undefined)[]) => {
  const validEmails = emails.filter((email): email is string => !!email);
  
  return useQuery({
    queryKey: ['peopleNamesByEmail', validEmails],
    queryFn: async () => {
      if (validEmails.length === 0) {
        return {};
      }

      const { data, error } = await supabase
        .from('people_contacts')
        .select(`
          email,
          people:person_id (
            first_name,
            last_name
          )
        `)
        .in('email', validEmails)
        .eq('is_deleted', false);

      if (error) {
        console.error('Error fetching people names by email:', error);
        return {};
      }

      // Transform to a map of email -> full name
      const emailToNameMap: Record<string, string> = {};
      
      data?.forEach((contact: any) => {
        if (contact.email && contact.people) {
          const firstName = contact.people.first_name || '';
          const lastName = contact.people.last_name || '';
          emailToNameMap[contact.email] = `${firstName} ${lastName}`.trim();
        }
      });

      return emailToNameMap;
    },
    enabled: validEmails.length > 0,
    staleTime: 300000, // 5 minutes
  });
};
