import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StaffMember } from '@/components/people/staff/types';

interface ActiveStaffData {
  person_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  created_at: string;
}

const generateDummyStaffData = (realData: ActiveStaffData): StaffMember => {
  const contributions = ["High", "Medium", "Low"];
  const growthStages: ("foundation" | "developing" | "established")[] = ["foundation", "developing", "established"];
  
  // Generate dummy join date (random date in the last 2 years)
  const randomDays = Math.floor(Math.random() * 730);
  const joinDate = new Date();
  joinDate.setDate(joinDate.getDate() - randomDays);
  
  return {
    person_id: realData.person_id,
    name: `${realData.first_name} ${realData.last_name}`,
    joinDate: joinDate.toLocaleDateString(),
    contribution: contributions[Math.floor(Math.random() * contributions.length)],
    email: realData.email || '',
    phone: realData.phone || '',
    growthStage: growthStages[Math.floor(Math.random() * growthStages.length)],
    status: realData.status,
    created_at: realData.created_at
  };
};

export const useActiveStaff = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_active_staff_data');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const transformedData = data.map((staff: ActiveStaffData) => 
          generateDummyStaffData(staff)
        );
        setStaffData(transformedData);
      } else {
        setStaffData([]);
      }
    } catch (error: any) {
      console.error('Error fetching active staff:', error);
      setError(error.message || 'Failed to fetch active staff');
      toast.error('Failed to load active staff');
      setStaffData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveStaff();

    // Set up real-time subscription for staff changes
    const staffSubscription = supabase
      .channel('active-staff-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'people',
          filter: 'status=in.(active,on leave)' 
        }, 
        () => {
          fetchActiveStaff();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'people_contacts' 
        }, 
        () => {
          fetchActiveStaff();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(staffSubscription);
    };
  }, []);

  return {
    staffData,
    loading,
    error,
    refetch: fetchActiveStaff
  };
};