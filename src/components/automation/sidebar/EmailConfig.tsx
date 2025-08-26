
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { AISubjectLineGenerator } from './AISubjectLineGenerator';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
}

interface EmailConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
  onOpenContentEditor: (stepId: string, type: string) => void;
}

export const EmailConfig: React.FC<EmailConfigProps> = ({
  selectedStep,
  onStepUpdate,
  onOpenContentEditor,
}) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const updateStepConfig = (field: string, value: any) => {
    const newConfig = { ...selectedStep.config, [field]: value };
    onStepUpdate(selectedStep.id, newConfig);
  };

  const handleInsertSubjectLine = (subjectLine: string) => {
    updateStepConfig('subject', subjectLine);
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <Label>Email Name</Label>
          <Input
            value={selectedStep?.config?.name || ''}
            onChange={(e) => updateStepConfig('name', e.target.value)}
            placeholder="Enter email name"
          />
        </div>
        
        <div>
          <Label>Send From Email Address</Label>
          <Select
            value={selectedStep?.config?.fromEmail || ''}
            onValueChange={(value) => updateStepConfig('fromEmail', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sending email" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin@company.com">admin@company.com</SelectItem>
              <SelectItem value="support@company.com">support@company.com</SelectItem>
              <SelectItem value="noreply@company.com">noreply@company.com</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Who is it from</Label>
          <Input
            value={selectedStep?.config?.fromName || ''}
            onChange={(e) => updateStepConfig('fromName', e.target.value)}
            placeholder="Your Company Name"
          />
        </div>

        <div>
          <Label>Subject Line</Label>
          <div className="flex space-x-2">
            <Input
              value={selectedStep?.config?.subject || ''}
              onChange={(e) => updateStepConfig('subject', e.target.value)}
              placeholder="Enter subject line"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIGenerator(true)}
            >
              <Wand2 className="h-3 w-3 mr-1" />
              AI
            </Button>
          </div>
        </div>

        <div>
          <Label>Preheader Text</Label>
          <Input
            value={selectedStep?.config?.preheader || ''}
            onChange={(e) => updateStepConfig('preheader', e.target.value)}
            placeholder="Brief preview text"
          />
        </div>

        <Button 
          onClick={() => onOpenContentEditor(selectedStep.id, 'email')}
          className="w-full"
        >
          Design Email Content
        </Button>
      </div>

      <AISubjectLineGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onInsert={handleInsertSubjectLine}
      />
    </>
  );
};
