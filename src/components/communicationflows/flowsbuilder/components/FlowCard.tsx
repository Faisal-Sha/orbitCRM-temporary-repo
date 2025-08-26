import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { FlowCardProps } from '../types';
import { StepCard } from './StepCard';

export const FlowCard: React.FC<FlowCardProps> = ({
  flow,
  expandedFlow,
  setExpandedFlow,
  onUpdateFlow,
  onDeleteFlow,
  onAddStep,
  expandedSteps,
  onToggleStepExpansion,
  templates,
  customFields,
  context,
  formData,
  updateFormDataWithHistory,
  onUpdateStep,
  onDeleteStep,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  dragOverStep,
  editingStepName,
  setEditingStepName
}) => {
  const isExpanded = expandedFlow === flow.id;

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Switch
              checked={flow.enabled}
              onCheckedChange={(checked) => onUpdateFlow(flow.id, 'enabled', checked)}
            />
            <Input
              value={flow.name}
              onChange={(e) => onUpdateFlow(flow.id, 'name', e.target.value)}
              className="font-medium border-none p-0 h-auto shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedFlow(isExpanded ? null : flow.id)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteFlow(flow.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Communication Steps</Label>
              <Button variant="outline" size="sm" onClick={() => onAddStep(flow.id)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {(flow.steps || []).map((step: any, index: number) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={index}
                  flowId={flow.id}
                  isExpanded={expandedSteps[step.id] || false}
                  onToggleExpansion={onToggleStepExpansion}
                  onUpdateStep={onUpdateStep}
                  onDeleteStep={onDeleteStep}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  isDraggedOver={dragOverStep?.id === step.id}
                  editingStepName={editingStepName}
                  setEditingStepName={setEditingStepName}
                  templates={templates}
                  customFields={customFields}
                  context={context}
                  formData={formData}
                  updateFormDataWithHistory={updateFormDataWithHistory}
                />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};