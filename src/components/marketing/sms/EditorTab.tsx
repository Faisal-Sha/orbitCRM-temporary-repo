
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TextEditor } from '@/components/texteditor/TextEditor';
import { CommunicationTemplates } from '@/components/communicationflows/templates';
import { generateShortcodes } from '@/utils/shortcodeGenerator';
import { SMSCampaignData } from './Create';

interface EditorTabProps {
  data: SMSCampaignData;
  onUpdate: (updates: Partial<SMSCampaignData>) => void;
  templates?: any[];
  onSaveTemplate?: (templateData: any) => void;
}

const EditorTab: React.FC<EditorTabProps> = ({ 
  data, 
  onUpdate, 
  templates = [],
  onSaveTemplate 
}) => {
  const [communicationTemplates, setCommunicationTemplates] = useState(templates);
  
  // Generate shortcodes for SMS campaign context
  const availableShortcodes = generateShortcodes([], 'sms_campaign');

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'sms_campaign',
      usedBySMSCampaigns: []
    };
    setCommunicationTemplates(prev => [...prev, newTemplate]);
    if (onSaveTemplate) {
      onSaveTemplate(newTemplate);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">SMS Content Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Create and edit your SMS campaign content with personalization shortcodes. Keep messages under 160 characters for best delivery.
                </p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Character Count:</span>
                  <span className={`text-sm ${data.message.length > 160 ? 'text-red-500' : 'text-green-600'}`}>
                    {data.message.length}/160
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      data.message.length > 160 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((data.message.length / 160) * 100, 100)}%` }}
                  />
                </div>
                {data.message.length > 160 && (
                  <p className="text-xs text-red-500 mt-1">
                    Messages over 160 characters will be split into multiple SMS messages.
                  </p>
                )}
              </div>

              <TextEditor
                value={data.message || ''}
                onChange={(content) => onUpdate({ message: content })}
                availableShortcodes={availableShortcodes}
                templates={communicationTemplates}
                onSaveTemplate={handleSaveTemplate}
                templateType="sms"
                context="sms_campaign"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <CommunicationTemplates
              templates={communicationTemplates}
              setTemplates={setCommunicationTemplates}
              customFields={[]}
              context="sms_campaign"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorTab;
