import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface OrganizationDomain {
  id?: string;
  protocol: string;
  domain: string;
}

export interface OrganizationFormData {
  // app_organizations fields
  id?: string;
  organization_name: string;
  organization_state: string;
  // settings_organization fields  
  organization_logo: string;
  address_line_1: string;
  address_line_2: string;
  zip_cone: string; // Note: typo in DB schema
  country: string;
  default_language: string;
  default_currency: string;
  default_timezone: string;
  facebook_url: string;
  instagram_url: string;
  x_url: string;
  tiktok_url: string;
  linkedin_url: string;
  google_profile_url: string;
  youtube_url: string;
  domains: OrganizationDomain[];
}

export const useOrganizationSettings = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    organization_name: '',
    organization_state: '',
    organization_logo: '',
    address_line_1: '',
    address_line_2: '',
    zip_cone: '',
    country: 'United States',
    default_language: 'English (US)',
    default_currency: 'USD ($)',
    default_timezone: 'America/New_York',
    facebook_url: '',
    instagram_url: '',
    x_url: '',
    tiktok_url: '',
    linkedin_url: '',
    google_profile_url: '',
    youtube_url: '',
    domains: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadOrganizationData = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session error');
      }
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log('User authenticated, calling get_organization_settings...');
      
      // Use the database function to get organization settings
      const { data, error } = await supabase.rpc('get_organization_settings');
      
      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }

      if (data && typeof data === 'object' && 'success' in data) {
        const result = data as any;
        
        if (result.success && result.organization && result.settings) {
          const org = result.organization;
          const settings = result.settings;
          const domains = result.domains || [];

          // Update form data with fetched data
          setFormData(prev => ({
            ...prev,
            id: org.id || '',
            organization_name: org.organization_name || '',
            organization_state: org.organization_state || '',
            organization_logo: settings.organization_logo || '',
            address_line_1: settings.address_line_1 || '',
            address_line_2: settings.address_line_2 || '',
            zip_cone: settings.zip_cone || '',
            country: settings.country || 'United States',
            default_language: settings.default_language || 'English (US)',
            default_currency: settings.default_currency || 'USD ($)',
            default_timezone: settings.default_timezone || 'America/New_York',
            facebook_url: settings.facebook_url || '',
            instagram_url: settings.instagram_url || '',
            x_url: settings.x_url || '',
            tiktok_url: settings.tiktok_url || '',
            linkedin_url: settings.linkedin_url || '',
            google_profile_url: settings.google_profile_url || '',
            youtube_url: settings.youtube_url || '',
            domains: domains.map((d: any) => ({
              id: d.id,
              protocol: d.protocol || 'https://',
              domain: d.domain || ''
            }))
          }));
        }
      }

    } catch (error) {
      console.error('Error loading organization data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organization data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: keyof OrganizationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      domains: [...prev.domains, { protocol: 'https://', domain: '' }]
    }));
  };

  const updateDomain = (index: number, field: 'protocol' | 'domain', value: string) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.map((domain, i) => 
        i === index ? { ...domain, [field]: value } : domain
      )
    }));
  };

  const removeDomain = (index: number) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
  };

  const saveOrganizationSettings = async () => {
    try {
      setSaving(true);

      // Use the database function to save organization settings
      const { data, error } = await supabase.rpc('save_organization_settings', {
        p_organization_name: formData.organization_name,
        p_organization_state: formData.organization_state,
        p_address_line_1: formData.address_line_1,
        p_address_line_2: formData.address_line_2,
        p_zip_cone: formData.zip_cone,
        p_country: formData.country,
        p_default_language: formData.default_language,
        p_default_currency: formData.default_currency,
        p_default_timezone: formData.default_timezone,
        p_facebook_url: formData.facebook_url,
        p_instagram_url: formData.instagram_url,
        p_x_url: formData.x_url,
        p_tiktok_url: formData.tiktok_url,
        p_linkedin_url: formData.linkedin_url,
        p_google_profile_url: formData.google_profile_url,
        p_youtube_url: formData.youtube_url,
        p_domains: formData.domains.filter(d => d.domain.trim()) as unknown as Json
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'success' in data) {
        const result = data as any;
        
        if (result.success) {
          toast({
            title: 'Success',
            description: result.message || 'Organization settings saved successfully'
          });

          // Reload data to get updated information
          await loadOrganizationData();
        } else {
          throw new Error(result.message || 'Failed to save organization settings');
        }
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error saving organization settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save organization settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadOrganizationData();
  }, []);

  return {
    formData,
    loading,
    saving,
    updateFormField,
    addDomain,
    updateDomain,
    removeDomain,
    saveOrganizationSettings
  };
};
