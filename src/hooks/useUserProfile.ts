import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfileData {
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    bio: string;
    profilePic: string;
    status: string;
  };
  contactInfo: {
    email: string;
    workEmail: string;
    phone: string;
    phoneHome: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
  identifiers: {
    dateOfBirth: string;
    ssnNumber: string;
    npiNumber: string;
    insuranceProvider: string;
    insuranceNumber: string;
    insuranceExpirationDate: string;
    genderIdentity: string;
    ethnicityIdentity: string;
    maritalStatus: string;
    livingSituation: string;
  };
  emergencyContact: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationship: string;
  };
  referralInfo: {
    referralType: string;
    referralRelationship: string;
    referredByName: string;
    referralNote: string;
  };
  leadInfo: {
    preferredLanguage: string;
    leadGoals: string;
    preferences: string;
    expectation: string;
    note: string;
  };
  userRoles: Array<{
    roleId: string;
    roleName: string;
  }>;
  staffTypes: Array<{
    staffTypeId: string;
    staffType: string;
  }>;
}

interface UseUserProfileReturn {
  data: UserProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (personId: string): UseUserProfileReturn => {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    if (!personId) {
      setError("Person ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: result, error: rpcError } = await supabase.rpc('get_user_profile_data', {
        p_person_id: personId
      });

      if (rpcError) {
        console.error('Error fetching profile data:', rpcError);
        setError('Failed to load profile data');
        return;
      }

      if (result) {
        // Transform the database result to match our interface
        const profileData: UserProfileData = {
          personalInfo: {
            firstName: result.personal_info?.first_name || "",
            middleName: result.personal_info?.middle_name || "",
            lastName: result.personal_info?.last_name || "",
            bio: result.personal_info?.user_profile_bio || "",
            profilePic: result.personal_info?.user_profile_pic || "",
            status: result.personal_info?.status || ""
          },
          contactInfo: {
            email: result.contact_info?.email || "",
            workEmail: result.contact_info?.work_email || "",
            phone: result.contact_info?.phone || "",
            phoneHome: result.contact_info?.phone_home || "",
            addressLine1: result.contact_info?.address_line_1 || "",
            addressLine2: result.contact_info?.address_line_2 || "",
            city: result.contact_info?.city || "",
            state: result.contact_info?.state || "",
            zipCode: result.contact_info?.zip_code || "",
            facebook: result.contact_info?.url_facebook || "",
            instagram: result.contact_info?.url_instagram || "",
            tiktok: result.contact_info?.url_tiktok || "",
            linkedin: result.contact_info?.url_linkedin || ""
          },
          identifiers: {
            dateOfBirth: result.identifiers?.date_of_birth || "",
            ssnNumber: result.identifiers?.ssn_number || "",
            npiNumber: result.identifiers?.npi_number || "",
            insuranceProvider: result.identifiers?.insurance_provider || "",
            insuranceNumber: result.identifiers?.insurance_number || "",
            insuranceExpirationDate: result.identifiers?.insurance_expiration_date || "",
            genderIdentity: result.identifiers?.gender_identity || "",
            ethnicityIdentity: result.identifiers?.ethnicity_identity || "",
            maritalStatus: result.identifiers?.marital_status || "",
            livingSituation: result.identifiers?.living_situation || ""
          },
          emergencyContact: {
            firstName: result.emergency_contact?.first_name || "",
            lastName: result.emergency_contact?.last_name || "",
            email: result.emergency_contact?.email || "",
            phoneNumber: result.emergency_contact?.phone_number || "",
            relationship: result.emergency_contact?.relationship || ""
          },
          referralInfo: {
            referralType: result.referral_info?.referral_type || "",
            referralRelationship: result.referral_info?.referral_relationship || "",
            referredByName: result.referral_info?.referred_by_name || "",
            referralNote: result.referral_info?.referral_note || ""
          },
          leadInfo: {
            preferredLanguage: result.lead_info?.preferred_language || "",
            leadGoals: result.lead_info?.lead_goals || "",
            preferences: result.lead_info?.preferences || "",
            expectation: result.lead_info?.expectation || "",
            note: result.lead_info?.note || ""
          },
          userRoles: result.user_roles || [],
          staffTypes: result.staff_types || []
        };

        setData(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [personId]);

  return {
    data,
    loading,
    error,
    refetch: fetchProfileData
  };
};