
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSettingsGeneral } from './FormSettingsGeneral';
import { FormSettingsQuiz } from './FormSettingsQuiz';
import { FormSettingsConfirmation } from './FormSettingsConfirmation';
import { FormSettingsCommunication } from './FormSettingsCommunication';
import { FormSettingsPDF } from './FormSettingsPDF';
import { FormSettingsConditional } from './FormSettingsConditional';

interface FormSettingsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export const FormSettingsTab: React.FC<FormSettingsTabProps> = ({
  formData,
  setFormData,
  updateFormDataWithHistory,
}) => {
  const [templates, setTemplates] = useState<any[]>([]);

  return (
    <div className="p-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="conditional">Conditional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <FormSettingsGeneral formData={formData} setFormData={setFormData} />
        </TabsContent>
        
        <TabsContent value="quiz" className="mt-6">
          <FormSettingsQuiz formData={formData} setFormData={setFormData} />
        </TabsContent>
        
        <TabsContent value="confirmation" className="mt-6">
          <FormSettingsConfirmation 
            formData={formData} 
            setFormData={setFormData}
          />
        </TabsContent>
        
        <TabsContent value="communication" className="mt-6">
          <FormSettingsCommunication 
            formData={formData} 
            setFormData={setFormData}
            updateFormDataWithHistory={updateFormDataWithHistory}
          />
        </TabsContent>
        
        <TabsContent value="pdf" className="mt-6">
          <FormSettingsPDF 
            formData={formData} 
            setFormData={setFormData}
            templates={templates}
            setTemplates={setTemplates}
          />
        </TabsContent>
        
        <TabsContent value="conditional" className="mt-6">
          <FormSettingsConditional formData={formData} setFormData={setFormData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
