
export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  availableShortcodes?: string[];
  customFields?: any[];
  templates?: any[];
  onSaveTemplate?: (templateData: any) => void;
  templateType?: 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation';
  context?: 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign' | 'email_automation' | 'sms_automation' | 'call_automation' | 'sms_campaign';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export interface DialogState {
  isLinkDialogOpen: boolean;
  isImageDialogOpen: boolean;
  isFileDialogOpen: boolean;
  isPDFDialogOpen: boolean;
  isTemplateDialogOpen: boolean;
  isSaveTemplateDialogOpen: boolean;
}

export interface FormData {
  linkUrl: string;
  linkText: string;
  imageUrl: string;
  imageAlt: string;
  fileName: string;
  fileUrl: string;
  selectedPDFId: string;
  templateName: string;
  templateSubject: string;
}

export interface EditorActions {
  formatText: (command: string, value?: string) => void;
  insertHtml: (html: string) => void;
  insertShortcode: (shortcode: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => void;
}
