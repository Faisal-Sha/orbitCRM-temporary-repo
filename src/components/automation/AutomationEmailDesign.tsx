
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { TextEditor } from '@/components/texteditor';
import { CommunicationTemplates } from '@/components/communicationflows/templates/CommunicationTemplates';
import { generateShortcodes } from '@/utils/shortcodeGenerator';

interface AutomationEmailDesignProps {
  stepId: string;
  initialContent?: {
    subject: string;
    preheader: string;
    content: string;
  };
  onSave: (content: any) => void;
  onBack: () => void;
}

export const AutomationEmailDesign: React.FC<AutomationEmailDesignProps> = ({
  stepId,
  initialContent,
  onSave,
  onBack,
}) => {
  const [emailContent, setEmailContent] = useState({
    content: initialContent?.content || 'Hello {{Contact.FirstName}},\n\nThank you for your interest! We wanted to reach out and...',
  });

  // Initialize with dummy templates for email_automation context
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Client Welcome Email',
      type: 'email',
      context: 'email_automation',
      content: 'Welcome {{Contact.FirstName}}! We\'re excited to have you join {{Company.Name}}. Your journey with us begins now.',
      subject: 'Welcome to {{Company.Name}}!',
      usedByEmailAutomation: ['Welcome Sequence', 'Client Onboarding']
    },
    {
      id: 2,
      name: 'Appointment Reminder',
      type: 'email',
      context: 'email_automation',
      content: 'Hi {{Contact.FirstName}}, this is a reminder about your upcoming appointment on {{Appointment.Date}} at {{Appointment.Time}}.',
      subject: 'Appointment Reminder - {{Appointment.Date}}',
      usedByEmailAutomation: ['Appointment Reminders']
    },
    {
      id: 3,
      name: 'Follow-up Email',
      type: 'email',
      context: 'email_automation',
      content: 'Hi {{Contact.FirstName}}, we wanted to follow up on your recent visit. How are you feeling?',
      subject: 'How are you doing?',
      usedByEmailAutomation: ['Post-Visit Follow-up']
    },
    {
      id: 4,
      name: 'Clinician Onboarding Completed',
      type: 'email',
      context: 'email_automation',
      content: 'Congratulations {{Contact.FirstName}}! You have successfully completed the onboarding process at {{Company.Name}}.',
      subject: 'Onboarding Complete - Welcome to the Team!',
      usedByEmailAutomation: ['Staff Onboarding']
    },
    {
      id: 5,
      name: 'Payment Reminder',
      type: 'email',
      context: 'email_automation',
      content: 'Dear {{Contact.FirstName}}, this is a friendly reminder about your outstanding balance. Please contact us to arrange payment.',
      subject: 'Payment Reminder',
      usedByEmailAutomation: ['Billing Automation']
    },
    {
      id: 6,
      name: 'Session Feedback Request',
      type: 'email',
      context: 'email_automation',
      content: 'Hi {{Contact.FirstName}}, we hope your session went well. Please take a moment to provide feedback about your experience.',
      subject: 'We\'d love your feedback',
      usedByEmailAutomation: ['Feedback Collection']
    },
    {
      id: 7,
      name: 'Treatment Plan Update',
      type: 'email',
      context: 'email_automation',
      content: 'Hello {{Contact.FirstName}}, your treatment plan has been updated. Please review the changes and contact us with any questions.',
      subject: 'Treatment Plan Updated',
      usedByEmailAutomation: ['Treatment Management']
    }
  ]);

  // Generate shortcodes for email automation context
  const availableShortcodes = generateShortcodes([], 'email_automation');

  const handleSave = () => {
    onSave(emailContent);
    onBack();
  };

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'email_automation',
      usedByEmailAutomation: []
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <div className="h-full bg-white">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Workflow
            </Button>
            <h2 className="text-lg font-semibold">Design Email Content</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave}>Save</Button>
          </div>
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
                <CardTitle>Email Content</CardTitle>
              </CardHeader>
              <CardContent>
                <TextEditor
                  value={emailContent.content}
                  onChange={(value) => setEmailContent(prev => ({ ...prev, content: value }))}
                  availableShortcodes={availableShortcodes}
                  templates={templates}
                  onSaveTemplate={handleSaveTemplate}
                  templateType="email"
                  context="email_automation"
                />
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    💡 Remember to include an unsubscribe link in your email content to comply with regulations.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-4 max-w-md mx-auto shadow-sm">
                  <div className="border-b pb-2 mb-3">
                    <div className="text-xs text-gray-500 mb-1">From: noreply@company.com</div>
                    <div className="text-xs text-gray-500 mb-1">To: customer@email.com</div>
                    <div className="font-medium text-sm">Subject: Your Email Subject</div>
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {emailContent.content || 'Your email content will appear here...'}
                  </div>
                  <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                    <p>📧 Email preview - Content will be rendered as HTML in actual emails</p>
                  </div>
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
                context="email_automation"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
