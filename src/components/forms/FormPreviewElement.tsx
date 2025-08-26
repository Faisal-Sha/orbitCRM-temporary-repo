
import React, { useEffect } from 'react';
import { BasicInputElement } from './preview/BasicInputElement';
import { TextareaElement } from './preview/TextareaElement';
import { SelectElement } from './preview/SelectElement';
import { StaticElements } from './preview/StaticElements';
import { ActionButtonElement } from './preview/ActionButtonElement';
import { DateTimeElement } from './preview/DateTimeElement';
import { RatingElement } from './preview/RatingElement';
import { SpecialElements } from './preview/SpecialElements';
import { populateDataSource } from '@/utils/dataSourcePopulator';

interface FormPreviewElementProps {
  element: any;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  hiddenElements: Set<string>;
  disabledElements: Set<string>;
  requiredElements: Set<string>;
  userLoginStatus: string;
  repeaterValues: Record<string, any[]>;
  signatureCanvasRefs: React.MutableRefObject<Record<string, HTMLCanvasElement>>;
  updateFormValue: (elementId: string, value: any) => void;
  setRepeaterValues: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
  canNavigateNext: () => boolean;
  currentStep: number;
  formData: any;
}

export const FormPreviewElement: React.FC<FormPreviewElementProps> = ({
  element,
  formValues,
  errors,
  hiddenElements,
  disabledElements,
  requiredElements,
  userLoginStatus,
  repeaterValues,
  signatureCanvasRefs,
  updateFormValue,
  setRepeaterValues,
  handleNext,
  handlePrevious,
  handleSubmit,
  canNavigateNext,
  currentStep,
  formData,
}) => {
  // Handle hidden fields with data sources
  useEffect(() => {
    if (element.type === 'hidden' && element.dataSource && element.dataSource.type !== 'none') {
      const populatedValue = populateDataSource(element.dataSource);
      if (populatedValue !== null && populatedValue !== formValues[element.id]) {
        updateFormValue(element.id, populatedValue);
      }
    }
  }, [element, formValues, updateFormValue]);

  // Handle prepopulated fields
  useEffect(() => {
    if (element.type === 'prepopulated' && element.sourceField && formValues[element.sourceField]) {
      const sourceValue = formValues[element.sourceField];
      if (sourceValue && sourceValue !== formValues[element.id]) {
        updateFormValue(element.id, sourceValue);
      }
    }
  }, [element, formValues, updateFormValue]);

  // Don't render hidden fields visually, but they still exist in the form data
  if (element.type === 'hidden' || hiddenElements.has(element.id)) {
    return null;
  }

  // Check user status visibility
  if (element.userStatus && element.userStatus !== 'any') {
    if (element.userStatus === 'logged_in' && userLoginStatus !== 'logged_in') {
      return null;
    }
    if (element.userStatus === 'logged_out' && userLoginStatus !== 'logged_out') {
      return null;
    }
  }

  const value = formValues[element.id] || '';
  const error = errors[element.id];
  const isDisabled = disabledElements.has(element.id);
  const isRequired = element.required || requiredElements.has(element.id);

  const commonProps = {
    element,
    value,
    updateFormValue,
    isDisabled,
    isRequired,
    error,
    formValues,
    errors,
    hiddenElements,
    disabledElements,
    requiredElements,
    userLoginStatus,
  };

  switch (element.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'address':
    case 'number':
    case 'url':
    case 'password':
    case 'prepopulated': // Handle prepopulated as a basic input element
      return <BasicInputElement {...commonProps} />;

    case 'textarea':
      return <TextareaElement {...commonProps} />;

    case 'dropdown':
    case 'radio':
    case 'checkbox':
    case 'quiz_dropdown':
    case 'quiz_radio':
    case 'quiz_checkbox':
      return <SelectElement {...commonProps} />;

    case 'heading':
    case 'paragraph':
    case 'linebreak':
      return <StaticElements element={element} />;

    case 'next':
    case 'previous':
    case 'save':
    case 'submit':
      return (
        <ActionButtonElement
          element={element}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleSubmit={handleSubmit}
          canNavigateNext={canNavigateNext}
          currentStep={currentStep}
          formData={formData}
          formValues={formValues}
        />
      );

    case 'datetime':
      return <DateTimeElement {...commonProps} />;

    case 'rating':
    case 'quiz_slider':
      return <RatingElement {...commonProps} />;

    case 'signature':
    case 'fileupload':
    case 'recaptcha':
    case 'repeater':
      return (
        <SpecialElements
          {...commonProps}
          repeaterValues={repeaterValues}
          setRepeaterValues={setRepeaterValues}
          signatureCanvasRefs={signatureCanvasRefs}
        />
      );

    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-md">
          <p className="text-sm text-gray-500">
            Unsupported element type: {element.type}
          </p>
        </div>
      );
  }
};
