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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPersonId, setCurrentPersonId] = useState<string | null>(null);

  // Get current user and their person ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          console.log('🔑 Current user ID:', user.id);
          
          // First, get the app_user record
          const { data: appUserData, error: appUserError } = await supabase
            .from('app_users')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (appUserError) {
            console.error('❌ Error fetching app_user:', appUserError);
            return;
          }
          
          if (!appUserData) {
            console.error('❌ No app_user found for user ID:', user.id);
            return;
          }
          
          console.log('📱 App user ID:', appUserData.id);
          
          // Then, get the person record
          const { data: personData, error: personError } = await supabase
            .from('people')
            .select('id')
            .eq('user_account_id', appUserData.id)
            .single();
            
          if (personError) {
            console.error('❌ Error fetching person:', personError);
            return;
          }
          
          if (personData) {
            setCurrentPersonId(personData.id);
            console.log('🧑 Current person ID:', personData.id);
          } else {
            console.error('❌ No person found for app_user ID:', appUserData.id);
          }
        }
      } catch (error) {
        console.error('❌ Error in getCurrentUser:', error);
      }
    };
    
    getCurrentUser();
  }, []);

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

  const updateProfileFromPayload = (newData: any) => {
    // Only update if this is the current user's data
    if (!currentPersonId || newData.id !== currentPersonId) {
      console.log('🚫 Ignoring profile update for different user:', { 
        receivedPersonId: newData.id, 
        currentPersonId,
        currentUserId 
      });
      return;
    }

    console.log('✅ Updating profile for current user:', newData);
    setProfileData(prev => ({
      ...prev,
      first_name: newData.first_name || prev.first_name,
      middle_name: newData.middle_name || prev.middle_name,
      last_name: newData.last_name || prev.last_name,
      bio: newData.user_profile_bio || prev.bio,
      profile_pic: newData.user_profile_pic || prev.profile_pic,
    }));
  };

  const updateContactsFromPayload = (newData: any) => {
    // Only update if this is the current user's contacts
    if (!currentPersonId || newData.person_id !== currentPersonId) {
      console.log('🚫 Ignoring contacts update for different user:', { 
        receivedPersonId: newData.person_id, 
        currentPersonId,
        currentUserId 
      });
      return;
    }

    console.log('✅ Updating contacts for current user:', newData);
    setProfileData(prev => ({
      ...prev,
      email: newData.email || prev.email,
      phone: newData.phone || prev.phone,
      address_line_1: newData.address_line_1 || prev.address_line_1,
      address_line_2: newData.address_line_2 || prev.address_line_2,
      city: newData.city || prev.city,
      state: newData.state || prev.state,
      zip_code: newData.zip_code || prev.zip_code,
      facebook: newData.url_facebook || prev.facebook,
      instagram: newData.url_instagram || prev.instagram,
      tiktok: newData.url_tiktok || prev.tiktok,
      linkedin: newData.url_linkedin || prev.linkedin,
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, []);

  // Set up realtime subscription for people table - only after person ID is available
  useRealtimeSubscription<any>({
    table: 'people',
    enabled: !!currentPersonId, // Only enable when we have a person ID
    onInsert: ({ new: newData }) => {
      console.log('🧑➕ People table INSERT event:', newData);
      updateProfileFromPayload(newData);
    },
    onUpdate: ({ new: newData }) => {
      console.log('🧑✏️ People table UPDATE event:', newData);
      updateProfileFromPayload(newData);
    },
    onDelete: ({ old: oldData }) => {
      console.log('🧑❌ People table DELETE event:', oldData);
      // Handle deletion if needed
    },
  });

  // Set up realtime subscription for people_contacts table - only after person ID is available
  useRealtimeSubscription<any>({
    table: 'people_contacts',
    enabled: !!currentPersonId, // Only enable when we have a person ID
    onInsert: ({ new: newData }) => {
      console.log('📞➕ People contacts INSERT event:', newData);
      updateContactsFromPayload(newData);
    },
    onUpdate: ({ new: newData }) => {
      console.log('📞✏️ People contacts UPDATE event:', newData);
      updateContactsFromPayload(newData);
    },
    onDelete: ({ old: oldData }) => {
      console.log('📞❌ People contacts DELETE event:', oldData);
      // Handle deletion if needed
    },
  });

  return {
    profileData,
    loading,
    refetch: fetchProfile,
  };
};