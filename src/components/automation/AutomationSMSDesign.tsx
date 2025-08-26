
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextEditor } from '@/components/texteditor/TextEditor';
import { CommunicationTemplates } from '@/components/communicationflows/templates/CommunicationTemplates';
import { generateShortcodes } from '@/utils/shortcodeGenerator';

interface AutomationSMSDesignProps {
  stepId: string;
  initialContent?: {
    content: string;
  };
  onSave: (content: any) => void;
  onBack: () => void;
}

export const AutomationSMSDesign: React.FC<AutomationSMSDesignProps> = ({
  stepId,
  initialContent,
  onSave,
  onBack,
}) => {
  const [smsContent, setSmsContent] = useState({
    content: initialContent?.content || 'Hi {{Contact.FirstName}}, this is a message from {{Company.Name}}...',
  });

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Client Welcome SMS',
      type: 'sms',
      context: 'sms_automation',
      content: 'Hi {{Contact.FirstName}}, welcome to {{Company.Name}}! We\'re excited to work with you. Reply STOP to opt out.',
      usedBySMSAutomation: ['Welcome Sequence', 'Client Onboarding']
    },
    {
      id: 2,
      name: 'Appointment Reminder',
      type: 'sms',
      context: 'sms_automation',
      content: 'Hi {{Contact.FirstName}}, this is a reminder of your {{Appointment.Type}} appointment tomorrow at {{Appointment.Time}}. Reply STOP to opt out.',
      usedBySMSAutomation: ['Appointment Reminders']
    },
    {
      id: 3,
      name: 'Clinician Onboarding Completed',
      type: 'sms',
      context: 'sms_automation',
      content: 'Congratulations {{Contact.FirstName}}! Your onboarding with {{Company.Name}} is complete. We look forward to working together. Reply STOP to opt out.',
      usedBySMSAutomation: ['Staff Onboarding']
    },
    {
      id: 4,
      name: 'Payment Due Notice',
      type: 'sms',
      context: 'sms_automation',
      content: 'Hi {{Contact.FirstName}}, your payment for {{Service.Name}} is due. Please contact {{Company.Phone}} to complete payment. Reply STOP to opt out.',
      usedBySMSAutomation: ['Billing Automation']
    },
    {
      id: 5,
      name: 'Session Follow-up',
      type: 'sms',
      context: 'sms_automation',
      content: 'Hi {{Contact.FirstName}}, thank you for your session today. Please complete your follow-up form at {{Company.Website}}. Reply STOP to opt out.',
      usedBySMSAutomation: ['Feedback Collection']
    },
    {
      id: 6,
      name: 'Treatment Plan Update',
      type: 'sms',
      context: 'sms_automation',
      content: 'Hi {{Contact.FirstName}}, your treatment plan has been updated. Please review it in your portal at {{Contact.ClientPortalURL}}. Reply STOP to opt out.',
      usedBySMSAutomation: ['Treatment Management']
    },
    {
      id: 7,
      name: 'Emergency Contact Notice',
      type: 'sms',
      context: 'sms_automation',
      content: 'This is {{Company.Name}}. Please contact us immediately at {{Company.Phone}} regarding {{Contact.FirstName}}. Reply STOP to opt out.',
      usedBySMSAutomation: ['Emergency Protocols']
    }
  ]);

  // Generate shortcodes for SMS automation context
  const availableShortcodes = generateShortcodes([], 'sms_automation');

  const handleSave = () => {
    onSave(smsContent);
    onBack();
  };

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'sms_automation',
      usedBySMSAutomation: []
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const characterCount = smsContent.content.length;
  const smsCount = Math.ceil(characterCount / 160);

  return (
    <div className="h-full bg-white">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Workflow
            </Button>
            <h2 className="text-lg font-semibold">Design SMS Content</h2>
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Message Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextEditor
                  value={smsContent.content}
                  onChange={(content) => setSmsContent({ content })}
                  availableShortcodes={availableShortcodes}
                  templates={templates}
                  onSaveTemplate={handleSaveTemplate}
                  templateType="sms"
                  context="sms_automation"
                />
                
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{characterCount} characters</span>
                  <span>{smsCount} SMS{smsCount > 1 ? ' messages' : ' message'}</span>
                </div>

                <div className="p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-700">
                    📱 Don't forget to include "Reply STOP to opt out" in your message for compliance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>SMS Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">{smsContent.content || 'Your SMS message will appear here...'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <CommunicationTemplates
                templates={templates}
                setTemplates={setTemplates}
                customFields={[]}
                context="sms_automation"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
