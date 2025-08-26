
import React, { useState } from 'react';
import PageContainer from "@/components/PageContainer";
import { AutomationCanvas } from '@/components/automation/AutomationCanvas';
import { AutomationSidebar } from '@/components/automation/AutomationSidebar';
import { AutomationEmailDesign } from '@/components/automation/AutomationEmailDesign';
import { AutomationSMSDesign } from '@/components/automation/AutomationSMSDesign';
import { AutomationCallDesign } from '@/components/automation/AutomationCallDesign';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Play, Pause, Undo, Redo } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'email' | 'sms' | 'call' | 'delay' | 'condition' | 'action';
  name: string;
  configured: boolean;
  config?: any;
  x: number;
  y: number;
}

interface HistoryState {
  steps: WorkflowStep[];
  selectedStep: string | null;
  workflowName: string;
  workflowSettings: {
    isActive: boolean;
    reEnrollment: 'once' | 'multiple';
  };
}

const Create = () => {
  const [workflowName, setWorkflowName] = useState('New Automation Workflow');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      type: 'trigger',
      name: 'Workflow Trigger',
      configured: false,
      config: {},
      x: 0,
      y: 0,
    }
  ]);
  const [selectedStep, setSelectedStep] = useState<string | null>('1');
  const [workflowSettings, setWorkflowSettings] = useState({
    isActive: false,
    reEnrollment: 'once' as 'once' | 'multiple',
  });
  const [currentEditor, setCurrentEditor] = useState<{
    type: 'email' | 'sms' | 'call' | null;
    stepId: string | null;
  }>({ type: null, stepId: null });

  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{
    steps,
    selectedStep,
    workflowName,
    workflowSettings,
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = (newState: Partial<HistoryState>) => {
    const currentState = {
      steps,
      selectedStep,
      workflowName,
      workflowSettings,
      ...newState,
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setSteps(previousState.steps);
      setSelectedStep(previousState.selectedStep);
      setWorkflowName(previousState.workflowName);
      setWorkflowSettings(previousState.workflowSettings);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSteps(nextState.steps);
      setSelectedStep(nextState.selectedStep);
      setWorkflowName(nextState.workflowName);
      setWorkflowSettings(nextState.workflowSettings);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleStepSelect = (stepId: string) => {
    console.log('handleStepSelect called with:', stepId);
    setSelectedStep(stepId);
  };

  const handleAddStep = (type: string, afterStepId?: string) => {
    console.log('handleAddStep called with type:', type, 'afterStepId:', afterStepId);
    
    const stepTypeNames = {
      email: 'Send Email',
      sms: 'Send SMS', 
      call: 'AI Voice Call',
      delay: 'Wait/Delay',
      condition: 'If/Then Branch',
      action: 'Contact Action',
    };

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: type as any,
      name: stepTypeNames[type as keyof typeof stepTypeNames] || 'New Step',
      configured: false,
      config: {},
      x: 0,
      y: steps.length * 100,
    };

    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    setSelectedStep(newStep.id);
    
    saveToHistory({
      steps: newSteps,
      selectedStep: newStep.id,
    });

    // Remove the toast notification for step addition
  };

  const handleDeleteStep = (stepId: string) => {
    if (stepId === '1') {
      toast.error('Cannot delete the trigger step');
      return;
    }

    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);
    
    if (selectedStep === stepId) {
      setSelectedStep('1');
    }
    
    saveToHistory({
      steps: newSteps,
      selectedStep: selectedStep === stepId ? '1' : selectedStep,
    });

    // Remove the toast notification for step deletion
  };

  const handleStepUpdate = (stepId: string, config: any) => {
    console.log('handleStepUpdate called:', stepId, config);
    const newSteps = steps.map(step => {
      if (step.id === stepId) {
        const isConfigured = checkStepConfiguration(step.type, config);
        return { 
          ...step, 
          config: { ...step.config, ...config },
          configured: isConfigured,
          name: config.name || step.name
        };
      }
      return step;
    });
    
    setSteps(newSteps);
    
    saveToHistory({
      steps: newSteps,
    });
  };

  const checkStepConfiguration = (type: string, config: any) => {
    switch (type) {
      case 'trigger':
        return !!config.triggerType;
      case 'email':
        return !!(config.subject && config.fromEmail && config.fromName);
      case 'sms':
        return !!(config.fromPhone && config.name);
      case 'call':
        return !!(config.fromPhone && config.voice && config.name);
      case 'delay':
        return !!(config.waitTime && config.timeUnit);
      case 'condition':
        return !!(config.conditionType);
      case 'action':
        return !!(config.actionType);
      default:
        return true;
    }
  };

  const handleOpenContentEditor = (stepId: string, type: string) => {
    console.log('handleOpenContentEditor called:', stepId, type);
    setCurrentEditor({ 
      type: type as 'email' | 'sms' | 'call', 
      stepId 
    });
  };

  const handleSaveContent = (content: any) => {
    if (currentEditor.stepId) {
      handleStepUpdate(currentEditor.stepId, { content: content.content, ...content });
    }
  };

  const handleBackToWorkflow = () => {
    setCurrentEditor({ type: null, stepId: null });
  };

  const handleSaveWorkflow = () => {
    toast.success('Workflow saved as draft');
  };

  const handleToggleActive = () => {
    const newActiveState = !workflowSettings.isActive;
    const newSettings = { ...workflowSettings, isActive: newActiveState };
    setWorkflowSettings(newSettings);
    
    if (newActiveState) {
      const unconfiguredSteps = steps.filter(step => !step.configured);
      if (unconfiguredSteps.length > 0) {
        toast.error(`Please configure all steps before activating. ${unconfiguredSteps.length} step(s) need attention.`);
        setWorkflowSettings(prev => ({ ...prev, isActive: false }));
        return;
      }
      toast.success('Workflow activated successfully');
    } else {
      toast.info('Workflow deactivated');
    }
    
    saveToHistory({
      workflowSettings: newSettings,
    });
  };

  const selectedStepData = steps.find(step => step.id === selectedStep) || null;
  
  console.log('Current state:', {
    selectedStep,
    selectedStepData,
    stepsCount: steps.length,
    currentEditor
  });

  // Show content editor if one is open
  if (currentEditor.type && currentEditor.stepId) {
    const stepData = steps.find(step => step.id === currentEditor.stepId);
    
    switch (currentEditor.type) {
      case 'email':
        return (
          <AutomationEmailDesign
            stepId={currentEditor.stepId}
            initialContent={stepData?.config}
            onSave={handleSaveContent}
            onBack={handleBackToWorkflow}
          />
        );
      case 'sms':
        return (
          <AutomationSMSDesign
            stepId={currentEditor.stepId}
            initialContent={stepData?.config}
            onSave={handleSaveContent}
            onBack={handleBackToWorkflow}
          />
        );
      case 'call':
        return (
          <AutomationCallDesign
            stepId={currentEditor.stepId}
            initialContent={stepData?.config}
            onSave={handleSaveContent}
            onBack={handleBackToWorkflow}
          />
        );
    }
  }

  // Main workflow builder interface
  return (
    <PageContainer
      title="Create Automation"
      description="Build automated workflows with triggers, communications, and actions"
    >
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Workflow Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
            <Button variant="outline" onClick={handleSaveWorkflow}>
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button 
              onClick={handleToggleActive}
              variant={workflowSettings.isActive ? "destructive" : "default"}
            >
              {workflowSettings.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Workflow Builder */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1">
            <AutomationCanvas
              steps={steps}
              selectedStep={selectedStep}
              onStepSelect={handleStepSelect}
              onAddStep={handleAddStep}
            />
          </div>

          {/* Sidebar */}
          <AutomationSidebar
            selectedStep={selectedStepData}
            onStepUpdate={handleStepUpdate}
            onAddStep={handleAddStep}
            onDeleteStep={handleDeleteStep}
            onOpenContentEditor={handleOpenContentEditor}
            workflowSettings={workflowSettings}
            onWorkflowSettingsUpdate={setWorkflowSettings}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Create;
