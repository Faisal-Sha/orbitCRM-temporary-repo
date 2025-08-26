
import React from 'react';
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

interface DelayConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
}

export const DelayConfig: React.FC<DelayConfigProps> = ({
  selectedStep,
  onStepUpdate,
}) => {
  const updateStepConfig = (field: string, value: any) => {
    const newConfig = { ...selectedStep.config, [field]: value };
    onStepUpdate(selectedStep.id, newConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Delay Name</Label>
        <Input
          value={selectedStep?.config?.name || ''}
          onChange={(e) => updateStepConfig('name', e.target.value)}
          placeholder="Enter delay name"
        />
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label>Wait Time</Label>
          <Input
            type="number"
            value={selectedStep?.config?.waitTime || ''}
            onChange={(e) => updateStepConfig('waitTime', e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="flex-1">
          <Label>Time Unit</Label>
          <Select
            value={selectedStep?.config?.timeUnit || ''}
            onValueChange={(value) => updateStepConfig('timeUnit', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
