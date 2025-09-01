import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrganizationData {
  // app_organizations fields
  id?: string;
  organization_name: string;
  organization_state: string;
}

interface OrganizationSettingsData {
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
}

interface OrganizationDomain {
  id?: string;
  protocol: string;
  domain: string;
}

export interface OrganizationFormData extends OrganizationData, OrganizationSettingsData {
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

      // Get current user's organization
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Get app_users record
      const { data: appUser } = await supabase
        .from('app_users')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (!appUser) throw new Error('App user not found');

      // Get user's organization through app_organization_people
      const { data: orgPeople } = await supabase
        .from('app_organization_people')
        .select('organization_id')
        .eq('person_id', appUser.id)
        .eq('is_deleted', false)
        .single();

      if (!orgPeople) {
        // No organization found, keep default values
        setLoading(false);
        return;
      }

      // Fetch organization data
      const { data: orgData } = await supabase
        .from('app_organizations')
        .select('*')
        .eq('id', orgPeople.organization_id)
        .eq('is_deleted', false)
        .single();

      // Fetch organization settings
      const { data: settingsData } = await supabase
        .from('settings_organization')
        .select('*')
        .eq('organization_id', orgPeople.organization_id)
        .eq('is_deleted', false)
        .single();

      // Fetch organization domains
      const { data: domainsData } = await supabase
        .from('settings_organization_domains')
        .select('*')
        .eq('organization_id', orgPeople.organization_id)
        .eq('is_deleted', false);

      // Update form data with fetched data
      setFormData(prev => ({
        ...prev,
        id: orgData?.id || '',
        organization_name: orgData?.organization_name || '',
        organization_state: orgData?.organization_state || '',
        organization_logo: settingsData?.organization_logo || '',
        address_line_1: settingsData?.address_line_1 || '',
        address_line_2: settingsData?.address_line_2 || '',
        zip_cone: settingsData?.zip_cone || '',
        country: settingsData?.country || 'United States',
        default_language: settingsData?.default_language || 'English (US)',
        default_currency: settingsData?.default_currency || 'USD ($)',
        default_timezone: settingsData?.default_timezone || 'America/New_York',
        facebook_url: settingsData?.facebook_url || '',
        instagram_url: settingsData?.instagram_url || '',
        x_url: settingsData?.x_url || '',
        tiktok_url: settingsData?.tiktok_url || '',
        linkedin_url: settingsData?.linkedin_url || '',
        google_profile_url: settingsData?.google_profile_url || '',
        youtube_url: settingsData?.youtube_url || '',
        domains: domainsData?.map(d => ({
          id: d.id,
          protocol: d.protocol || 'https://',
          domain: d.domain || ''
        })) || []
      }));

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

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Get app_users record
      const { data: appUser } = await supabase
        .from('app_users')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (!appUser) throw new Error('App user not found');

      // Get user's organization
      const { data: orgPeople } = await supabase
        .from('app_organization_people')
        .select('organization_id')
        .eq('person_id', appUser.id)
        .eq('is_deleted', false)
        .single();

      if (!orgPeople) throw new Error('No organization found for user');

      const organizationId = orgPeople.organization_id;

      // Update app_organizations table
      const { error: orgError } = await supabase
        .from('app_organizations')
        .update({
          organization_name: formData.organization_name,
          organization_state: formData.organization_state,
          updated_by: appUser.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (orgError) throw orgError;

      // Upsert settings_organization table
      const { error: settingsError } = await supabase
        .from('settings_organization')
        .upsert({
          organization_id: organizationId,
          organization_logo: formData.organization_logo,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          zip_cone: formData.zip_cone,
          country: formData.country,
          default_language: formData.default_language,
          default_currency: formData.default_currency,
          default_timezone: formData.default_timezone,
          facebook_url: formData.facebook_url,
          instagram_url: formData.instagram_url,
          x_url: formData.x_url,
          tiktok_url: formData.tiktok_url,
          linkedin_url: formData.linkedin_url,
          google_profile_url: formData.google_profile_url,
          youtube_url: formData.youtube_url,
          updated_by: appUser.id,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;

      // Handle domains - delete existing and insert new ones
      const { error: deleteDomainsError } = await supabase
        .from('settings_organization_domains')
        .update({
          is_deleted: true,
          deleted_by: appUser.id,
          deleted_at: new Date().toISOString()
        })
        .eq('organization_id', organizationId)
        .eq('is_deleted', false);

      if (deleteDomainsError) throw deleteDomainsError;

      // Insert new domains
      if (formData.domains.length > 0) {
        const domainsToInsert = formData.domains
          .filter(d => d.domain.trim()) // Only insert domains with actual values
          .map(d => ({
            organization_id: organizationId,
            protocol: d.protocol,
            domain: d.domain.trim(),
            created_by: appUser.id,
            updated_by: appUser.id
          }));

        if (domainsToInsert.length > 0) {
          const { error: domainsError } = await supabase
            .from('settings_organization_domains')
            .insert(domainsToInsert);

          if (domainsError) throw domainsError;
        }
      }

      toast({
        title: 'Success',
        description: 'Organization settings saved successfully'
      });

      // Reload data to get updated information
      await loadOrganizationData();

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
