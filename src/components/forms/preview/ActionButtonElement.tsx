
import React from 'react';
import { Button } from '@/components/ui/button';
import { getWidthClass } from './utils';

interface ActionButtonElementProps {
  element: any;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
  canNavigateNext: () => boolean;
  currentStep: number;
  formData: any;
  formValues: Record<string, any>;
}

export const ActionButtonElement: React.FC<ActionButtonElementProps> = ({
  element,
  handleNext,
  handlePrevious,
  handleSubmit,
  canNavigateNext,
  currentStep,
  formData,
  formValues,
}) => {
  switch (element.type) {
    case 'next':
      return (
        <Button
          onClick={handleNext}
          disabled={!canNavigateNext() || currentStep >= formData.steps.length - 1}
          className={getWidthClass(element.width)}
        >
          {element.label}
        </Button>
      );

    case 'previous':
      return (
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentStep <= 0}
          className={getWidthClass(element.width)}
        >
          {element.label}
        </Button>
      );

    case 'save':
      return (
        <Button
          onClick={() => {
            console.log('Form saved:', formValues);
            alert('Form saved successfully!');
          }}
          variant="secondary"
          className={getWidthClass(element.width)}
        >
          {element.label}
        </Button>
      );

    case 'submit':
      return (
        <Button
          onClick={handleSubmit}
          variant="default"
          className={getWidthClass(element.width)}
        >
          {element.label}
        </Button>
      );

    default:
      return null;
  }
};
