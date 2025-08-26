
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { TextEditor } from '@/components/texteditor/TextEditor';
import { CommunicationTemplates } from '@/components/communicationflows/templates/CommunicationTemplates';
import { generateShortcodes } from '@/utils/shortcodeGenerator';

interface AutomationCallDesignProps {
  stepId: string;
  initialContent?: {
    script: string;
    knowledgeBase: string;
    guidelines: string;
  };
  onSave: (content: any) => void;
  onBack: () => void;
}

export const AutomationCallDesign: React.FC<AutomationCallDesignProps> = ({
  stepId,
  initialContent,
  onSave,
  onBack,
}) => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Lead Qualifying Call',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hello {{Contact.FirstName}}, this is {{Company.Name}}. I\'m calling to learn more about your needs and see how we can help you achieve your goals.',
      usedByCallAutomation: ['Lead Qualification', 'Sales Follow-up']
    },
    {
      id: 2,
      name: 'Clinician Follow Up',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hi {{Contact.FirstName}}, this is a follow-up call from {{Company.Name}} regarding your recent session. How are you feeling today?',
      usedByCallAutomation: ['Post-Session Follow-up']
    },
    {
      id: 3,
      name: 'Appointment Confirmation',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hello {{Contact.FirstName}}, this is {{Company.Name}} calling to confirm your {{Appointment.Type}} appointment on {{Appointment.Date}} at {{Appointment.Time}}.',
      usedByCallAutomation: ['Appointment Confirmations']
    },
    {
      id: 4,
      name: 'Payment Reminder Call',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hi {{Contact.FirstName}}, this is {{Company.Name}}. I\'m calling to remind you about your outstanding balance. Would you like to take care of that today?',
      usedByCallAutomation: ['Billing Automation']
    },
    {
      id: 5,
      name: 'Welcome New Client',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hello {{Contact.FirstName}}, welcome to {{Company.Name}}! I\'m calling to personally welcome you and see if you have any questions about our services.',
      usedByCallAutomation: ['Client Onboarding']
    },
    {
      id: 6,
      name: 'Session Feedback Call',
      type: 'aivoice',
      context: 'call_automation',
      content: 'Hi {{Contact.FirstName}}, this is {{Company.Name}}. I wanted to check in and get your feedback on your recent session with us.',
      usedByCallAutomation: ['Feedback Collection']
    },
    {
      id: 7,
      name: 'Emergency Contact Knowledge',
      type: 'knowledge',
      context: 'call_automation',
      content: 'Emergency contact protocols:\n- Always verify caller identity\n- Follow crisis intervention guidelines\n- Document all emergency contacts\n- Escalate to supervisor when needed',
      usedByCallAutomation: ['Emergency Protocols']
    }
  ]);

  const [callContent, setCallContent] = useState({
    script: initialContent?.script || 'Hello {{Contact.FirstName}}, this is {{Company.Name}} calling to follow up on your recent inquiry about {{Service.Name}}...',
    knowledgeBase: initialContent?.knowledgeBase || 'Company hours: 9 AM - 6 PM\nServices offered: Consultation, Training, Support\nContact email: support@company.com',
    guidelines: initialContent?.guidelines || '✅ Do: Keep responses natural and conversational\n✅ Do: Ask open-ended questions to engage\n✅ Do: Listen and respond to customer needs\n❌ Don\'t: Sound robotic or scripted\n❌ Don\'t: Rush through the conversation\n❌ Don\'t: Make promises not in knowledge base',
  });

  // Generate shortcodes for call automation context
  const availableShortcodes = generateShortcodes([], 'call_automation');

  const handleSave = () => {
    onSave(callContent);
    onBack();
  };

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'call_automation',
      usedByCallAutomation: []
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
            <h2 className="text-lg font-semibold">Design AI Voice Call</h2>
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
                <CardTitle>Call Script</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Opening Script</Label>
                  <TextEditor
                    value={callContent.script}
                    onChange={(script) => setCallContent(prev => ({ ...prev, script }))}
                    availableShortcodes={availableShortcodes}
                    templates={templates}
                    onSaveTemplate={handleSaveTemplate}
                    templateType="aivoice"
                    context="call_automation"
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    🎯 Keep your opening script concise and engaging. The AI will handle natural conversation flow based on the knowledge base below.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Information for AI Assistant</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Provide context and information the AI can reference during conversations.
                  </p>
                  <Textarea
                    value={callContent.knowledgeBase}
                    onChange={(e) => setCallContent(prev => ({ ...prev, knowledgeBase: e.target.value }))}
                    placeholder="Enter company information, services, pricing, FAQs, and other relevant details..."
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Guidelines for AI Assistant</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Set guidelines for how the AI should behave during calls.
                  </p>
                  <Textarea
                    value={callContent.guidelines}
                    onChange={(e) => setCallContent(prev => ({ ...prev, guidelines: e.target.value }))}
                    placeholder="Enter guidelines for the AI assistant..."
                    rows={6}
                    className="resize-none"
                  />
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
                context="call_automation"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
