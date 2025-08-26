
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormConfirmationPages } from './FormConfirmationPages';
import { CommunicationTemplates } from '@/components/communicationflows/templates';

interface FormSettingsConfirmationProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FormSettingsConfirmation: React.FC<FormSettingsConfirmationProps> = ({
  formData,
  setFormData,
}) => {
  const [templates, setTemplates] = useState<any[]>(formData.settings?.confirmationTemplates || []);

  const handleTemplatesChange = (newTemplates: any[]) => {
    setTemplates(newTemplates);
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        confirmationTemplates: newTemplates
      }
    });
  };

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
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="mt-6">
          <FormConfirmationPages
            formData={formData}
            setFormData={setFormData}
            templates={templates}
            setTemplates={handleTemplatesChange}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <CommunicationTemplates
            templates={templates}
            setTemplates={handleTemplatesChange}
            customFields={customFields}
            context="confirmation"
            formData={formData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
