import React from 'react';
import { CommunicationTemplatesProps } from './types';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { ConfirmationDialogs } from './components/ConfirmationDialogs';
import { TemplateEditor } from './components/TemplateEditor';
import { TemplateList } from './components/TemplateList';

export function CommunicationTemplates({
  templates,
  setTemplates,
  customFields,
  context = 'calendar',
  formData,
  updateFormDataWithHistory,
}: CommunicationTemplatesProps) {
  const {
    viewMode,
    selectedTemplate,
    deleteTemplateId,
    pushTemplateId,
    filteredTemplates,
    filterType,
    setFilterType,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    editTemplate,
    pushChangesToContext,
    backToList,
    handleDeleteClick,
    handlePushClick,
    setDeleteTemplateId,
    setPushTemplateId
  } = useTemplateManagement(templates, setTemplates, context, formData, updateFormDataWithHistory);

  // Add dummy templates for SMS campaign if none exist
  React.useEffect(() => {
    if (context === 'sms_campaign' && templates.length === 0) {
      const dummySMSCampaignTemplates = [
        {
          id: Date.now() + 1,
          name: 'Client Enrolled SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Welcome {{Contact.FirstName}}! You\'re now enrolled with {{Company.Name}}. We\'re excited to support your journey. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 2,
          name: 'Clinician Onboarding Started SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Hi {{Contact.FirstName}}, welcome to {{Company.Name}}! Your onboarding process has begun. Check your email for next steps. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 3,
          name: 'Payment Reminder SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Payment reminder: Your {{Service.Name}} payment is due. Please pay at {{Company.Website}} or call {{Company.Phone}}. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 4,
          name: 'Appointment Booked SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Appointment confirmed! {{Contact.FirstName}}, your {{Appointment.Type}} is scheduled for {{Appointment.DateTime}}. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 5,
          name: 'Treatment Plan Updated SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Hi {{Contact.FirstName}}, your treatment plan has been updated. Please review it at {{Contact.ClientPortalURL}}. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 6,
          name: 'Session Feedback Request SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Thanks for your session today, {{Contact.FirstName}}! Please share your feedback at {{Company.Website}}/feedback. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        },
        {
          id: Date.now() + 7,
          name: 'Holiday Greeting SMS',
          type: 'sms',
          context: 'sms_campaign',
          content: 'Happy holidays from all of us at {{Company.Name}}! Wishing you and your family a wonderful season. Reply STOP to opt out.',
          usedBySMSCampaigns: []
        }
      ];
      setTemplates(dummySMSCampaignTemplates);
    } else if (context === 'sms_automation' && templates.length === 0) {
      const dummySMSTemplates = [
        {
          id: Date.now() + 1,
          name: 'Client Welcome SMS',
          type: 'sms',
          context: 'sms_automation',
          content: 'Hi {{Contact.FirstName}}, welcome to {{Company.Name}}! We\'re excited to work with you. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 2,
          name: 'Appointment Reminder',
          type: 'sms',
          context: 'sms_automation',
          content: 'Hi {{Contact.FirstName}}, this is a reminder of your {{Appointment.Type}} appointment tomorrow at {{Appointment.Time}}. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 3,
          name: 'Clinician Onboarding Completed',
          type: 'sms',
          context: 'sms_automation',
          content: 'Congratulations {{Contact.FirstName}}! Your onboarding with {{Company.Name}} is complete. We look forward to working together. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 4,
          name: 'Payment Due Notice',
          type: 'sms',
          context: 'sms_automation',
          content: 'Hi {{Contact.FirstName}}, your payment for {{Service.Name}} is due. Please contact {{Company.Phone}} to complete payment. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 5,
          name: 'Session Follow-up',
          type: 'sms',
          context: 'sms_automation',
          content: 'Hi {{Contact.FirstName}}, thank you for your session today. Please complete your follow-up form at {{Company.Website}}. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 6,
          name: 'Treatment Plan Update',
          type: 'sms',
          context: 'sms_automation',
          content: 'Hi {{Contact.FirstName}}, your treatment plan has been updated. Please review it in your portal at {{Contact.ClientPortalURL}}. Reply STOP to opt out.',
          usedBySMSAutomation: []
        },
        {
          id: Date.now() + 7,
          name: 'Emergency Contact Notice',
          type: 'sms',
          context: 'sms_automation',
          content: 'This is {{Company.Name}}. Please contact us immediately at {{Company.Phone}} regarding {{Contact.FirstName}}. Reply STOP to opt out.',
          usedBySMSAutomation: []
        }
      ];
      setTemplates(dummySMSTemplates);
    } else if (context === 'call_automation' && templates.length === 0) {
      const dummyCallTemplates = [
        {
          id: Date.now() + 1,
          name: 'Lead Qualifying Call',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hello {{Contact.FirstName}}, this is {{Company.Name}}. I\'m calling to learn more about your needs and see how we can help you achieve your goals.',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 2,
          name: 'Clinician Follow Up',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hi {{Contact.FirstName}}, this is a follow-up call from {{Company.Name}} regarding your recent session. How are you feeling today?',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 3,
          name: 'Appointment Confirmation',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hello {{Contact.FirstName}}, this is {{Company.Name}} calling to confirm your {{Appointment.Type}} appointment on {{Appointment.Date}} at {{Appointment.Time}}.',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 4,
          name: 'Payment Reminder Call',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hi {{Contact.FirstName}}, this is {{Company.Name}}. I\'m calling to remind you about your outstanding balance. Would you like to take care of that today?',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 5,
          name: 'Welcome New Client',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hello {{Contact.FirstName}}, welcome to {{Company.Name}}! I\'m calling to personally welcome you and see if you have any questions about our services.',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 6,
          name: 'Session Feedback Call',
          type: 'aivoice',
          context: 'call_automation',
          content: 'Hi {{Contact.FirstName}}, this is {{Company.Name}}. I wanted to check in and get your feedback on your recent session with us.',
          usedByCallAutomation: []
        },
        {
          id: Date.now() + 7,
          name: 'Emergency Contact',
          type: 'knowledge',
          context: 'call_automation',
          content: 'Emergency contact protocols:\n- Always verify caller identity\n- Follow crisis intervention guidelines\n- Document all emergency contacts\n- Escalate to supervisor when needed',
          usedByCallAutomation: []
        }
      ];
      setTemplates(dummyCallTemplates);
    }
  }, [context, templates.length, setTemplates]);

  // Filter templates based on context
  const contextFilteredTemplates = filteredTemplates.filter(template => template.context === context);

  return (
    <div className="space-y-6">
      {/* Confirmation Dialogs */}
      <ConfirmationDialogs
        deleteTemplateId={deleteTemplateId}
        pushTemplateId={pushTemplateId}
        onDeleteConfirm={deleteTemplate}
        onDeleteCancel={() => setDeleteTemplateId(null)}
        onPushConfirm={(templateId) => {
          const template = templates.find(t => t.id === templateId);
          if (template) pushChangesToContext(template);
        }}
        onPushCancel={() => setPushTemplateId(null)}
        templates={templates}
        context={context}
      />

      {/* Main Content */}
      {viewMode === 'edit' && selectedTemplate ? (
        <TemplateEditor
          template={selectedTemplate}
          onUpdate={updateTemplate}
          onBack={backToList}
          onDelete={handleDeleteClick}
          onPush={handlePushClick}
          customFields={customFields}
          templates={templates}
          context={context}
          formData={formData}
          updateFormDataWithHistory={updateFormDataWithHistory}
        />
      ) : (
        <TemplateList
          templates={contextFilteredTemplates}
          onEdit={editTemplate}
          onDelete={handleDeleteClick}
          onPush={handlePushClick}
          onAdd={addTemplate}
          filterType={filterType}
          onFilterChange={setFilterType}
          context={context}
        />
      )}
    </div>
  );
}
