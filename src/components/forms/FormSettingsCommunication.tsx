
import React, { useCallback, useRef } from 'react';
import { CommunicationTab } from '@/components/communicationflows/CommunicationTab';

interface FormSettingsCommunicationProps {
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export const FormSettingsCommunication: React.FC<FormSettingsCommunicationProps> = ({
  formData,
  setFormData,
  updateFormDataWithHistory,
}) => {
  // Create a debounced version of updateFormDataWithHistory
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedUpdateFormDataWithHistory = useCallback((newFormData: any, actionType: string, description: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (updateFormDataWithHistory) {
        updateFormDataWithHistory(newFormData, actionType, description);
      }
    }, 1000); // Debounce for 1 second
  }, [updateFormDataWithHistory]);

  // Generate custom fields from form steps for shortcode system
  const generateCustomFieldsFromForm = () => {
    const customFields: any[] = [];
    
    // Add default form shortcodes
    customFields.push(
      { id: 'form_title', label: 'FORM_TITLE' },
      { id: 'quiz_score', label: 'QUIZ_SCORE' }
    );
    
    // Add shortcodes for all form elements
    formData.steps?.forEach((step: any, stepIndex: number) => {
      step.elements?.forEach((element: any, elementIndex: number) => {
        if (!['next', 'previous', 'save', 'submit', 'linebreak'].includes(element.type)) {
          customFields.push({
            id: `${stepIndex}_${elementIndex}`,
            label: element.label?.toLowerCase().replace(/\s+/g, '_') || `field_${stepIndex}_${elementIndex}`
          });
        }
      });
    });
    
    return customFields;
  };

  const customFields = generateCustomFieldsFromForm();

  return (
    <div className="space-y-6 p-6">
      <CommunicationTab
        editing={{
          ...formData,
          communicationFlows: formData.settings?.communicationFlows || [],
          communicationTemplates: formData.settings?.communicationTemplates || []
        }}
        setEditing={(editing) => {
          const newData = {
            ...formData,
            settings: {
              ...formData.settings,
              communicationFlows: editing.communicationFlows,
              communicationTemplates: editing.communicationTemplates
            }
          };
          
          // Always update local state immediately
          setFormData(newData);
          
          // Use debounced history update to prevent page jumps
          if (updateFormDataWithHistory) {
            debouncedUpdateFormDataWithHistory(newData, 'communication', 'Communication settings updated');
          }
        }}
        customFields={customFields}
        context="form"
        formData={formData}
        updateFormDataWithHistory={debouncedUpdateFormDataWithHistory}
      />
    </div>
  );
};
