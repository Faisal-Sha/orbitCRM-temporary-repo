
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkflowSettingsProps {
  workflowSettings: {
    isActive: boolean;
    reEnrollment: 'once' | 'multiple';
  };
  onWorkflowSettingsUpdate: (settings: any) => void;
}

export const WorkflowSettings: React.FC<WorkflowSettingsProps> = ({
  workflowSettings,
  onWorkflowSettingsUpdate,
}) => {
  return (
    <div className="p-3 bg-blue-50 rounded-md border">
      <h4 className="font-medium mb-3 text-blue-900">Workflow Settings</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Status</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={workflowSettings.isActive}
              onCheckedChange={(checked) => 
                onWorkflowSettingsUpdate({ ...workflowSettings, isActive: checked })
              }
            />
            <span className="text-sm">{workflowSettings.isActive ? 'Active' : 'Draft'}</span>
          </div>
        </div>
        
        <div>
          <Label className="text-sm">Re-enrollment</Label>
          <Select
            value={workflowSettings.reEnrollment}
            onValueChange={(value) => 
              onWorkflowSettingsUpdate({ ...workflowSettings, reEnrollment: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Allow only once</SelectItem>
              <SelectItem value="multiple">Allow multiple times</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
