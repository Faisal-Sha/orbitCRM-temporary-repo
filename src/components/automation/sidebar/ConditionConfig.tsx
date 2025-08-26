
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

interface ConditionConfigProps {
  selectedStep: WorkflowStep;
  onStepUpdate: (stepId: string, config: any) => void;
}

export const ConditionConfig: React.FC<ConditionConfigProps> = ({
  selectedStep,
  onStepUpdate,
}) => {
  const dummyTags = ['Hot Lead', 'Cold Lead', 'Customer', 'Prospect'];

  const conditionTypes = [
    'Contact has tag',
    'Field value equals',
    'Email was opened',
    'Email not opened',
    'Link was clicked',
    'Link was not clicked',
    'Call was answered',
    'Call was not answered',
    'Score is'
  ];

  // Field value equals options
  const fieldSources = ['Form', 'Calendar', 'Table', 'Profile', 'Record'];
  const fieldEntities = {
    'Form': ['Contact form', 'Intakes form', 'Staff form'],
    'Calendar': ['Intakes calendar', 'Clients calendar'],
    'Table': ['Intakes appointments table', 'Clients appointments table'],
    'Profile': ['Contact information', 'Additional information'],
    'Record': ['Assessments', 'Progress notes']
  };

  // Score operators
  const scoreOperators = [
    'equal to', 'not equal to', 'greater than', 'less than',
    'greater than or equals to', 'less than or equals to'
  ];

  const updateStepConfig = (field: string, value: any) => {
    const newConfig = { ...selectedStep.config, [field]: value };
    onStepUpdate(selectedStep.id, newConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Condition Name</Label>
        <Input
          value={selectedStep?.config?.name || ''}
          onChange={(e) => updateStepConfig('name', e.target.value)}
          placeholder="Enter condition name"
        />
      </div>

      <div>
        <Label>Condition Type</Label>
        <Select
          value={selectedStep?.config?.conditionType || ''}
          onValueChange={(value) => updateStepConfig('conditionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {conditionTypes.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStep?.config?.conditionType === 'Contact has tag' && (
        <div>
          <Label>Select Tag</Label>
          <Select
            value={selectedStep?.config?.selectedTag || ''}
            onValueChange={(value) => updateStepConfig('selectedTag', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose tag" />
            </SelectTrigger>
            <SelectContent>
              {dummyTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedStep?.config?.conditionType === 'Field value equals' && (
        <div className="space-y-3">
          <div>
            <Label>Source</Label>
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
              <Label>Entity/Context</Label>
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
                placeholder="Enter custom value for comparison"
              />
            </div>
          )}
        </div>
      )}

      {selectedStep?.config?.conditionType === 'Score is' && (
        <div className="space-y-3">
          <div>
            <Label>Operator</Label>
            <Select
              value={selectedStep?.config?.scoreOperator || ''}
              onValueChange={(value) => updateStepConfig('scoreOperator', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {scoreOperators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStep?.config?.scoreOperator && (
            <div>
              <Label>Score Value</Label>
              <Input
                type="number"
                value={selectedStep?.config?.scoreValue || ''}
                onChange={(e) => updateStepConfig('scoreValue', e.target.value)}
                placeholder="Enter numerical value"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
