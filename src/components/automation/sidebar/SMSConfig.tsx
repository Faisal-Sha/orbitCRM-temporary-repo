
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
}

interface SMSConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
  onOpenContentEditor: (stepId: string, type: string) => void;
}

export const SMSConfig: React.FC<SMSConfigProps> = ({
  selectedStep,
  onStepUpdate,
  onOpenContentEditor,
}) => {
  const updateStepConfig = (field: string, value: any) => {
    const newConfig = { ...selectedStep.config, [field]: value };
    onStepUpdate(selectedStep.id, newConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>SMS Name</Label>
        <Input
          value={selectedStep?.config?.name || ''}
          onChange={(e) => updateStepConfig('name', e.target.value)}
          placeholder="Enter SMS name"
        />
      </div>
      
      <div>
        <Label>Send From Phone Number</Label>
        <Select
          value={selectedStep?.config?.fromPhone || ''}
          onValueChange={(value) => updateStepConfig('fromPhone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sending number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+1 (555) 123-4567">+1 (555) 123-4567</SelectItem>
            <SelectItem value="+1 (555) 987-6543">+1 (555) 987-6543</SelectItem>
            <SelectItem value="+1 (555) 456-7890">+1 (555) 456-7890</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => onOpenContentEditor(selectedStep.id, 'sms')}
        className="w-full"
      >
        Design SMS Content
      </Button>
    </div>
  );
};
