
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TextEditorProps } from './types';
import { useTextEditor } from './hooks/useTextEditor';
import { Toolbar } from './components/Toolbar';
import { generateShortcodeComponent } from '@/utils/shortcodeGenerator';

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  availableShortcodes = [],
  customFields = [],
  templates = [],
  onSaveTemplate,
  templateType = 'email',
  context = 'calendar',
  formData,
  updateFormDataWithHistory,
}) => {
  const [isSourceView, setIsSourceView] = useState(false);
  
  const {
    dialogState,
    formData: editorFormData,
    editorRef,
    textareaRef,
    actions,
    updateDialogState,
    updateFormData,
    resetFormData,
    handleEditorInput,
    handleEditorBlur,
    handleEditorClick,
    handleEditorKeyUp,
  } = useTextEditor(value, onChange, isSourceView);

  // Filter templates based on context for Load Template functionality
  const filteredTemplates = templates.filter(template => {
    if (context === 'email_automation') {
      return template.context === 'email_automation';
    } else if (context === 'sms_automation') {
      return template.context === 'sms_automation';
    } else if (context === 'call_automation') {
      return template.context === 'call_automation';
    } else if (context === 'email_campaign') {
      return template.context === 'email_campaign';
    } else if (context === 'sms_campaign') {
      return template.context === 'sms_campaign';
    }
    return template.context === context;
  });

  // Generate the shortcode component
  const ShortcodeComponent = generateShortcodeComponent(
    availableShortcodes,
    actions,
    context
  );

  return (
    <div className="space-y-3">
      <Toolbar
        isSourceView={isSourceView}
        setIsSourceView={setIsSourceView}
        dialogState={dialogState}
        updateDialogState={updateDialogState}
        formData={editorFormData}
        updateFormData={updateFormData}
        resetFormData={resetFormData}
        actions={actions}
        templates={filteredTemplates}
        templateType={templateType}
        context={context}
        value={value}
        onChange={onChange}
        onSaveTemplate={onSaveTemplate}
        formDataProp={formData}
      />

      {!isSourceView ? (
        <div
          ref={editorRef}
          className="min-h-[150px] p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onBlur={handleEditorBlur}
          onClick={handleEditorClick}
          onKeyUp={handleEditorKeyUp}
          style={{
            minHeight: '150px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          className="min-h-[150px] font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your HTML content here..."
        />
      )}

      {ShortcodeComponent}
    </div>
  );
};
