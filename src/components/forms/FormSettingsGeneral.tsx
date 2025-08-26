
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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

      <div className="space-y-2">
        <Label>Lead Campaign Assignment</Label>
        <p className="text-sm text-muted-foreground">
          Assign this form to specific lead campaigns for tracking and analytics
        </p>
        <LeadCampaignSelector onSelectionChange={handleCampaignSelection} />
      </div>
    </div>
  );
};
