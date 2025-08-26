
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormPDFBuilder } from './FormPDFBuilder';
import { CommunicationTemplates } from '@/components/communicationflows/templates';

interface FormSettingsPDFProps {
  formData: any;
  setFormData: (data: any) => void;
  templates: any[];
  setTemplates: (templates: any[]) => void;
}

export const FormSettingsPDF: React.FC<FormSettingsPDFProps> = ({
  formData,
  setFormData,
  templates,
  setTemplates,
}) => {
  const [activeTab, setActiveTab] = useState('pdfs');

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'pdf'
    };
    setTemplates([...templates, newTemplate]);
  };

  return (
    <div className="space-y-6 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdfs" className="space-y-6">
          <FormPDFBuilder
            formData={formData}
            setFormData={setFormData}
            templates={templates}
            onSaveTemplate={handleSaveTemplate}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <CommunicationTemplates
            templates={templates}
            setTemplates={setTemplates}
            customFields={[]}
            context="pdf"
            formData={formData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
