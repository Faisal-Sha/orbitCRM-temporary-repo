
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadCampaignSelector } from '@/components/shared/LeadCampaignSelector';

interface FormSettingsGeneralProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FormSettingsGeneral: React.FC<FormSettingsGeneralProps> = ({
  formData,
  setFormData,
}) => {
  const updateSetting = (key: string, value: any) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        [key]: value
      }
    });
  };

  const handleCampaignSelection = (campaignData: any) => {
    updateSetting('leadCampaign', campaignData);
  };

  // Helper function to get status options based on user role
  const getStatusOptions = (userRole: string) => {
    switch (userRole) {
      case 'Owner':
      case 'Admin':
      case 'General':
        return ['Active', 'Inactive'];
      case 'Lead':
        return ['Applied', 'Qualified', 'Unqualified', 'Unsubscribed'];
      case 'Client':
        return ['Active', 'On Hold', 'Discharged', 'Inactive', 'Deceased'];
      case 'Staff':
        return ['Onboarding', 'Active', 'On Leave', 'Terminated'];
      default:
        return [];
    }
  };

  const userRoleOptions = ['Lead', 'Client', 'Staff', 'Admin', 'General'];
  const staffTypeOptions = [
    'Case Manager',
    'Clinical – Assessor',
    'Clinical – Supervisor',
    'Leadership – Team Lead',
    'Leadership – Exec',
    'Sales Rep',
    'Specialist - Marketer',
    'Specialist – IT',
    'Specialist – HR',
    'Specialist – Finance',
    'Admin Support'
  ];
  const formPurposeOptions = ['Application', 'Onboarding', 'Survey', 'Referral'];

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold">General Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="form-title">Form Title</Label>
        <Input
          id="form-title"
          value={formData.settings?.title || ''}
          onChange={(e) => updateSetting('title', e.target.value)}
          placeholder="Enter form title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-description">Form Description</Label>
        <Textarea
          id="form-description"
          value={formData.settings?.description || ''}
          onChange={(e) => updateSetting('description', e.target.value)}
          placeholder="Enter form description"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Show Form Steps</Label>
          <p className="text-sm text-muted-foreground">
            Display step navigation in the form preview
          </p>
        </div>
        <Switch
          checked={formData.settings?.showFormSteps !== false}
          onCheckedChange={(checked) => updateSetting('showFormSteps', checked)}
        />
      </div>

      {formData.settings?.showFormSteps !== false && (
        <div className="flex items-center justify-between ml-4 border-l-2 border-muted pl-4">
          <div className="space-y-1">
            <Label>Show Step Names</Label>
            <p className="text-sm text-muted-foreground">
              Display step names within the visible steps
            </p>
          </div>
          <Switch
            checked={formData.settings?.showStepNames !== false}
            onCheckedChange={(checked) => updateSetting('showStepNames', checked)}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Allow Navigation to Next Step</Label>
          <p className="text-sm text-muted-foreground">
            Allow users to proceed even if required fields are incomplete
          </p>
        </div>
        <Switch
          checked={formData.settings?.allowIncompleteNavigation || false}
          onCheckedChange={(checked) => updateSetting('allowIncompleteNavigation', checked)}
        />
      </div>

      {/* Form Assignments Section */}
      <div className="border-t border-border pt-6 mt-8">
        <div className="bg-muted/30 rounded-lg p-6 space-y-6 border border-muted">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <h4 className="text-base font-semibold text-foreground">Form Assignments</h4>
          </div>
          
          {/* User Role Assignment */}
          <div className="space-y-2">
            <Label>User Role Assignment</Label>
            <p className="text-sm text-muted-foreground">
              Select the user role this form is designed for
            </p>
            <Select
              value={formData.settings?.userRole || undefined}
              onValueChange={(value) => {
                updateSetting('userRole', value);
                // Clear staff type and status when role changes
                if (value !== 'Staff') {
                  updateSetting('staffType', '');
                }
                updateSetting('userStatus', '');
              }}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {userRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Type Assignment - Only show when User Role is Staff */}
          {formData.settings?.userRole === 'Staff' && (
            <div className="space-y-2 ml-4 border-l-2 border-primary/20 pl-4">
              <Label>Staff Type Assignment</Label>
              <p className="text-sm text-muted-foreground">
                Select the specific staff type for this form
              </p>
              <Select
                value={formData.settings?.staffType || undefined}
                onValueChange={(value) => updateSetting('staffType', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {staffTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* User Status Assignment - Show when user role is selected */}
          {formData.settings?.userRole && (
            <div className="space-y-2">
              <Label>User Status Assignment</Label>
              <p className="text-sm text-muted-foreground">
                Select the user status this form targets
              </p>
              <Select
                value={formData.settings?.userStatus || undefined}
                onValueChange={(value) => updateSetting('userStatus', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {getStatusOptions(formData.settings.userRole).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Form Purpose Assignment */}
          <div className="space-y-2">
            <Label>Form Purpose Assignment</Label>
            <p className="text-sm text-muted-foreground">
              Define the primary purpose of this form
            </p>
            <Select
              value={formData.settings?.formPurpose || undefined}
              onValueChange={(value) => updateSetting('formPurpose', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {formPurposeOptions.map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lead Campaign Assignment */}
          <div className="space-y-2">
            <Label>Lead Campaign Assignment</Label>
            <p className="text-sm text-muted-foreground">
              Assign this form to specific lead campaigns for tracking and analytics
            </p>
            <LeadCampaignSelector onSelectionChange={handleCampaignSelection} />
          </div>
        </div>
      </div>
    </div>
  );
};
