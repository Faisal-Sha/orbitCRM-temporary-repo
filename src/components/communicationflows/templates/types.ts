
export interface CommunicationTemplatesProps {
  templates: any[];
  setTemplates: (templates: any[]) => void;
  customFields: any[];
  context?: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export interface Template {
  id: number;
  name: string;
  type: 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation' | 'pdf';
  context: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign';
  content: string;
  subject?: string;
  voice?: string;
  knowledgeBase?: string;
  usedByCalendars?: string[];
  usedByForms?: string[];
  usedByConfirmations?: string[];
  usedByPDFs?: string[];
  usedByEmailCampaigns?: string[];
  usedByEmailAutomation?: string[];
  usedBySMSAutomation?: string[];
  usedByCallAutomation?: string[];
  usedBySMSCampaigns?: string[];
}

export interface TemplateEditorProps {
  template: Template;
  onUpdate: (templateId: number, field: string, value: any) => void;
  onBack: () => void;
  onDelete: (templateId: number, event: React.MouseEvent) => void;
  onPush: (templateId: number, event: React.MouseEvent) => void;
  customFields: any[];
  templates: Template[];
  context: string;
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (templateId: number, event: React.MouseEvent) => void;
  onPush: (templateId: number, event: React.MouseEvent) => void;
  onAdd: (type: 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation' | 'pdf') => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  context: string;
}

export interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (templateId: number, event: React.MouseEvent) => void;
  onPush: (templateId: number, event: React.MouseEvent) => void;
  context: string;
}

export interface ConfirmationDialogsProps {
  deleteTemplateId: number | null;
  pushTemplateId: number | null;
  onDeleteConfirm: (templateId: number) => void;
  onDeleteCancel: () => void;
  onPushConfirm: (templateId: number) => void;
  onPushCancel: () => void;
  templates: Template[];
  context: string;
}
