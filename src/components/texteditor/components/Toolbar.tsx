import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogState, FormData, EditorActions, TextEditorProps } from '../types';
import { LinkDialog } from './dialogs/LinkDialog';
import { ImageDialog } from './dialogs/ImageDialog';
import { FileDialog } from './dialogs/FileDialog';
import { PDFDialog } from './dialogs/PDFDialog';
import { TemplateDialog } from './dialogs/TemplateDialog';
import { SaveTemplateDialog } from './dialogs/SaveTemplateDialog';

interface ToolbarProps {
  isSourceView: boolean;
  setIsSourceView: (value: boolean) => void;
  dialogState: DialogState;
  updateDialogState: (updates: Partial<DialogState>) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  resetFormData: () => void;
  actions: EditorActions;
  templates: any[];
  templateType?: string;
  context?: string;
  value: string;
  onChange: (value: string) => void;
  onSaveTemplate?: (templateData: any) => void;
  formDataProp?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isSourceView,
  setIsSourceView,
  dialogState,
  updateDialogState,
  formData,
  updateFormData,
  resetFormData,
  actions,
  templates,
  templateType,
  context,
  value,
  onChange,
  onSaveTemplate,
  formDataProp,
}) => {
  const filteredTemplates = templates.filter(template => {
    const contextMatch = !template.context || template.context === context;
    const typeMatch = template.type === templateType || 
                     (templateType === 'knowledge' && template.type === 'aivoice') ||
                     (templateType === 'confirmation' && template.type === 'confirmation');
    return contextMatch && typeMatch;
  });

  // Check if PDFs are available - Show PDF button for form builder contexts only
  const availablePDFs = formDataProp?.settings?.pdfs || [];
  const hasPDFs = availablePDFs.length > 0;
  const showPDFButton = (context === 'form' || context === 'confirmation') && hasPDFs;

  const handleLoadTemplate = (template: any) => {
    const content = template.content || '';
    onChange(content);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => actions.formatText('bold')}
          disabled={isSourceView}
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => actions.formatText('italic')}
          disabled={isSourceView}
        >
          <em>I</em>
        </Button>
        
        <LinkDialog
          isOpen={dialogState.isLinkDialogOpen}
          onOpenChange={(open) => updateDialogState({ isLinkDialogOpen: open })}
          formData={formData}
          updateFormData={updateFormData}
          actions={actions}
          resetFormData={resetFormData}
        />

        <ImageDialog
          isOpen={dialogState.isImageDialogOpen}
          onOpenChange={(open) => updateDialogState({ isImageDialogOpen: open })}
          formData={formData}
          updateFormData={updateFormData}
          actions={actions}
        />

        <FileDialog
          isOpen={dialogState.isFileDialogOpen}
          onOpenChange={(open) => updateDialogState({ isFileDialogOpen: open })}
          formData={formData}
          updateFormData={updateFormData}
          actions={actions}
        />

        <PDFDialog
          isOpen={dialogState.isPDFDialogOpen}
          onOpenChange={(open) => updateDialogState({ isPDFDialogOpen: open })}
          formData={formData}
          updateFormData={updateFormData}
          actions={actions}
          availablePDFs={availablePDFs}
          showPDFButton={showPDFButton}
        />

        <TemplateDialog
          isOpen={dialogState.isTemplateDialogOpen}
          onOpenChange={(open) => updateDialogState({ isTemplateDialogOpen: open })}
          filteredTemplates={filteredTemplates}
          templateType={templateType}
          context={context}
          onLoadTemplate={handleLoadTemplate}
        />

        <SaveTemplateDialog
          isOpen={dialogState.isSaveTemplateDialogOpen}
          onOpenChange={(open) => updateDialogState({ isSaveTemplateDialogOpen: open })}
          formData={formData}
          updateFormData={updateFormData}
          templateType={templateType}
          context={context}
          value={value}
          onSaveTemplate={onSaveTemplate}
        />
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsSourceView(!isSourceView)}
      >
        {isSourceView ? '👁️' : '</>'}
      </Button>
    </div>
  );
};