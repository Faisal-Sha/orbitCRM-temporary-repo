import { useState, useEffect, useRef, useImperativeHandle } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationBlocker } from "@/hooks/useNavigationBlocker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  bio: string;
  profilePic: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
}

interface PersonalInfoRef {
  hasUnsavedChanges: () => boolean;
  showUnsavedModal: () => Promise<boolean>;
}

interface UsePersonalProfilePageReturn {
  formData: ProfileData;
  originalData: ProfileData | null;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  showUnsavedModal: boolean;
  pendingNavigationPath: string;
  hasUnsavedChanges: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (field: keyof ProfileData, value: string) => void;
  handleSave: () => Promise<void>;
  handleProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleChangePictureClick: () => void;
  handleDeletePicture: () => void;
  handleModalSave: () => Promise<void>;
  handleModalDiscard: () => void;
  handleModalCancel: () => void;
  handleNavigation: (callback: () => void) => void;
  setShowUnsavedModal: (show: boolean) => void;
  exposeRef: (ref: React.Ref<PersonalInfoRef>) => void;
}

export const usePersonalProfilePage = (): UsePersonalProfilePageReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    middleName: "",
    lastName: "",
    bio: "",
    profilePic: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: ""
  });

  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [tabSwitchResolve, setTabSwitchResolve] = useState<((value: boolean) => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if form has unsaved changes
  const hasUnsavedChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  // Function to expose ref methods
  const exposeRef = (ref: React.Ref<PersonalInfoRef>) => {
    useImperativeHandle(ref, () => ({
      hasUnsavedChanges: () => !!hasUnsavedChanges,
      showUnsavedModal: () => {
        return new Promise<boolean>((resolve) => {
          if (!hasUnsavedChanges) {
            resolve(true);
            return;
          }
          
          // Show modal for tab switching
          setTabSwitchResolve(() => resolve);
          setShowUnsavedModal(true);
        });
      }
    }));
  };

  // Use navigation blocker hook
  const { allowNavigation } = useNavigationBlocker({
    when: !!hasUnsavedChanges,
    onBlock: (nextLocation: string) => {
      setPendingNavigationPath(nextLocation);
      setPendingNavigation(() => () => allowNavigation(nextLocation));
      setShowUnsavedModal(true);
    }
  });

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Set up beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_personal_profile');
      
      if (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
        return;
      }

      if (data) {
        const profileRecord = data as any;
        const profileData: ProfileData = {
          firstName: profileRecord.first_name || "",
          middleName: profileRecord.middle_name || "",
          lastName: profileRecord.last_name || "",
          bio: profileRecord.bio || "",
          profilePic: profileRecord.profile_pic || "",
          email: profileRecord.email || "",
          phone: profileRecord.phone || "",
          addressLine1: profileRecord.address_line_1 || "",
          addressLine2: profileRecord.address_line_2 || "",
          city: profileRecord.city || "",
          state: profileRecord.state || "",
          zipCode: profileRecord.zip_code || "",
          facebook: profileRecord.facebook || "",
          instagram: profileRecord.instagram || "",
          tiktok: profileRecord.tiktok || "",
          linkedin: profileRecord.linkedin || ""
        };

        setFormData(profileData);
        setOriginalData(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error('Please sign in to save changes');
        return;
      }

      const response = await supabase.functions.invoke('update-personal-profile', {
        body: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          bio: formData.bio,
          profilePic: formData.profilePic,
          oldProfilePic: originalData?.profilePic,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          facebook: formData.facebook,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          linkedin: formData.linkedin
        }
      });

      if (response.error) {
        console.error('Save error:', response.error);
        toast.error('Failed to save changes');
        return;
      }

      if (response.data?.success) {
        setOriginalData(formData);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data?.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleModalSave = async () => {
    await handleSave();
    setShowUnsavedModal(false);
    
    // Handle tab switching vs page navigation differently
    if (tabSwitchResolve) {
      tabSwitchResolve(true);
      setTabSwitchResolve(null);
    } else if (pendingNavigation) {
      // For page navigation, don't navigate away after save
      setPendingNavigation(null);
    }
  };

  const handleModalDiscard = () => {
    // Reset form to original data
    if (originalData) {
      setFormData(originalData);
    }
    setShowUnsavedModal(false);
    
    // Handle tab switching vs page navigation differently
    if (tabSwitchResolve) {
      tabSwitchResolve(true);
      setTabSwitchResolve(null);
    } else if (pendingNavigation) {
      // For page navigation, navigate away after discarding
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleModalCancel = () => {
    setShowUnsavedModal(false);
    
    // Handle tab switching vs page navigation differently
    if (tabSwitchResolve) {
      tabSwitchResolve(false);
      setTabSwitchResolve(null);
    } else {
      setPendingNavigation(null);
    }
  };

  // Function to handle navigation with unsaved changes check
  const handleNavigation = (callback: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => callback);
      setShowUnsavedModal(true);
    } else {
      callback();
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error('Please sign in to upload pictures');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Update form data with new profile picture URL
      setFormData(prev => ({
        ...prev,
        profilePic: publicUrl
      }));

      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeletePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: ""
    }));
    toast.success('Picture removed. Save changes to delete permanently.');
  };

  return {
    formData,
    originalData,
    loading,
    saving,
    uploading,
    showUnsavedModal,
    pendingNavigationPath,
    hasUnsavedChanges: !!hasUnsavedChanges,
    fileInputRef,
    handleInputChange,
    handleSave,
    handleProfilePictureUpload,
    handleChangePictureClick,
    handleDeletePicture,
    handleModalSave,
    handleModalDiscard,
    handleModalCancel,
    handleNavigation,
    setShowUnsavedModal,
    exposeRef
  };
};