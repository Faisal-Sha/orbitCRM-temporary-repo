import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/** ---- Types that match the DB function shape (raw) ---- **/
interface PersonalInfo {
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  user_profile_bio?: string | null;
  user_profile_pic?: string | null;
  status?: string | null;
}

interface ContactInfo {
  email?: string | null;
  work_email?: string | null;
  phone?: string | null;
  phone_home?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  url_facebook?: string | null;
  url_instagram?: string | null;
  url_tiktok?: string | null;
  url_linkedin?: string | null;
}

interface ContactField {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'url' | 'select';
}

interface Identifiers {
  date_of_birth?: string | null; // ISO date
  ssn_number?: string | null;
  npi_number?: string | null;
  insurance_provider?: string | null;
  insurance_number?: string | null;
  insurance_expiration_date?: string | null; // ISO date
  gender_identity?: string | null;
  ethnicity_identity?: string | null;
  marital_status?: string | null;
  living_situation?: string | null;
}

interface EmergencyContact {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  relationship?: string | null;
}

interface ReferralInfo {
  referral_type?: string | null;
  referral_relationship?: string | null;
  referred_by_name?: string | null;
  referral_note?: string | null;
}

interface LeadInfo {
  preferred_language?: string | null;
  lead_goals?: string | null;
  preferences?: string | null;
  expectation?: string | null;
  note?: string | null;
}

interface RoleItem {
  role_id: string;
  role_name: string;
}

interface StaffTypeItem {
  staff_type_id: string;
  staff_type: string;
}

export interface UserProfileRaw {
  personal_info?: PersonalInfo | null;
  contact_info?: ContactInfo | null;
  identifiers?: Identifiers | null;
  emergency_contact?: EmergencyContact | null;
  referral_info?: ReferralInfo | null;
  lead_info?: LeadInfo | null;
  user_roles?: RoleItem[] | null;
  staff_types?: StaffTypeItem[] | null;
}

/** ---- Display helpers / normalized result ---- **/
export interface UserProfileDisplay {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo & {
    address: string; // combined address ready for UI
  };
  additionalInfo: Identifiers & {
    ssn_masked: string;          // ***-**-1234
    insurance_expiry_display: string; // e.g., Dec 2025
    dob_display: string;         // e.g., Jan 1, 1990
  };
  emergencyContact: EmergencyContact & {
    full_name: string;
  };
  referralInfo: ReferralInfo;
  leadInfo: LeadInfo;
  userRoles: RoleItem[];     // array (possibly empty)
  staffTypes: StaffTypeItem[]; // array (possibly empty)
}

interface RpcArgs {
  p_person_id: string;
}

/** ---- Internal small utils ---- **/
const orNA = (v?: string | null, fallback = 'Not provided') =>
  (v && String(v).trim().length > 0) ? String(v).trim() : fallback;

const maskSSN = (ssn?: string | null) => {
  if (!ssn) return 'Not provided';
  // Normalize to digits only; then take last 4
  const digits = ssn.replace(/\D/g, '');
  const tail = digits.slice(-4);
  return tail ? `***-**-${tail}` : 'Not provided';
};

const formatMonthYear = (iso?: string | null) => {
  if (!iso) return 'Not provided';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Not provided';
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const formatDateNice = (iso?: string | null) => {
  if (!iso) return 'Not provided';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Not provided';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const combineAddress = (c?: ContactInfo | null) => {
  if (!c) return 'Not provided';
  const parts = [
    orNA(c.address_line_1, ''), 
    orNA(c.address_line_2, ''), 
    orNA(c.city, ''), 
    orNA(c.state, ''), 
    orNA(c.zip_code, '')
  ].filter(Boolean);
  const s = parts.join(', ').replace(/(^,\s*|,\s*,)/g, '').trim();
  return s.length > 0 ? s : 'Not provided';
};

/** ---- Hook ---- **/
export const useUserProfile = (personId?: string) => {
  const [data, setData] = useState<UserProfileDisplay | null>(null);
  const [raw, setRaw] = useState<UserProfileRaw | null>(null); // keep raw if needed later
  const [loading, setLoading] = useState<boolean>(!!personId);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (pid: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_profile_data', {
        p_person_id: pid,
      } as RpcArgs);

      if (error) throw error;

      const payload = (data || {}) as UserProfileRaw;
      setRaw(payload);

      // Normalize to display-friendly structure
      const personal = payload.personal_info || {};
      const contact = payload.contact_info || {};
      const identifiers = payload.identifiers || {};
      const emergency = payload.emergency_contact || {};
      const referral = payload.referral_info || {};
      const lead = payload.lead_info || {};
      const roles = (payload.user_roles || []) as RoleItem[];
      const staff = (payload.staff_types || []) as StaffTypeItem[];

      const normalized: UserProfileDisplay = {
        personalInfo: {
          first_name: personal.first_name ?? null,
          middle_name: personal.middle_name ?? null,
          last_name: personal.last_name ?? null,
          user_profile_bio: personal.user_profile_bio ?? null,
          user_profile_pic: personal.user_profile_pic ?? null,
          status: personal.status ?? null,
        },
        contactInfo: {
          email: contact.email ?? null,
          work_email: contact.work_email ?? null,
          phone: contact.phone ?? null,
          phone_home: contact.phone_home ?? null,
          address_line_1: contact.address_line_1 ?? null,
          address_line_2: contact.address_line_2 ?? null,
          city: contact.city ?? null,
          state: contact.state ?? null,
          zip_code: contact.zip_code ?? null,
          url_facebook: contact.url_facebook ?? null,
          url_instagram: contact.url_instagram ?? null,
          url_tiktok: contact.url_tiktok ?? null,
          url_linkedin: contact.url_linkedin ?? null,
          address: combineAddress(contact), // ready-to-render single string
        },
        additionalInfo: {
          date_of_birth: identifiers.date_of_birth ?? null,
          ssn_number: identifiers.ssn_number ?? null,
          npi_number: identifiers.npi_number ?? null,
          insurance_provider: identifiers.insurance_provider ?? null,
          insurance_number: identifiers.insurance_number ?? null,
          insurance_expiration_date: identifiers.insurance_expiration_date ?? null,
          gender_identity: identifiers.gender_identity ?? null,
          ethnicity_identity: identifiers.ethnicity_identity ?? null,
          marital_status: identifiers.marital_status ?? null,
          living_situation: identifiers.living_situation ?? null,
          ssn_masked: maskSSN(identifiers.ssn_number),
          insurance_expiry_display: formatMonthYear(identifiers.insurance_expiration_date),
          dob_display: formatDateNice(identifiers.date_of_birth),
        },
        emergencyContact: {
          first_name: emergency.first_name ?? null,
          last_name: emergency.last_name ?? null,
          email: emergency.email ?? null,
          phone_number: emergency.phone_number ?? null,
          relationship: emergency.relationship ?? null,
          full_name: [orNA(emergency.first_name, ''), orNA(emergency.last_name, '')]
            .filter(Boolean)
            .join(' ')
            .trim() || 'Not provided',
        },
        referralInfo: {
          referral_type: referral.referral_type ?? null,
          referral_relationship: referral.referral_relationship ?? null,
          referred_by_name: referral.referred_by_name ?? null,
          referral_note: referral.referral_note ?? null,
        },
        leadInfo: {
          preferred_language: lead.preferred_language ?? null,
          lead_goals: lead.lead_goals ?? null,
          preferences: lead.preferences ?? null,
          expectation: lead.expectation ?? null,
          note: lead.note ?? null,
        },
        userRoles: roles || [],
        staffTypes: staff || [],
      };

      setData(normalized);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      const msg = err?.message || 'Failed to fetch user profile';
      setError(msg);
      toast.error(msg.includes('Access denied')
        ? 'Access denied. You do not have permission to view this profile.'
        : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Contact management functions
  const updateContactField = useCallback(async (fieldName: string, value: string) => {
    if (!personId) return false;
    
    try {
      if (fieldName === 'email') {
        // Use comprehensive edge function for email updates to ensure transactional consistency
        const { data: result, error } = await supabase.functions.invoke(
          'update-contact-email-comprehensive',
          {
            body: {
              person_id: personId,
              new_email: value
            }
          }
        );

        if (error) throw error;
        
        if (result && result.success) {
          toast.success(result.message || 'Email updated successfully across all systems');
          // Refetch data to get updated values
          await fetchProfile(personId);
          return true;
        } else {
          throw new Error(result?.message || 'Email update failed');
        }
      } else {
        // Use existing DB function for other contact field updates
        const { data: result, error } = await supabase
          .rpc('update_people_contact_field', {
            p_person_id: personId,
            p_field_name: fieldName,
            p_field_value: value
          });

        if (error) throw error;
        
        if (result && typeof result === 'object' && 'success' in result && result.success) {
          toast.success('Contact field updated successfully');
          // Refetch data to get updated values
          await fetchProfile(personId);
          return true;
        } else {
          throw new Error((result as any)?.message || 'Update failed');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update contact field');
      return false;
    }
  }, [personId]);

  const updateContactAddress = useCallback(async (address: {
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  }) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('update_people_contact_address', {
          p_person_id: personId,
          p_address_line_1: address.address_line_1 || null,
          p_address_line_2: address.address_line_2 || null,
          p_city: address.city || null,
          p_state: address.state || null,
          p_zip_code: address.zip_code || null
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Address updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update address');
      return false;
    }
  }, [personId]);

  const updatePersonName = useCallback(async (name: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  }) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('update_people_name_field', {
          p_person_id: personId,
          p_first_name: name.first_name,
          p_middle_name: name.middle_name || null,
          p_last_name: name.last_name
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Name updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update name');
      return false;
    }
  }, [personId]);

  const deleteContactField = useCallback(async (fieldName: string) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('delete_people_contact_field', {
          p_person_id: personId,
          p_field_name: fieldName
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Contact field cleared successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Delete failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete contact field');
      return false;
    }
  }, [personId]);

  // Helper to get available contact fields for dropdown
  const getAvailableContactFields = useCallback(() => {
    const allFields = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'work_email', label: 'Work Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'phone_home', label: 'Home Phone' },
      { key: 'address', label: 'Address' },
      { key: 'url_facebook', label: 'Facebook' },
      { key: 'url_instagram', label: 'Instagram' },
      { key: 'url_tiktok', label: 'TikTok' },
      { key: 'url_linkedin', label: 'LinkedIn' }
    ];

    if (!data?.contactInfo && !data?.personalInfo) return allFields;

    const existingFields = new Set();
    if (data?.personalInfo?.first_name || data?.personalInfo?.last_name) existingFields.add('name');
    if (data?.contactInfo?.email) existingFields.add('email');
    if (data?.contactInfo?.work_email) existingFields.add('work_email');
    if (data?.contactInfo?.phone) existingFields.add('phone');
    if (data?.contactInfo?.phone_home) existingFields.add('phone_home');
    if (data?.contactInfo?.address && data.contactInfo.address !== 'Not provided') existingFields.add('address');
    if (data?.contactInfo?.url_facebook) existingFields.add('url_facebook');
    if (data?.contactInfo?.url_instagram) existingFields.add('url_instagram');
    if (data?.contactInfo?.url_tiktok) existingFields.add('url_tiktok');
    if (data?.contactInfo?.url_linkedin) existingFields.add('url_linkedin');

    return allFields.filter(field => !existingFields.has(field.key));
  }, [data?.contactInfo, data?.personalInfo]);

  // Helper to get current contact fields for display
  const getCurrentContactFields = useCallback((): ContactField[] => {
    if (!data?.contactInfo && !data?.personalInfo) return [];

    const fields: ContactField[] = [];
    
    if (data?.personalInfo?.first_name || data?.personalInfo?.last_name) {
      const fullName = [data.personalInfo.first_name, data.personalInfo.middle_name, data.personalInfo.last_name]
        .filter(Boolean)
        .join(' ');
      fields.push({ key: 'name', label: 'Name', value: fullName, type: 'text' });
    }
    if (data?.contactInfo?.email) {
      fields.push({ key: 'email', label: 'Email', value: data.contactInfo.email, type: 'text' });
    }
    if (data?.contactInfo?.work_email) {
      fields.push({ key: 'work_email', label: 'Work Email', value: data.contactInfo.work_email, type: 'text' });
    }
    if (data?.contactInfo?.phone) {
      fields.push({ key: 'phone', label: 'Phone', value: data.contactInfo.phone, type: 'text' });
    }
    if (data?.contactInfo?.phone_home) {
      fields.push({ key: 'phone_home', label: 'Home Phone', value: data.contactInfo.phone_home, type: 'text' });
    }
    if (data?.contactInfo?.address && data.contactInfo.address !== 'Not provided') {
      fields.push({ key: 'address', label: 'Address', value: data.contactInfo.address, type: 'text' });
    }
    if (data?.contactInfo?.url_facebook) {
      fields.push({ key: 'url_facebook', label: 'Facebook', value: data.contactInfo.url_facebook, type: 'url' });
    }
    if (data?.contactInfo?.url_instagram) {
      fields.push({ key: 'url_instagram', label: 'Instagram', value: data.contactInfo.url_instagram, type: 'url' });
    }
    if (data?.contactInfo?.url_tiktok) {
      fields.push({ key: 'url_tiktok', label: 'TikTok', value: data.contactInfo.url_tiktok, type: 'url' });
    }
    if (data?.contactInfo?.url_linkedin) {
      fields.push({ key: 'url_linkedin', label: 'LinkedIn', value: data.contactInfo.url_linkedin, type: 'url' });
    }

    return fields;
  }, [data?.contactInfo, data?.personalInfo]);

  // Additional information management functions
  const updateAdditionalField = useCallback(async (field: string, value: string): Promise<boolean> => {
    if (!personId) return false;
    
    try {
      let result: any;
      let error: any;
      
      // Determine which function to call based on field
      if (['date_of_birth', 'ssn_number', 'npi_number', 'insurance_provider', 'insurance_number', 'insurance_expiration_date', 'gender_identity', 'ethnicity_identity', 'marital_status', 'living_situation'].includes(field)) {
        const response = await supabase.rpc('update_people_identifiers_field' as any, {
          p_person_id: personId,
          p_field_name: field,
          p_field_value: value
        });
        result = response.data;
        error = response.error;
      } else if (field === 'preferred_language') {
        const response = await supabase.rpc('update_people_leads_field' as any, {
          p_person_id: personId,
          p_field_name: field,
          p_field_value: value
        });
        result = response.data;
        error = response.error;
      } else if (field === 'referred_by_name') {
        const response = await supabase.rpc('update_people_referrals_field' as any, {
          p_person_id: personId,
          p_field_name: field,
          p_field_value: value
        });
        result = response.data;
        error = response.error;
      } else {
        throw new Error('Invalid field name');
      }

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Additional field updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update additional field');
      return false;
    }
  }, [personId]);

  const deleteAdditionalField = useCallback(async (field: string): Promise<boolean> => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase.rpc('delete_people_additional_field' as any, {
        p_person_id: personId,
        p_field_name: field
      });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Additional field cleared successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Delete failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete additional field');
      return false;
    }
  }, [personId]);

  // Additional information field management
  const getAvailableAdditionalFields = useCallback(() => {
    const allAdditionalFields = [
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date' as const },
      { key: 'ssn_number', label: 'SSN', type: 'text' as const },
      { key: 'npi_number', label: 'NPI Number', type: 'text' as const },
      { key: 'insurance_provider', label: 'Insurance Provider', type: 'text' as const },
      { key: 'insurance_number', label: 'Insurance Number', type: 'text' as const },
      { key: 'insurance_expiration_date', label: 'Insurance Expiry Date', type: 'date' as const },
      { key: 'gender_identity', label: 'Gender Identity', type: 'select' as const },
      { key: 'ethnicity_identity', label: 'Ethnicity', type: 'select' as const },
      { key: 'marital_status', label: 'Marital Status', type: 'select' as const },
      { key: 'living_situation', label: 'Living Situation', type: 'select' as const },
      { key: 'preferred_language', label: 'Preferred Language', type: 'select' as const },
      { key: 'referred_by_name', label: 'Referred By', type: 'text' as const },
    ];
    
    if (!data?.additionalInfo) return allAdditionalFields;

    return allAdditionalFields.filter(field => {
      const value = (data as any)[field.key] || (data.additionalInfo as any)?.[field.key] || (data.leadInfo as any)?.[field.key] || (data.referralInfo as any)?.[field.key];
      return !value || value === 'Not provided' || value === 'N/A';
    });
  }, [data]);

  const getCurrentAdditionalFields = useCallback(() => {
    if (!data) return [];
    
    const allAdditionalFields = [
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date' as const },
      { key: 'ssn_number', label: 'SSN', type: 'text' as const },
      { key: 'npi_number', label: 'NPI Number', type: 'text' as const },
      { key: 'insurance_provider', label: 'Insurance Provider', type: 'text' as const },
      { key: 'insurance_number', label: 'Insurance Number', type: 'text' as const },
      { key: 'insurance_expiration_date', label: 'Insurance Expiry Date', type: 'date' as const },
      { key: 'gender_identity', label: 'Gender Identity', type: 'select' as const },
      { key: 'ethnicity_identity', label: 'Ethnicity', type: 'select' as const },
      { key: 'marital_status', label: 'Marital Status', type: 'select' as const },
      { key: 'living_situation', label: 'Living Situation', type: 'select' as const },
      { key: 'preferred_language', label: 'Preferred Language', type: 'select' as const },
      { key: 'referred_by_name', label: 'Referred By', type: 'text' as const },
    ];

    return allAdditionalFields
      .map(field => {
        let value = '';
        if (['date_of_birth', 'ssn_number', 'npi_number', 'insurance_provider', 'insurance_number', 'insurance_expiration_date', 'gender_identity', 'ethnicity_identity', 'marital_status', 'living_situation'].includes(field.key)) {
          value = (data.additionalInfo as any)?.[field.key] || '';
        } else if (field.key === 'preferred_language') {
          value = data.leadInfo?.preferred_language || '';
        } else if (field.key === 'referred_by_name') {
          value = data.referralInfo?.referred_by_name || '';
        }
        
        return {
          ...field,
          value: value || ''
        };
      })
      .filter(field => field.value && field.value !== 'Not provided' && field.value !== 'N/A');
  }, [data]);

  const refetch = async () => {
    if (!personId) return;
    await fetchProfile(personId);
  };

  useEffect(() => {
    if (personId) {
      fetchProfile(personId);
    } else {
      setLoading(false);
      setData(null);
      setRaw(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId]);

  // Emergency contact management functions
  const updateEmergencyField = useCallback(async (fieldName: string, fieldValue: string) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('update_people_emergency_field', {
          p_person_id: personId,
          p_field_name: fieldName,
          p_field_value: fieldValue
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && (result as any).success) {
        toast.success('Emergency contact updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update emergency contact');
      return false;
    }
  }, [personId]);

  const deleteEmergencyField = useCallback(async (fieldName: string) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('delete_people_emergency_field', {
          p_person_id: personId,
          p_field_name: fieldName
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Emergency contact field cleared successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Delete failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete emergency contact field');
      return false;
    }
  }, [personId]);

  // Helper to get available emergency contact fields for dropdown
  const getAvailableEmergencyFields = useCallback(() => {
    const allFields = [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone_number', label: 'Phone' },
      { key: 'relationship', label: 'Relationship' }
    ];

    // If no data or no emergency contact, return all fields
    if (!data?.emergencyContact) return allFields;

    const existingFields = new Set();
    // Only add to existing fields if the value is not null/empty
    if (data.emergencyContact.first_name) existingFields.add('first_name');
    if (data.emergencyContact.last_name) existingFields.add('last_name');
    if (data.emergencyContact.email) existingFields.add('email');
    if (data.emergencyContact.phone_number) existingFields.add('phone_number');
    if (data.emergencyContact.relationship) existingFields.add('relationship');

    const availableFields = allFields.filter(field => !existingFields.has(field.key));
    
    // If no existing fields (all are null/empty), return all fields
    return existingFields.size === 0 ? allFields : availableFields;
  }, [data?.emergencyContact]);

  // Helper to get current emergency contact fields for display
  const getCurrentEmergencyFields = useCallback((): ContactField[] => {
    if (!data?.emergencyContact) return [];

    const fields: ContactField[] = [];
    
    if (data.emergencyContact.first_name) {
      fields.push({ key: 'first_name', label: 'First Name', value: data.emergencyContact.first_name, type: 'text' });
    }
    if (data.emergencyContact.last_name) {
      fields.push({ key: 'last_name', label: 'Last Name', value: data.emergencyContact.last_name, type: 'text' });
    }
    if (data.emergencyContact.email) {
      fields.push({ key: 'email', label: 'Email', value: data.emergencyContact.email, type: 'text' });
    }
    if (data.emergencyContact.phone_number) {
      fields.push({ key: 'phone_number', label: 'Phone', value: data.emergencyContact.phone_number, type: 'text' });
    }
    if (data.emergencyContact.relationship) {
      fields.push({ key: 'relationship', label: 'Relationship', value: data.emergencyContact.relationship, type: 'select' });
    }

    return fields;
  }, [data?.emergencyContact]);

  // User role and staff type management functions
  const updateUserRole = useCallback(async (roleName: string) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('update_people_user_role', {
          p_person_id: personId,
          p_role_name: roleName
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('User role updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role');
      return false;
    }
  }, [personId]);

  const updateStaffType = useCallback(async (staffType: string) => {
    if (!personId) return false;
    
    try {
      const { data: result, error } = await supabase
        .rpc('update_people_staff_type', {
          p_person_id: personId,
          p_staff_type: staffType
        });

      if (error) throw error;
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success('Staff type updated successfully');
        await fetchProfile(personId);
        return true;
      } else {
        throw new Error((result as any)?.message || 'Update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff type');
      return false;
    }
  }, [personId]);

  return {
    data,          // normalized display-ready data
    raw,           // original payload if needed elsewhere
    loading,
    error,
    refetch,
    // Contact management functions
    updateContactField,
    updateContactAddress,
    updatePersonName,
    deleteContactField,
    getAvailableContactFields,
    getCurrentContactFields,
    // Additional field management functions
    updateAdditionalField,
    deleteAdditionalField,
    getAvailableAdditionalFields,
    getCurrentAdditionalFields,
    // Emergency contact management functions
    updateEmergencyField,
    deleteEmergencyField,
    getAvailableEmergencyFields,
    getCurrentEmergencyFields,
    // User role and staff type management functions
    updateUserRole,
    updateStaffType,
  };
};