import React, { useState, useRef } from 'react';
import { FormPreviewHeader } from './FormPreviewHeader';
import { FormPreviewStepNavigation } from './FormPreviewStepNavigation';
import { FormPreviewElement } from './FormPreviewElement';
import { FormPreviewSubmission } from './FormPreviewSubmission';
import { FormPreviewDebug } from './FormPreviewDebug';
import { useConditionalLogicEvaluator } from '@/hooks/useConditionalLogicEvaluator';

interface FormPreviewTabProps {
  formData: any;
}

export const FormPreviewTab: React.FC<FormPreviewTabProps> = ({ formData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userLoginStatus, setUserLoginStatus] = useState('any');
  const [repeaterValues, setRepeaterValues] = useState<Record<string, any[]>>({});
  const [triggeredConfirmationId, setTriggeredConfirmationId] = useState<string | null>(null);
  const signatureCanvasRefs = useRef<Record<string, HTMLCanvasElement>>({});
  
  const { evaluateRule, getTriggeredConfirmation } = useConditionalLogicEvaluator();

  // Calculate quiz score
  const calculateQuizScore = () => {
    let totalScore = 0;
    
    formData.steps?.forEach((step: any) => {
      step.elements?.forEach((element: any) => {
        if (element.type.includes('quiz') && formValues[element.id]) {
          if (element.type === 'quiz_slider') {
            totalScore += parseInt(formValues[element.id]) || 0;
          } else if (element.options) {
            const selectedOptions = Array.isArray(formValues[element.id]) 
              ? formValues[element.id] 
              : [formValues[element.id]];
            
            selectedOptions.forEach((selectedValue: any) => {
              const option = element.options.find((opt: any) => opt.text === selectedValue);
              if (option) {
                totalScore += option.score || 0;
              }
            });
          }
        }
      });
    });
    
    return totalScore;
  };

  // Apply conditional logic with proper initial state handling
  const applyConditionalLogic = () => {
    const rules = formData.settings?.conditionalRules || [];
    const hiddenElements = new Set<string>();
    const disabledElements = new Set<string>();
    const requiredElements = new Set<string>();
    const quizScore = calculateQuizScore();
    
    // First, determine which fields should be initially hidden based on conditional logic
    const fieldsWithConditions = new Set<string>();
    rules.forEach((rule: any) => {
      rule.actions.forEach((action: any) => {
        if (['show', 'hide'].includes(action.action)) {
          action.targetFields?.forEach((fieldId: string) => {
            fieldsWithConditions.add(fieldId);
          });
        }
      });
    });
    
    // For fields with show/hide conditions, start with them hidden by default
    fieldsWithConditions.forEach(fieldId => {
      const element = formData.steps?.flatMap((s: any) => s.elements)?.find((el: any) => el.id === fieldId);
      if (element && ['dropdown', 'radio', 'checkbox', 'quiz_dropdown', 'quiz_radio', 'quiz_checkbox', 'quiz_slider'].includes(element.type)) {
        // Selection-based fields start hidden
        hiddenElements.add(fieldId);
      } else if (element && ['text', 'email', 'phone', 'address', 'number', 'url', 'textarea'].includes(element.type)) {
        // Text input fields start hidden if they have text-based conditions
        const hasTextCondition = rules.some((rule: any) => 
          rule.conditions.some((condition: any) => 
            condition.triggerField === fieldId && 
            ['equals', 'contains', 'starts_with', 'ends_with'].includes(condition.operator)
          )
        );
        if (hasTextCondition) {
          hiddenElements.add(fieldId);
        }
      }
    });
    
    rules.forEach((rule: any) => {
      const conditionsMet = evaluateRule(rule, formValues, quizScore);
      
      if (conditionsMet) {
        rule.actions.forEach((action: any) => {
          action.targetFields?.forEach((fieldId: string) => {
            switch (action.action) {
              case 'hide':
                hiddenElements.add(fieldId);
                break;
              case 'show':
                hiddenElements.delete(fieldId);
                break;
              case 'disable':
                disabledElements.add(fieldId);
                break;
              case 'enable':
                disabledElements.delete(fieldId);
                break;
              case 'require':
                requiredElements.add(fieldId);
                break;
              case 'unrequire':
                requiredElements.delete(fieldId);
                break;
            }
          });
        });
      } else {
        // Apply otherwise actions
        const otherwiseActions = rule.otherwiseActions || [];
        otherwiseActions.forEach((action: any, index: number) => {
          if (action && rule.actions[index]) {
            const targetFields = action.targetFields || rule.actions[index].targetFields || [];
            targetFields.forEach((fieldId: string) => {
              switch (action.action) {
                case 'hide':
                  hiddenElements.add(fieldId);
                  break;
                case 'show':
                  hiddenElements.delete(fieldId);
                  break;
                case 'disable':
                  disabledElements.add(fieldId);
                  break;
                case 'enable':
                  disabledElements.delete(fieldId);
                  break;
                case 'require':
                  requiredElements.add(fieldId);
                  break;
                case 'unrequire':
                  requiredElements.delete(fieldId);
                  break;
                case 'do_not_show':
                  hiddenElements.add(fieldId);
                  break;
                case 'do_not_hide':
                  hiddenElements.delete(fieldId);
                  break;
              }
            });
          }
        });
      }
    });
    
    return { hiddenElements, disabledElements, requiredElements };
  };

  const { hiddenElements, disabledElements, requiredElements } = applyConditionalLogic();

  const updateFormValue = (elementId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [elementId]: value }));
    
    // Handle pre-populated fields
    formData.steps?.forEach((step: any) => {
      step.elements?.forEach((element: any) => {
        if (element.type === 'prepopulated' && element.sourceField === elementId) {
          setFormValues(prev => ({ ...prev, [element.id]: value }));
        }
      });
    });
    
    // Clear errors when user updates value
    if (errors[elementId]) {
      setErrors(prev => ({ ...prev, [elementId]: '' }));
    }
  };

  const validateStep = (stepIndex: number) => {
    const step = formData.steps[stepIndex];
    const stepErrors: Record<string, string> = {};
    
    step.elements?.forEach((element: any) => {
      if (hiddenElements.has(element.id)) return; // Skip validation for hidden elements
      
      const isRequired = element.required || requiredElements.has(element.id);
      const value = formValues[element.id];
      
      if (isRequired) {
        // Handle checkbox and quiz_checkbox validation properly
        if (element.type === 'checkbox' || element.type === 'quiz_checkbox') {
          if (!value || !Array.isArray(value) || value.length === 0) {
            stepErrors[element.id] = 'This field is required';
          }
        } else if (!value || value === '') {
          stepErrors[element.id] = 'This field is required';
        }
      }
      
      // Built-in validations
      if (value && element.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          stepErrors[element.id] = 'Please enter a valid email address';
        }
      }
      
      if (value && element.type === 'url') {
        const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$|^(https?:\/\/)[^\s]+$/;
        if (!urlRegex.test(value)) {
          stepErrors[element.id] = 'Please enter a valid URL';
        }
      }
      
      // Character limit validation
      if (value && element.minCharacters && value.length < parseInt(element.minCharacters)) {
        stepErrors[element.id] = `Minimum ${element.minCharacters} characters required`;
      }
      
      if (value && element.maxCharacters && value.length > parseInt(element.maxCharacters)) {
        stepErrors[element.id] = `Maximum ${element.maxCharacters} characters allowed`;
      }
    });
    
    return stepErrors;
  };

  // Helper function to find first validation error across all steps
  const findFirstValidationError = () => {
    for (let stepIndex = 0; stepIndex < formData.steps.length; stepIndex++) {
      const stepErrors = validateStep(stepIndex);
      const errorFieldIds = Object.keys(stepErrors);
      
      if (errorFieldIds.length > 0) {
        // Return first error field in this step
        const firstErrorFieldId = errorFieldIds[0];
        return {
          stepIndex,
          fieldId: firstErrorFieldId,
          error: stepErrors[firstErrorFieldId]
        };
      }
    }
    return null;
  };

  const canNavigateNext = () => {
    // If allowIncompleteNavigation is enabled, always allow navigation
    if (formData.settings?.allowIncompleteNavigation) {
      return true;
    }
    
    const stepErrors = validateStep(currentStep);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    // If allowIncompleteNavigation is disabled, validate before navigation
    if (!formData.settings?.allowIncompleteNavigation) {
      const stepErrors = validateStep(currentStep);
      
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    
    if (currentStep < formData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Always validate all steps on submit, regardless of allowIncompleteNavigation
    let allErrors: Record<string, string> = {};
    
    formData.steps.forEach((step: any, stepIndex: number) => {
      const stepErrors = validateStep(stepIndex);
      allErrors = { ...allErrors, ...stepErrors };
    });
    
    if (Object.keys(allErrors).length === 0) {
      // Check for conditional confirmations
      const quizScore = calculateQuizScore();
      const confirmationId = getTriggeredConfirmation(
        formData.settings?.conditionalRules || [], 
        formValues, 
        quizScore
      );
      
      if (confirmationId) {
        setTriggeredConfirmationId(confirmationId);
      }
      
      setIsSubmitted(true);
    } else {
      // Find the first validation error and navigate to it
      const firstError = findFirstValidationError();
      
      if (firstError) {
        // Navigate to the step with the error
        setCurrentStep(firstError.stepIndex);
        
        // Set all validation errors to show them
        setErrors(allErrors);
        
        // Focus on the field with error after a brief delay to ensure navigation completes
        setTimeout(() => {
          const errorField = document.getElementById(firstError.fieldId) || 
                           document.querySelector(`[name="${firstError.fieldId}"]`) ||
                           document.querySelector(`input[data-field-id="${firstError.fieldId}"]`);
          
          if (errorField) {
            errorField.focus();
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        // Fallback: just set errors without navigation
        setErrors(allErrors);
      }
    }
  };

  if (isSubmitted) {
    return (
      <FormPreviewSubmission
        formData={formData}
        formValues={formValues}
        calculateQuizScore={calculateQuizScore}
        triggeredConfirmationId={triggeredConfirmationId}
      />
    );
  }

  const currentStepData = formData.steps[currentStep];
  
  if (!currentStepData) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No steps configured. Please add steps in the Design tab.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FormPreviewHeader
        formData={formData}
        userLoginStatus={userLoginStatus}
        setUserLoginStatus={setUserLoginStatus}
      />

      <FormPreviewStepNavigation
        formData={formData}
        currentStep={currentStep}
      />

      {/* Form Elements with simplified flex layout */}
      <div className="flex flex-wrap gap-4">
        {currentStepData.elements?.map((element: any) => (
          <FormPreviewElement
            key={element.id}
            element={element}
            formValues={formValues}
            errors={errors}
            hiddenElements={hiddenElements}
            disabledElements={disabledElements}
            requiredElements={requiredElements}
            userLoginStatus={userLoginStatus}
            repeaterValues={repeaterValues}
            signatureCanvasRefs={signatureCanvasRefs}
            updateFormValue={updateFormValue}
            setRepeaterValues={setRepeaterValues}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleSubmit={handleSubmit}
            canNavigateNext={canNavigateNext}
            currentStep={currentStep}
            formData={formData}
          />
        ))}
      </div>

      <FormPreviewDebug
        currentStep={currentStep}
        formValues={formValues}
        calculateQuizScore={calculateQuizScore}
        canNavigateNext={canNavigateNext}
      />
    </div>
  );
};
