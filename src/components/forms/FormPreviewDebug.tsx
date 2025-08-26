
import React from 'react';

interface FormPreviewDebugProps {
  currentStep: number;
  formValues: Record<string, any>;
  calculateQuizScore: () => number;
  canNavigateNext: () => boolean;
}

export const FormPreviewDebug: React.FC<FormPreviewDebugProps> = ({
  currentStep,
  formValues,
  calculateQuizScore,
  canNavigateNext,
}) => {
  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-md text-xs">
      <h4 className="font-medium mb-2">Debug Info:</h4>
      <p>Current Step: {currentStep + 1}</p>
      <p>Form Values: {JSON.stringify(formValues, null, 2)}</p>
      <p>Quiz Score: {calculateQuizScore()}</p>
      <p>Can Navigate Next: {canNavigateNext().toString()}</p>
    </div>
  );
};
