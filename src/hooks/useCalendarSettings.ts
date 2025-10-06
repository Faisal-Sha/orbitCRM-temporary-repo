import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CalendarSettings {
  id?: string;
  calendar_owner_id: string;
  appointment_type: string;
  calendar_url: string;
}

export const useCalendarSettings = () => {
  const [settings, setSettings] = useState<CalendarSettings>({
    calendar_owner_id: '',
    appointment_type: '',
    calendar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Get app_users.id from auth.users.id
      const { data: appUser } = await supabase
        .from('app_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!appUser) throw new Error('User profile not found');

      const { data, error } = await supabase
        .from('cal_calendar_users')
        .select('*')
        .eq('created_by', appUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          calendar_owner_id: data.calendar_owner_id || '',
          appointment_type: data.appointment_type || '',
          calendar_url: data.calendar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading calendar settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: CalendarSettings) => {
    try {
      setSaving(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error');
      }
      
      if (!user) throw new Error('User not authenticated');

      // Get app_users.id from auth.users.id
      const { data: appUser, error: appUserError } = await supabase
        .from('app_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (appUserError || !appUser) {
        console.error('App user error:', appUserError);
        throw new Error('Could not find user profile');
      }

      console.log('Saving settings for app_user:', appUser.id);
      console.log('Settings:', newSettings);

      if (newSettings.id) {
        // Update existing
        console.log('Updating existing record:', newSettings.id);
        const { error } = await supabase
          .from('cal_calendar_users')
          .update({
            calendar_owner_id: newSettings.calendar_owner_id,
            appointment_type: newSettings.appointment_type,
            calendar_url: newSettings.calendar_url,
            updated_by: appUser.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', newSettings.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // Create new
        console.log('Creating new record');
        const { data, error } = await supabase
          .from('cal_calendar_users')
          .insert([{
            calendar_owner_id: newSettings.calendar_owner_id,
            appointment_type: newSettings.appointment_type,
            calendar_url: newSettings.calendar_url,
            created_by: appUser.id,
            updated_by: appUser.id
          }])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Insert successful:', data);
        
        if (data) {
          setSettings({ ...newSettings, id: data.id });
        }
      }

      toast({
        title: 'Success',
        description: 'Calendar settings saved successfully'
      });

      await loadSettings();
      return true;
    } catch (error: any) {
      console.error('Error saving calendar settings:', error);
      const errorMessage = error?.message || 'Failed to save calendar settings';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    saveSettings
  };
};
