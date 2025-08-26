
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

interface CallConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
  onOpenContentEditor: (stepId: string, type: string) => void;
}

export const CallConfig: React.FC<CallConfigProps> = ({
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
        <Label>Call Name</Label>
        <Input
          value={selectedStep?.config?.name || ''}
          onChange={(e) => updateStepConfig('name', e.target.value)}
          placeholder="Enter call name"
        />
      </div>
      
      <div>
        <Label>Call From Phone Number</Label>
        <Select
          value={selectedStep?.config?.fromPhone || ''}
          onValueChange={(value) => updateStepConfig('fromPhone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select calling number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+1 (555) 200-1001">+1 (555) 200-1001</SelectItem>
            <SelectItem value="+1 (555) 200-1002">+1 (555) 200-1002</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>AI Voice Selection</Label>
        <Select
          value={selectedStep?.config?.voice || ''}
          onValueChange={(value) => updateStepConfig('voice', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sarah (Female)">Sarah (Female)</SelectItem>
            <SelectItem value="John (Male)">John (Male)</SelectItem>
            <SelectItem value="Aliyah (Female)">Aliyah (Female)</SelectItem>
            <SelectItem value="Steve (Male)">Steve (Male)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => onOpenContentEditor(selectedStep.id, 'call')}
        className="w-full"
      >
        Design Call Script
      </Button>
    </div>
  );
};
