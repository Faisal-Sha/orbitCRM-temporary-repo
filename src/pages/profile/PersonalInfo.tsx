import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";

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

const PersonalInfo = () => {
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    setHasUnsavedChanges,
    setOnSave,
    setOnDiscard,
  } = useUnsavedChanges();

  // Check if form has unsaved changes
  const hasUnsavedChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  // Update context when unsaved changes state changes
  useEffect(() => {
    setHasUnsavedChanges(!!hasUnsavedChanges);
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  // Set up save and discard handlers in context
  useEffect(() => {
    setOnSave(handleSave);
    setOnDiscard(handleDiscard);
  }, [formData, originalData, setOnSave, setOnDiscard]);

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

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

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

  const handleDiscard = () => {
    if (originalData) {
      setFormData(originalData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input 
                id="middleName" 
                placeholder="Michael" 
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profilePic || "/placeholder-avatar.jpg"} />
              <AvatarFallback>
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleChangePictureClick}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Change Picture
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input 
                id="personalEmail" 
                type="email" 
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalPhone">Personal Phone</Label>
              <Input 
                id="personalPhone" 
                type="tel" 
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input 
                id="address1" 
                placeholder="123 Main Street"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input 
                id="address2" 
                placeholder="Apt 4B (optional)"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input 
                  id="zipCode" 
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook Profile URL</Label>
              <Input 
                id="facebook" 
                placeholder="https://facebook.com/johndoe"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Profile URL</Label>
              <Input 
                id="instagram" 
                placeholder="https://instagram.com/johndoe"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok Profile URL</Label>
              <Input 
                id="tiktok" 
                placeholder="https://tiktok.com/@johndoe"
                value={formData.tiktok}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input 
                id="linkedin" 
                placeholder="https://linkedin.com/in/johndoe"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfo;
