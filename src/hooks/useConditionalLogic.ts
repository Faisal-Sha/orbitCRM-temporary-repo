
import { useEffect, useState } from 'react';

interface ConditionalCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConditionalRule {
  id: string;
  name: string;
  conditions: ConditionalCondition[];
  logicOperator: 'AND' | 'OR';
  action: string;
  targetFields: string[];
}

interface FormElement {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  showLabel: boolean;
  options?: { label: string; value: string; score?: number }[];
  validation?: any;
  stepId: string;
  hidden?: boolean;
  userStatus?: 'any' | 'logged-in' | 'logged-out';
}

interface ConfirmationPage {
  id: string;
  name: string;
  type: 'redirect' | 'design';
  redirectUrl?: string;
  designContent?: string;
  conditions?: ConditionalCondition[];
  logicOperator?: 'AND' | 'OR';
}

interface EmailConfiguration {
  id: string;
  name: string;
  recipient: string;
  from: string;
  bcc: string;
  cc: string;
  content: string;
  conditions?: ConditionalCondition[];
  logicOperator?: 'AND' | 'OR';
}

export const useConditionalLogic = (
  rules: ConditionalRule[],
  formData: Record<string, any>,
  elements: FormElement[]
) => {
  const [elementStates, setElementStates] = useState<Record<string, {
    visible: boolean;
    enabled: boolean;
    required: boolean;
  }>>({});

  // Calculate total quiz score from form data
  const calculateQuizScore = () => {
    let totalScore = 0;
    elements.forEach(element => {
      if (element.type === 'radio' || element.type === 'checkbox') {
        const fieldValue = formData[element.id];
        if (fieldValue && element.options) {
          if (Array.isArray(fieldValue)) {
            // For checkbox arrays
            fieldValue.forEach(value => {
              const option = element.options?.find(opt => opt.value === value);
              if (option?.score) {
                totalScore += option.score;
              }
            });
          } else {
            // For radio or single checkbox
            const option = element.options.find(opt => opt.value === fieldValue);
            if (option?.score) {
              totalScore += option.score;
            }
          }
        }
      }
    });
    return totalScore;
  };

  useEffect(() => {
    // Initialize element states based on their default properties
    const initialStates: Record<string, { visible: boolean; enabled: boolean; required: boolean }> = {};
    elements.forEach(element => {
      initialStates[element.id] = {
        visible: !element.hidden,
        enabled: true,
        required: element.required
      };
    });

    // Track which fields have been affected by rules to avoid conflicts
    const affectedFields = new Set<string>();
    
    // Process each rule independently
    rules.forEach(rule => {
      
      // Evaluate all conditions for this rule
      const conditionResults = rule.conditions.map(condition => {
        let fieldValue;
        
        // Handle special quiz score field
        if (condition.field === 'QUIZ_SCORE') {
          fieldValue = calculateQuizScore();
        } else {
          fieldValue = formData[condition.field];
        }
        
        const result = evaluateCondition(fieldValue, condition.operator, condition.value);
        return result;
      });

      // Apply logic operator to determine if rule should trigger
      const ruleMatches = rule.logicOperator === 'AND' 
        ? conditionResults.every(result => result)
        : conditionResults.some(result => result);

      if (ruleMatches) {
        // Apply action to target fields
        rule.targetFields.forEach(fieldId => {
          if (initialStates[fieldId]) {
            
            switch (rule.action) {
              case 'show':
                initialStates[fieldId].visible = true;
                break;
              case 'hide':
                initialStates[fieldId].visible = false;
                break;
              case 'enable':
                initialStates[fieldId].enabled = true;
                break;
              case 'disable':
                initialStates[fieldId].enabled = false;
                break;
              case 'require':
                initialStates[fieldId].required = true;
                break;
              case 'unrequire':
                initialStates[fieldId].required = false;
                break;
            }
            
            affectedFields.add(fieldId);
          }
        });
      } else {
        // Rule doesn't match, ensure opposite action is applied if needed
        rule.targetFields.forEach(fieldId => {
          if (initialStates[fieldId] && !affectedFields.has(fieldId)) {
            // Only apply opposite action if this field hasn't been affected by other rules
            switch (rule.action) {
              case 'show':
                // If rule was supposed to show but doesn't match, don't force hide
                // unless this is the only rule affecting this field
                break;
              case 'hide':
                // If rule was supposed to hide but doesn't match, ensure it's visible
                initialStates[fieldId].visible = true;
                break;
              case 'enable':
                // If rule was supposed to enable but doesn't match, don't force disable
                break;
              case 'disable':
                // If rule was supposed to disable but doesn't match, ensure it's enabled
                initialStates[fieldId].enabled = true;
                break;
              case 'require':
                // If rule was supposed to require but doesn't match, don't force unrequire
                break;
              case 'unrequire':
                initialStates[fieldId].required = false;
                break;
            }
          }
        });
      }
    });

    setElementStates(initialStates);
  }, [rules, formData, elements]);

  return elementStates;
};

// Helper function to evaluate confirmation page conditions
export const evaluateConfirmationConditions = (
  pages: ConfirmationPage[],
  formData: Record<string, any>,
  elements: FormElement[]
): ConfirmationPage | null => {
  const calculateQuizScore = () => {
    let totalScore = 0;
    elements.forEach(element => {
      if (element.type === 'radio' || element.type === 'checkbox') {
        const fieldValue = formData[element.id];
        if (fieldValue && element.options) {
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach(value => {
              const option = element.options?.find(opt => opt.value === value);
              if (option?.score) {
                totalScore += option.score;
              }
            });
          } else {
            const option = element.options.find(opt => opt.value === fieldValue);
            if (option?.score) {
              totalScore += option.score;
            }
          }
        }
      }
    });
    return totalScore;
  };

  // Find the first page whose conditions are met
  for (const page of pages) {
    if (!page.conditions || page.conditions.length === 0) continue;

    const conditionResults = page.conditions.map(condition => {
      let fieldValue;
      
      if (condition.field === 'QUIZ_SCORE') {
        fieldValue = calculateQuizScore();
      } else {
        // Try to find field by ID first, then by label
        fieldValue = formData[condition.field];
        if (fieldValue === undefined) {
          // If not found by ID, try to find by matching label
          const element = elements.find(el => el.label === condition.field);
          if (element) {
            fieldValue = formData[element.id];
          }
        }
      }
      
      return evaluateCondition(fieldValue, condition.operator, condition.value);
    });

    const pageMatches = page.logicOperator === 'AND' 
      ? conditionResults.every(result => result)
      : conditionResults.some(result => result);

    if (pageMatches) {
      return page;
    }
  }

  return null;
};

// Helper function to evaluate email configuration conditions
export const evaluateEmailConditions = (
  configurations: EmailConfiguration[],
  formData: Record<string, any>,
  elements: FormElement[]
): EmailConfiguration | null => {
  const calculateQuizScore = () => {
    let totalScore = 0;
    elements.forEach(element => {
      if (element.type === 'radio' || element.type === 'checkbox') {
        const fieldValue = formData[element.id];
        if (fieldValue && element.options) {
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach(value => {
              const option = element.options?.find(opt => opt.value === value);
              if (option?.score) {
                totalScore += option.score;
              }
            });
          } else {
            const option = element.options.find(opt => opt.value === fieldValue);
            if (option?.score) {
              totalScore += option.score;
            }
          }
        }
      }
    });
    return totalScore;
  };

  // Find the first configuration whose conditions are met
  for (const config of configurations) {
    if (!config.conditions || config.conditions.length === 0) continue;

    const conditionResults = config.conditions.map(condition => {
      let fieldValue;
      
      if (condition.field === 'QUIZ_SCORE') {
        fieldValue = calculateQuizScore();
      } else {
        // Try to find field by ID first, then by label
        fieldValue = formData[condition.field];
        if (fieldValue === undefined) {
          // If not found by ID, try to find by matching label
          const element = elements.find(el => el.label === condition.field);
          if (element) {
            fieldValue = formData[element.id];
          }
        }
      }
      
      return evaluateCondition(fieldValue, condition.operator, condition.value);
    });

    const configMatches = config.logicOperator === 'AND' 
      ? conditionResults.every(result => result)
      : conditionResults.some(result => result);

    if (configMatches) {
      return config;
    }
  }

  return null;
};

const evaluateCondition = (fieldValue: any, operator: string, targetValue: string): boolean => {
  const value = fieldValue !== undefined ? String(fieldValue) : '';
  
  switch (operator) {
    case 'equals':
      return value === targetValue;
    case 'not_equals':
      return value !== targetValue;
    case 'greater_than':
      return parseFloat(value) > parseFloat(targetValue);
    case 'less_than':
      return parseFloat(value) < parseFloat(targetValue);
    case 'contains':
      return value.toLowerCase().includes(targetValue.toLowerCase());
    case 'not_contains':
      return !value.toLowerCase().includes(targetValue.toLowerCase());
    case 'is_empty':
      return value === '' || value === null || value === undefined;
    case 'is_not_empty':
      return value !== '' && value !== null && value !== undefined;
    case 'is_checked':
      return fieldValue === true || fieldValue === 'true' || fieldValue === 'on';
    case 'is_unchecked':
      return fieldValue === false || fieldValue === 'false' || fieldValue === '' || fieldValue === undefined;
    default:
      return false;
  }
};
