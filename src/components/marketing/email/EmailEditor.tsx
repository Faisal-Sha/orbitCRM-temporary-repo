
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorTab from './EditorTab';
import { CommunicationTemplates } from '@/components/communicationflows/templates/CommunicationTemplates';
import { CampaignData } from './Create';

interface EmailEditorProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ 
  data, 
  onUpdate
}) => {
  const [templates, setTemplates] = useState<any[]>([]);

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'email_campaign',
      usedByEmailCampaigns: []
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <EditorTab 
            data={data}
            onUpdate={onUpdate}
            templates={templates}
            onSaveTemplate={handleSaveTemplate}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <CommunicationTemplates
              templates={templates}
              setTemplates={setTemplates}
              customFields={[]}
              context="email_campaign"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailEditor;
