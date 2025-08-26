import React from 'react';

interface FormPreviewStepNavigationProps {
  formData: any;
  currentStep: number;
}

export const FormPreviewStepNavigation: React.FC<FormPreviewStepNavigationProps> = ({
  formData,
  currentStep,
}) => {
  // Hide entire step navigation if showFormSteps is false
  if (formData.settings?.showFormSteps === false || formData.steps.length <= 1) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {formData.steps.map((step: any, index: number) => (
            <div
              key={step.id}
              className={`px-3 py-1 rounded text-sm ${
                index === currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : index < currentStep 
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {formData.settings?.showStepNames !== false ? (
                step.name || `Step ${index + 1}`
              ) : (
                // When showStepNames is false, show empty content but keep the styled bubble
                <span className="opacity-0 select-none pointer-events-none">
                  {step.name || `Step ${index + 1}`}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {formData.steps.length}
        </div>
      </div>
    </div>
  );
};
