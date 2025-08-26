export const getStepTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return '📧';
    case 'sms': return '💬';
    case 'aivoice': return '🎤';
    default: return '📄';
  }
};

export const getStepTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-800';
    case 'sms': return 'bg-green-100 text-green-800';
    case 'aivoice': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getButtonElements = (formData?: any) => {
  if (!formData?.steps) return [];
  const buttons: any[] = [];
  formData.steps.forEach((step: any, stepIndex: number) => {
    step.elements?.forEach((element: any, elementIndex: number) => {
      if (['next', 'previous', 'save', 'submit'].includes(element.type)) {
        buttons.push({
          id: `${stepIndex}_${elementIndex}`,
          label: element.label || element.type,
          stepIndex,
          elementIndex
        });
      }
    });
  });
  return buttons;
};

export const createNewFlow = (flows: any[]) => ({
  id: Date.now(),
  name: `Communication Flow ${flows.length + 1}`,
  enabled: true,
  steps: []
});

export const createNewStep = (context: string) => {
  const newStepId = Date.now();
  return {
    id: newStepId,
    name: 'Communication Step',
    type: 'email',
    triggerTime: context === 'calendar' ? 'immediately' : 'immediately',
    customTriggerValue: '',
    customTriggerUnit: 'minutes',
    triggerButton: '',
    enabled: true,
    content: '',
    subject: '',
    fromName: '',
    fromAddress: '',
    bccAddress: '',
    ccAddress: '',
    replyTo: '',
    placeholderText: '',
    fromNumber: '',
    voice: 'kim',
    knowledgeBase: ''
  };
};