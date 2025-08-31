import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface ProfileData {
  first_name: string;
  middle_name: string;
  last_name: string;
  bio: string;
  profile_pic: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip_code: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
}

export const useRealtimeProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    bio: '',
    profile_pic: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.rpc('get_personal_profile');
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const profileResponse = data as any;
        setProfileData({
          first_name: profileResponse.first_name || '',
          middle_name: profileResponse.middle_name || '',
          last_name: profileResponse.last_name || '',
          bio: profileResponse.bio || '',
          profile_pic: profileResponse.profile_pic || '',
          email: profileResponse.email || '',
          phone: profileResponse.phone || '',
          address_line_1: profileResponse.address_line_1 || '',
          address_line_2: profileResponse.address_line_2 || '',
          city: profileResponse.city || '',
          state: profileResponse.state || '',
          zip_code: profileResponse.zip_code || '',
          facebook: profileResponse.facebook || '',
          instagram: profileResponse.instagram || '',
          tiktok: profileResponse.tiktok || '',
          linkedin: profileResponse.linkedin || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, []);

  // Set up realtime subscription for people table
  useRealtimeSubscription<any>({
    table: 'people',
    onUpdate: () => {
      fetchProfile();
    },
  });

  // Set up realtime subscription for people_contacts table
  useRealtimeSubscription<any>({
    table: 'people_contacts',
    onUpdate: () => {
      fetchProfile();
    },
  });

  return {
    profileData,
    loading,
    refetch: fetchProfile,
  };
};