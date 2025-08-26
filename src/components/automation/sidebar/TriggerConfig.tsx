
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadCampaignSelector } from '@/components/shared/LeadCampaignSelector';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
}

interface TriggerConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
}

const triggerOptions = [
  'Form Submission',
  'Contact Added',
  'Tag Added',
  'Opportunity Created',
  'Appointment Scheduled',
  'Email Opened',
  'Link Clicked',
  'Manual Trigger'
];

export const TriggerConfig: React.FC<TriggerConfigProps> = ({
  selectedStep,
  onStepUpdate,
}) => {
  const handleTriggerChange = (triggerType: string) => {
    onStepUpdate(selectedStep.id, {
      ...selectedStep.config,
      triggerType
    });
  };

  const handleCampaignSelection = (campaignData: any) => {
    onStepUpdate(selectedStep.id, {
      ...selectedStep.config,
      leadCampaign: campaignData
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Trigger</Label>
        <Select
          value={selectedStep.config?.triggerType || ''}
          onValueChange={handleTriggerChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose trigger type" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-md z-50">
            {triggerOptions.map((trigger) => (
              <SelectItem key={trigger} value={trigger}>
                {trigger}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Lead Campaign Assignment</Label>
        <p className="text-sm text-muted-foreground">
          Assign this trigger to specific lead campaigns for targeted automation
        </p>
        <LeadCampaignSelector onSelectionChange={handleCampaignSelection} />
      </div>
    </div>
  );
};
