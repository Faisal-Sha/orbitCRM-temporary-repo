
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
}

interface ActionConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
}

export const ActionConfig: React.FC<ActionConfigProps> = ({
  selectedStep,
  onStepUpdate,
}) => {
  const actionTypes = [
    'Add to group(s)',
    'Remove from group(s)',
    'Copy to group(s)',
    'Move to group(s)',
    'Update contact field',
    'Assign task',
    'Mark as unsubscribed'
  ];

  const dummyGroups = ['VIP Clients', 'Newsletter Subscribers', 'Trial Users', 'Premium Members'];
  const dummyTeamMembers = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Davis', 'Tom Wilson'];

  // Update contact field options
  const fieldSources = ['Form', 'Calendar', 'Table', 'Profile', 'Record'];
  const fieldEntities = {
    'Form': ['Contact form', 'Intakes form', 'Staff form'],
    'Calendar': ['Intakes calendar', 'Clients calendar'],
    'Table': ['Intakes appointments table', 'Clients appointments table'],
    'Profile': ['Contact information', 'Additional information'],
    'Record': ['Assessments', 'Progress notes']
  };

  // Task assignment options
  const taskCategories = ['Work', 'Health', 'Meeting'];
  const taskPriorities = ['High', 'Medium', 'Low'];
  const taskStatuses = ['To do', 'Progress', 'Blocked', 'Completed', 'Canceled'];
  const dueDateUnits = ['minutes', 'hours', 'days'];

  const updateStepConfig = (field: string, value: any) => {
    const newConfig = { ...selectedStep.config, [field]: value };
    onStepUpdate(selectedStep.id, newConfig);
  };

  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = selectedStep.config?.[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    updateStepConfig(field, newArray);
  };

  const clearField = (field: string) => {
    updateStepConfig(field, '');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Action Name</Label>
        <Input
          value={selectedStep?.config?.name || ''}
          onChange={(e) => updateStepConfig('name', e.target.value)}
          placeholder="Enter action name"
        />
      </div>

      <div>
        <Label>Action Type</Label>
        <Select
          value={selectedStep?.config?.actionType || ''}
          onValueChange={(value) => updateStepConfig('actionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(selectedStep?.config?.actionType === 'Add to group(s)' || 
        selectedStep?.config?.actionType === 'Remove from group(s)' ||
        selectedStep?.config?.actionType === 'Copy to group(s)' ||
        selectedStep?.config?.actionType === 'Move to group(s)') && (
        <div>
          <Label>Select Groups</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {dummyGroups.map((group) => {
              const isSelected = selectedStep?.config?.selectedGroups?.includes(group) || false;
              return (
                <Badge 
                  key={group} 
                  variant={isSelected ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue('selectedGroups', group)}
                >
                  {group}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {selectedStep?.config?.actionType === 'Update contact field' && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <Label>Source</Label>
              {selectedStep?.config?.fieldSource && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('fieldSource')}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={selectedStep?.config?.fieldSource || ''}
              onValueChange={(value) => updateStepConfig('fieldSource', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {fieldSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStep?.config?.fieldSource && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Entity/Context</Label>
                {selectedStep?.config?.fieldEntity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearField('fieldEntity')}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Select
                value={selectedStep?.config?.fieldEntity || ''}
                onValueChange={(value) => updateStepConfig('fieldEntity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {fieldEntities[selectedStep.config.fieldSource as keyof typeof fieldEntities]?.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedStep?.config?.fieldEntity && (
            <div>
              <Label>Custom Value</Label>
              <Input
                value={selectedStep?.config?.fieldValue || ''}
                onChange={(e) => updateStepConfig('fieldValue', e.target.value)}
                placeholder="Enter custom value"
              />
            </div>
          )}
        </div>
      )}

      {selectedStep?.config?.actionType === 'Assign task' && (
        <div className="space-y-3">
          <div>
            <Label>Task Description</Label>
            <Textarea
              value={selectedStep?.config?.taskDescription || ''}
              onChange={(e) => updateStepConfig('taskDescription', e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Category</Label>
              {selectedStep?.config?.taskCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('taskCategory')}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={selectedStep?.config?.taskCategory || ''}
              onValueChange={(value) => updateStepConfig('taskCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Priority</Label>
              {selectedStep?.config?.taskPriority && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('taskPriority')}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={selectedStep?.config?.taskPriority || ''}
              onValueChange={(value) => updateStepConfig('taskPriority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {taskPriorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Status</Label>
              {selectedStep?.config?.taskStatus && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('taskStatus')}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={selectedStep?.config?.taskStatus || ''}
              onValueChange={(value) => updateStepConfig('taskStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Due Date</Label>
              {selectedStep?.config?.taskDueDateUnit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearField('taskDueDateValue');
                    clearField('taskDueDateUnit');
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={selectedStep?.config?.taskDueDateValue || ''}
                onChange={(e) => updateStepConfig('taskDueDateValue', e.target.value)}
                placeholder="Number"
                className="flex-1"
              />
              <Select
                value={selectedStep?.config?.taskDueDateUnit || ''}
                onValueChange={(value) => updateStepConfig('taskDueDateUnit', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {dueDateUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Assign Team Members</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {dummyTeamMembers.map((member) => {
                const isSelected = selectedStep?.config?.assignedMembers?.includes(member) || false;
                return (
                  <Badge 
                    key={member} 
                    variant={isSelected ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('assignedMembers', member)}
                  >
                    {member}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
