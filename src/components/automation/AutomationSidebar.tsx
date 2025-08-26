
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, Clock, GitBranch, Users, Settings, Trash2 } from 'lucide-react';
import { WorkflowSettings } from './sidebar/WorkflowSettings';
import { TriggerConfig } from './sidebar/TriggerConfig';
import { EmailConfig } from './sidebar/EmailConfig';
import { SMSConfig } from './sidebar/SMSConfig';
import { CallConfig } from './sidebar/CallConfig';
import { DelayConfig } from './sidebar/DelayConfig';
import { ConditionConfig } from './sidebar/ConditionConfig';
import { ActionConfig } from './sidebar/ActionConfig';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
}

interface AutomationSidebarProps {
  selectedStep: WorkflowStep | null;
  onStepUpdate: (stepId: string, config: any) => void;
  onAddStep: (type: string) => void;
  onDeleteStep: (stepId: string) => void;
  onOpenContentEditor: (stepId: string, type: string) => void;
  workflowSettings: {
    isActive: boolean;
    reEnrollment: 'once' | 'multiple';
  };
  onWorkflowSettingsUpdate: (settings: any) => void;
}

export const AutomationSidebar: React.FC<AutomationSidebarProps> = ({
  selectedStep,
  onStepUpdate,
  onAddStep,
  onDeleteStep,
  onOpenContentEditor,
  workflowSettings,
  onWorkflowSettingsUpdate,
}) => {
  console.log('AutomationSidebar render:', { selectedStep, selectedStepType: selectedStep?.type });

  const stepTypes = [
    { type: 'email', label: 'Send Email', icon: Mail },
    { type: 'sms', label: 'Send SMS', icon: MessageSquare },
    { type: 'call', label: 'AI Voice Call', icon: Phone },
    { type: 'delay', label: 'Wait/Delay', icon: Clock },
    { type: 'condition', label: 'If/Then Branch', icon: GitBranch },
    { type: 'action', label: 'Action', icon: Users },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      {!selectedStep && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium mb-3">Add Workflow Step</h4>
            <div className="grid grid-cols-1 gap-2">
              {stepTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => onAddStep(type)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedStep && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Configure {selectedStep.type === 'trigger' ? 'Trigger' : 'Step'}
                </CardTitle>
                {selectedStep.type !== 'trigger' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteStep(selectedStep.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Step Type: {selectedStep.type}
              </div>
            </CardHeader>
            <CardContent>
              {selectedStep.type === 'trigger' && (
                <div className="space-y-4">
                  <WorkflowSettings
                    workflowSettings={workflowSettings}
                    onWorkflowSettingsUpdate={onWorkflowSettingsUpdate}
                  />
                  <TriggerConfig
                    selectedStep={selectedStep}
                    onStepUpdate={onStepUpdate}
                  />
                </div>
              )}
              {selectedStep.type === 'email' && (
                <EmailConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                  onOpenContentEditor={onOpenContentEditor}
                />
              )}
              {selectedStep.type === 'sms' && (
                <SMSConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                  onOpenContentEditor={onOpenContentEditor}
                />
              )}
              {selectedStep.type === 'call' && (
                <CallConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                  onOpenContentEditor={onOpenContentEditor}
                />
              )}
              {selectedStep.type === 'delay' && (
                <DelayConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                />
              )}
              {selectedStep.type === 'condition' && (
                <ConditionConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                />
              )}
              {selectedStep.type === 'action' && (
                <ActionConfig
                  selectedStep={selectedStep}
                  onStepUpdate={onStepUpdate}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
