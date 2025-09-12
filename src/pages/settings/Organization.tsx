
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Users, Plus, X, Loader2 } from "lucide-react";
import { useOrganizationSettings } from "@/hooks/useOrganizationSettings";
import LogoUpload from "@/components/files/LogoUpload";

const Organization = () => {
  const {
    formData,
    loading,
    saving,
    logoUploading,
    updateFormField,
    addDomain,
    updateDomain,
    removeDomain,
    uploadLogo,
    removeLogo,
    saveOrganizationSettings
  } = useOrganizationSettings();

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  const usTimezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Phoenix", label: "Mountain Time - Arizona (MST)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii-Aleutian Time (HAT)" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="org-name">Organization Name</Label>
            <Input 
              id="org-name" 
              value={formData.organization_name}
              onChange={(e) => updateFormField('organization_name', e.target.value)}
            />
          </div>

          <LogoUpload
            value={formData.organization_logo}
            onUpload={uploadLogo}
            onRemove={removeLogo}
            uploading={logoUploading}
          />

          <div className="space-y-4">
            <Label>Organization Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address-line1">Address Line 1</Label>
                <Input 
                  id="address-line1" 
                  value={formData.address_line_1}
                  onChange={(e) => updateFormField('address_line_1', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address-line2">Address Line 2</Label>
                <Input 
                  id="address-line2" 
                  value={formData.address_line_2}
                  onChange={(e) => updateFormField('address_line_2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip" 
                  value={formData.zip_cone}
                  onChange={(e) => updateFormField('zip_cone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select 
                  value={formData.organization_state} 
                  onValueChange={(value) => updateFormField('organization_state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => updateFormField('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Organization Domains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {formData.domains.map((domain, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select 
                  value={domain.protocol} 
                  onValueChange={(value) => updateDomain(index, 'protocol', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="https://">https://</SelectItem>
                    <SelectItem value="http://">http://</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="company.com"
                  value={domain.domain}
                  onChange={(e) => updateDomain(index, 'domain', e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeDomain(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            onClick={addDomain}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Organization Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={formData.default_language} 
                onValueChange={(value) => updateFormField('default_language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English (US)">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={formData.default_timezone} 
                onValueChange={(value) => updateFormField('default_timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {usTimezones.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.default_currency} 
                onValueChange={(value) => updateFormField('default_currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD ($)">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Media Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input 
                id="facebook" 
                placeholder="https://facebook.com/yourpage" 
                value={formData.facebook_url}
                onChange={(e) => updateFormField('facebook_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input 
                id="instagram" 
                placeholder="https://instagram.com/yourpage" 
                value={formData.instagram_url}
                onChange={(e) => updateFormField('instagram_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twitter">X (Twitter) URL</Label>
              <Input 
                id="twitter" 
                placeholder="https://x.com/yourpage" 
                value={formData.x_url}
                onChange={(e) => updateFormField('x_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input 
                id="tiktok" 
                placeholder="https://tiktok.com/@yourpage" 
                value={formData.tiktok_url}
                onChange={(e) => updateFormField('tiktok_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input 
                id="linkedin" 
                placeholder="https://linkedin.com/company/yourpage" 
                value={formData.linkedin_url}
                onChange={(e) => updateFormField('linkedin_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="google-profile">Google Profile URL</Label>
              <Input 
                id="google-profile" 
                placeholder="https://business.google.com/yourprofile" 
                value={formData.google_profile_url}
                onChange={(e) => updateFormField('google_profile_url', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input 
                id="youtube" 
                placeholder="https://youtube.com/@yourchannel" 
                value={formData.youtube_url}
                onChange={(e) => updateFormField('youtube_url', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={saveOrganizationSettings}
          disabled={saving}
          className="min-w-24"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Organization;
