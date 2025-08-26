
import React from 'react';
import { FormElementsFields } from './FormElementsFields';
import { FormElementsCanvas } from './FormElementsCanvas';
import { FormElementsProperties } from './FormElementsProperties';

interface FormDesignTabProps {
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const FormDesignTab: React.FC<FormDesignTabProps> = ({
  formData,
  setFormData,
  updateFormDataWithHistory,
  selectedElement,
  setSelectedElement,
  currentStep,
  setCurrentStep,
}) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* Elements Palette - with vertical scroll */}
      <div className="col-span-3 border-r border-border pr-4 overflow-y-auto">
        <FormElementsFields 
          formData={formData}
          setFormData={setFormData}
          currentStep={currentStep}
          setSelectedElement={setSelectedElement}
        />
      </div>

      {/* Canvas Area - with vertical scroll */}
      <div className="col-span-6 overflow-y-auto">
        <FormElementsCanvas
          formData={formData}
          setFormData={setFormData}
          updateFormDataWithHistory={updateFormDataWithHistory}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>

      {/* Properties Panel - with vertical scroll */}
      <div className="col-span-3 border-l border-border pl-4 overflow-y-auto">
        <FormElementsProperties
          selectedElement={selectedElement}
          formData={formData}
          setFormData={setFormData}
          updateFormDataWithHistory={updateFormDataWithHistory}
        />
      </div>
    </div>
  );
};
