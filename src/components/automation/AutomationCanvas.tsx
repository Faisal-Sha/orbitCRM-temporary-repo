
import React, { useState } from 'react';
import { Plus, Mail, MessageSquare, Phone, Clock, GitBranch, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepTypeSelector } from './StepTypeSelector';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
  x: number;
  y: number;
}

interface AutomationCanvasProps {
  steps: WorkflowStep[];
  selectedStep: string | null;
  onStepSelect: (stepId: string) => void;
  onAddStep: (type: string, afterStepId?: string) => void;
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
  steps,
  selectedStep,
  onStepSelect,
  onAddStep,
}) => {
  const [showStepSelector, setShowStepSelector] = useState(false);
  const [addAfterStepId, setAddAfterStepId] = useState<string | undefined>();

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Settings className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'delay':
        return <Clock className="h-5 w-5" />;
      case 'condition':
        return <GitBranch className="h-5 w-5" />;
      case 'action':
        return <Users className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string, configured: boolean) => {
    if (!configured) return 'border-red-300 bg-red-50';
    
    // All configured steps use the same blue color as configured trigger
    return 'border-blue-300 bg-blue-50';
  };

  const handleStepClick = (stepId: string) => {
    console.log('Step clicked:', stepId);
    onStepSelect(stepId);
  };

  const handleAddStepClick = (afterStepId?: string) => {
    console.log('Add step clicked, afterStepId:', afterStepId);
    setAddAfterStepId(afterStepId);
    setShowStepSelector(true);
  };

  const handleStepTypeSelect = (type: string) => {
    console.log('Step type selected:', type, 'afterStepId:', addAfterStepId);
    onAddStep(type, addAfterStepId);
    setAddAfterStepId(undefined);
  };

  return (
    <>
      <div className="h-full bg-gray-50 relative overflow-auto p-6">
        <div className="flex flex-col items-center space-y-4 min-h-full">
          {steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Building Your Workflow</h3>
                <p className="text-gray-500">Add a trigger to begin your automation</p>
              </div>
              <Button onClick={() => handleAddStepClick()} variant="outline" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Trigger
              </Button>
            </div>
          ) : (
            steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <Card
                  className={`w-64 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedStep === step.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  } ${getStepColor(step.type, step.configured)}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${selectedStep === step.id ? 'text-blue-600' : ''}`}>
                        {getStepIcon(step.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${selectedStep === step.id ? 'text-blue-900' : 'text-gray-900'}`}>
                          {step.name}
                        </h4>
                        {!step.configured && (
                          <p className="text-xs text-red-600 mt-1">Configuration required</p>
                        )}
                        {step.configured && (
                          <p className="text-xs text-green-600 mt-1">Configured</p>
                        )}
                      </div>
                      {!step.configured && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {step.configured && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="h-8 w-px bg-gray-300 my-2"></div>
                )}
                
                {index === steps.length - 1 && (
                  <div className="mt-4">
                    <Button onClick={() => handleAddStepClick(step.id)} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <StepTypeSelector
        isOpen={showStepSelector}
        onClose={() => setShowStepSelector(false)}
        onSelectType={handleStepTypeSelect}
      />
    </>
  );
};
