
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { TextEditor } from '@/components/texteditor';
import { generateShortcodes } from '@/utils/shortcodeGenerator';

interface FormConfirmationPagesProps {
  formData: any;
  setFormData: (data: any) => void;
  templates: any[];
  setTemplates: (templates: any[]) => void;
}

export const FormConfirmationPages: React.FC<FormConfirmationPagesProps> = ({
  formData,
  setFormData,
  templates,
  setTemplates,
}) => {
  const updateConfirmationSettings = (confirmations: any[]) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        confirmations
      }
    });
  };

  const addConfirmation = () => {
    const currentConfirmations = formData.settings?.confirmations || [];
    const newConfirmation = {
      id: Date.now(),
      name: `Confirmation Page ${currentConfirmations.length + 1}`,
      type: 'design',
      content: '<h2>Thank you for your submission!</h2><p>We have received your {{FORM_TITLE}} and will review it shortly.</p><p>Your score: {{QUIZ_SCORE}}</p>',
      url: '',
      conditions: []
    };
    
    updateConfirmationSettings([...currentConfirmations, newConfirmation]);
  };

  const updateConfirmation = (confirmationId: number, field: string, value: any) => {
    const currentConfirmations = formData.settings?.confirmations || [];
    const updatedConfirmations = currentConfirmations.map((conf: any) =>
      conf.id === confirmationId ? { ...conf, [field]: value } : conf
    );
    updateConfirmationSettings(updatedConfirmations);
  };

  const removeConfirmation = (confirmationId: number) => {
    const currentConfirmations = formData.settings?.confirmations || [];
    const updatedConfirmations = currentConfirmations.filter((conf: any) => conf.id !== confirmationId);
    updateConfirmationSettings(updatedConfirmations);
  };

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Date.now(),
      context: 'confirmation',
      usedByConfirmations: []
    };
    setTemplates([...templates, newTemplate]);
  };

  const generateCustomFieldsFromForm = () => {
    const customFields: any[] = [];
    
    // Add default form shortcodes
    customFields.push(
      { id: 'form_title', label: 'FORM_TITLE' },
      { id: 'quiz_score', label: 'QUIZ_SCORE' }
    );
    
    // Add shortcodes for all form elements
    formData.steps?.forEach((step: any, stepIndex: number) => {
      step.elements?.forEach((element: any, elementIndex: number) => {
        if (!['next', 'previous', 'save', 'submit', 'linebreak'].includes(element.type)) {
          customFields.push({
            id: `${stepIndex}_${elementIndex}`,
            label: element.label?.toLowerCase().replace(/\s+/g, '_') || `field_${stepIndex}_${elementIndex}`
          });
        }
      });
    });
    
    return customFields;
  };

  // Initialize with default confirmation if none exist
  React.useEffect(() => {
    const currentConfirmations = formData.settings?.confirmations || [];
    if (currentConfirmations.length === 0) {
      const defaultConfirmation = {
        id: Date.now(),
        name: 'Default Confirmation',
        type: 'design',
        content: '<h2>Thank you for your submission!</h2><p>We have received your {{FORM_TITLE}} and will review it shortly.</p><p>Your score: {{QUIZ_SCORE}}</p>',
        url: '',
        conditions: []
      };
      updateConfirmationSettings([defaultConfirmation]);
    }
  }, []);

  const customFields = generateCustomFieldsFromForm();
  const currentConfirmations = formData.settings?.confirmations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Confirmation Pages</h3>
          <p className="text-sm text-muted-foreground">
            Design custom confirmation pages that users see after form submission.
          </p>
        </div>
        <Button onClick={addConfirmation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Confirmation
        </Button>
      </div>

      <div className="space-y-6">
        {currentConfirmations.map((confirmation: any, index: number) => (
          <Card key={confirmation.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    value={confirmation.name}
                    onChange={(e) => updateConfirmation(confirmation.id, 'name', e.target.value)}
                    className="font-medium text-lg"
                    placeholder="Confirmation page name"
                  />
                </div>
                {currentConfirmations.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConfirmation(confirmation.id)}
                    className="text-destructive hover:text-destructive ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Confirmation Type</Label>
                <Select 
                  value={confirmation.type} 
                  onValueChange={(value) => updateConfirmation(confirmation.id, 'type', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="redirect">Redirect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {confirmation.type === 'redirect' ? (
                <div className="space-y-2">
                  <Label>Redirect URL</Label>
                  <Input
                    value={confirmation.url || ''}
                    onChange={(e) => updateConfirmation(confirmation.id, 'url', e.target.value)}
                    placeholder="https://example.com/thank-you"
                  />
                  <p className="text-sm text-muted-foreground">
                    Users will be redirected to this URL after form submission.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Confirmation Page Content</Label>
                  <TextEditor
                    value={confirmation.content || ''}
                    onChange={(value) => updateConfirmation(confirmation.id, 'content', value)}
                    availableShortcodes={generateShortcodes(customFields, 'form', formData)}
                    customFields={customFields}
                    templates={templates.filter(t => t.context === 'confirmation')}
                    onSaveTemplate={handleSaveTemplate}
                    templateType="confirmation"
                    context="confirmation"
                    formData={formData}
                  />
                  <p className="text-sm text-muted-foreground">
                    Design a custom confirmation page with rich text formatting and shortcodes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {currentConfirmations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="max-w-md mx-auto">
            <h4 className="text-lg font-medium mb-2">No confirmation pages yet</h4>
            <p className="text-sm mb-4">
              Create confirmation pages to customize what users see after submitting your form.
            </p>
            <Button onClick={addConfirmation}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Confirmation Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
