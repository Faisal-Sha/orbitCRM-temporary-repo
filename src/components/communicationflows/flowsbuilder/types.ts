
export interface FlowsBuilderProps {
  flows: any[];
  setFlows: (flows: any[]) => void;
  templates: any[];
  customFields: any[];
  context?: 'calendar' | 'form';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export interface Flow {
  id: number;
  name: string;
  enabled: boolean;
  steps: Step[];
}

export interface Step {
  id: number;
  name: string;
  type: 'email' | 'sms' | 'aivoice';
  triggerTime: string;
  customTriggerValue: string;
  customTriggerUnit: string;
  triggerButton: string;
  enabled: boolean;
  content: string;
  subject?: string;
  fromName?: string;
  fromAddress?: string;
  bccAddress?: string;
  ccAddress?: string;
  replyTo?: string;
  placeholderText?: string;
  fromNumber?: string;
  voice?: string;
  knowledgeBase?: string;
}

export interface FlowCardProps {
  flow: Flow;
  expandedFlow: number | null;
  setExpandedFlow: (flowId: number | null) => void;
  onUpdateFlow: (flowId: number, field: string, value: any) => void;
  onDeleteFlow: (flowId: number) => void;
  onAddStep: (flowId: number) => void;
  expandedSteps: { [key: string]: boolean };
  onToggleStepExpansion: (stepId: number) => void;
  templates: any[];
  customFields: any[];
  context: 'calendar' | 'form';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
  onUpdateStep: (flowId: number, stepId: number, field: string, value: any) => void;
  onDeleteStep: (flowId: number, stepId: number) => void;
  onDragStart: (e: React.DragEvent, step: any) => void;
  onDragOver: (e: React.DragEvent, step: any) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetStep: any, flowId: number) => void;
  dragOverStep: any;
  editingStepName: number | null;
  setEditingStepName: (stepId: number | null) => void;
}

export interface StepCardProps {
  step: Step;
  index: number;
  flowId: number;
  isExpanded: boolean;
  onToggleExpansion: (stepId: number) => void;
  onUpdateStep: (flowId: number, stepId: number, field: string, value: any) => void;
  onDeleteStep: (flowId: number, stepId: number) => void;
  onDragStart: (e: React.DragEvent, step: any) => void;
  onDragOver: (e: React.DragEvent, step: any) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetStep: any, flowId: number) => void;
  isDraggedOver: boolean;
  editingStepName: number | null;
  setEditingStepName: (stepId: number | null) => void;
  templates: any[];
  customFields: any[];
  context: 'calendar' | 'form';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
