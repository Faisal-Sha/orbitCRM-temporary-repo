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

      const { data, error } = await supabase
        .from('cal_calendar_users')
        .select('*')
        .eq('created_by', user.id)
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      if (newSettings.id) {
        // Update existing
        const { error } = await supabase
          .from('cal_calendar_users')
          .update({
            calendar_owner_id: newSettings.calendar_owner_id,
            appointment_type: newSettings.appointment_type,
            calendar_url: newSettings.calendar_url,
            updated_by: user.id
          })
          .eq('id', newSettings.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('cal_calendar_users')
          .insert({
            calendar_owner_id: newSettings.calendar_owner_id,
            appointment_type: newSettings.appointment_type,
            calendar_url: newSettings.calendar_url,
            created_by: user.id,
            updated_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
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
    } catch (error) {
      console.error('Error saving calendar settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save calendar settings',
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
