
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

  // User role options
  const userRoleOptions = ['Lead', 'Client', 'Staff', 'Admin', 'General'];

  // Staff type options (only shown when role is Staff)
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

  // Form purpose options
  const formPurposeOptions = ['Application', 'Onboarding', 'Survey', 'Referral'];

  // Dynamic status options based on user role
  const getStatusOptions = (role: string) => {
    switch (role) {
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

  const handleUserRoleChange = (value: string) => {
    updateSetting('userRole', value);
    // Reset staff type and status when role changes
    if (value !== 'Staff') {
      updateSetting('staffType', '');
    }
    updateSetting('userStatus', '');
  };

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

      {/* Assignment Section */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg border-2 border-dashed border-border space-y-6">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-foreground">Assignment Settings</h4>
          <p className="text-sm text-muted-foreground">Configure user roles, status, and form purpose</p>
        </div>

        {/* User Role Assignment */}
        <div className="space-y-2">
          <Label htmlFor="user-role">User Role Assignment</Label>
          <Select 
            value={formData.settings?.userRole || ''} 
            onValueChange={handleUserRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {userRoleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Staff Type Assignment - Only visible when User Role is Staff */}
        {formData.settings?.userRole === 'Staff' && (
          <div className="space-y-2">
            <Label htmlFor="staff-type">Staff Type Assignment</Label>
            <Select 
              value={formData.settings?.staffType || ''} 
              onValueChange={(value) => updateSetting('staffType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {staffTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User Status Assignment - Visible after user role is selected */}
        {formData.settings?.userRole && (
          <div className="space-y-2">
            <Label htmlFor="user-status">User Status Assignment</Label>
            <Select 
              value={formData.settings?.userStatus || ''} 
              onValueChange={(value) => updateSetting('userStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
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
          <Label htmlFor="form-purpose">Form Purpose Assignment</Label>
          <Select 
            value={formData.settings?.formPurpose || ''} 
            onValueChange={(value) => updateSetting('formPurpose', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
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
  );
};
