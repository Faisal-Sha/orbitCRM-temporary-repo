
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createNewTemplate, getDefaultTemplates, getContextLabel, getUsedBy } from '../utils';

export const useTemplateManagement = (
  templates: any[],
  setTemplates: (templates: any[]) => void,
  context: string,
  formData?: any,
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void
) => {
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<number | null>(null);
  const [pushTemplateId, setPushTemplateId] = useState<number | null>(null);

  // Initialize with context-specific dummy templates if empty
  useEffect(() => {
    if (templates.length === 0) {
      const contextTemplates = getDefaultTemplates(context as 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign');
      setTemplates(contextTemplates);
    }
  }, [templates.length, setTemplates, context]);

  const addTemplate = (type: 'email' | 'sms' | 'aivoice' | 'knowledge' | 'confirmation' | 'pdf') => {
    const newTemplate = createNewTemplate(type, context as 'calendar' | 'form' | 'confirmation' | 'pdf' | 'email_campaign', templates);
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    if (updateFormDataWithHistory && formData) {
      const templateType = context === 'confirmation' ? 'confirmation' : context === 'pdf' ? 'pdf' : type;
      const newFormData = {
        ...formData,
        settings: {
          ...formData.settings,
          communicationTemplates: updatedTemplates
        }
      };
      updateFormDataWithHistory(newFormData, 'template', `Added ${templateType} template`);
    }
    
    setSelectedTemplate(newTemplate);
    setViewMode('edit');
  };

  const updateTemplate = (templateId: number, field: string, value: any) => {
    const updatedTemplates = templates.map(template => 
      template.id === templateId ? { ...template, [field]: value } : template
    );
    setTemplates(updatedTemplates);
    
    if (updateFormDataWithHistory && formData) {
      const newFormData = {
        ...formData,
        settings: {
          ...formData.settings,
          communicationTemplates: updatedTemplates
        }
      };
      updateFormDataWithHistory(newFormData, 'template', `Updated template ${field}`);
    }
    
    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate({ ...selectedTemplate, [field]: value });
    }
  };

  const deleteTemplate = (templateId: number) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    
    if (updateFormDataWithHistory && formData) {
      const newFormData = {
        ...formData,
        settings: {
          ...formData.settings,
          communicationTemplates: updatedTemplates
        }
      };
      updateFormDataWithHistory(newFormData, 'template', 'Deleted template');
    }
    
    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate(null);
      setViewMode('list');
    }
    setDeleteTemplateId(null);
  };

  const editTemplate = (template: any) => {
    setSelectedTemplate(template);
    setViewMode('edit');
  };

  const pushChangesToContext = (template: any) => {
    const contextName = getContextLabel(context);
    const usedBy = getUsedBy(template, context);
    const count = usedBy ? usedBy.length : 0;
    
    toast.success(`Changes to "${template.name}" have been pushed to ${count} ${contextName}: ${usedBy ? usedBy.join(', ') : 'None'}`);
    setPushTemplateId(null);
  };

  const backToList = () => {
    setSelectedTemplate(null);
    setViewMode('list');
    setEditingTemplate(null);
  };

  const handleDeleteClick = (templateId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteTemplateId(templateId);
  };

  const handlePushClick = (templateId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setPushTemplateId(templateId);
  };

  // Filter templates by context and type
  const contextFilteredTemplates = templates.filter(template => template.context === context);
  const filteredTemplates = filterType === 'all' 
    ? contextFilteredTemplates 
    : contextFilteredTemplates.filter(template => template.type === filterType);

  return {
    editingTemplate,
    filterType,
    viewMode,
    selectedTemplate,
    deleteTemplateId,
    pushTemplateId,
    filteredTemplates,
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
  };
};
