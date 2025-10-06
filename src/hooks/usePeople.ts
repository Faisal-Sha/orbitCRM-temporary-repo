import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Person {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email?: string;
  phone?: string;
}

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const { data: peopleData, error: peopleError } = await supabase
        .from('people')
        .select(`
          id,
          first_name,
          middle_name,
          last_name,
          people_contacts (
            email,
            phone
          )
        `)
        .eq('is_deleted', false)
        .order('first_name', { ascending: true });

      if (peopleError) throw peopleError;

      const formattedPeople = (peopleData || []).map(person => ({
        id: person.id,
        first_name: person.first_name,
        middle_name: person.middle_name,
        last_name: person.last_name,
        email: person.people_contacts?.[0]?.email || '',
        phone: person.people_contacts?.[0]?.phone || ''
      }));

      setPeople(formattedPeople);
    } catch (error) {
      console.error('Error loading people:', error);
      toast({
        title: 'Error',
        description: 'Failed to load people list',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  return {
    people,
    loading
  };
};
