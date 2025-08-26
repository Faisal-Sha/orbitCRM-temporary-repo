
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData } from '../../types';

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  templateType?: string;
  context?: string;
  value: string;
  onSaveTemplate?: (templateData: any) => void;
}

export const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  updateFormData,
  templateType,
  context,
  value,
  onSaveTemplate,
}) => {
  const saveAsTemplate = () => {
    if (formData.templateName && onSaveTemplate) {
      const templateData = {
        name: formData.templateName,
        type: templateType === 'confirmation' ? 'confirmation' : templateType,
        content: value,
        subject: templateType === 'email' ? formData.templateSubject : '',
        context: context,
        usedByCalendars: context === 'calendar' ? [] : undefined,
        usedByForms: context === 'form' ? [] : undefined,
        usedByConfirmations: context === 'confirmation' ? [] : undefined,
        usedByPDFs: context === 'pdf' ? [] : undefined,
        usedBySMSCampaigns: context === 'sms_campaign' ? [] : undefined
      };
      onSaveTemplate(templateData);
      updateFormData({ templateName: '', templateSubject: '' });
      onOpenChange(false);
    }
  };

  if (!onSaveTemplate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
        >
          💾 Save Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input
              value={formData.templateName}
              onChange={(e) => updateFormData({ templateName: e.target.value })}
              placeholder="Enter template name"
            />
          </div>
          {templateType === 'email' && (
            <div className="space-y-2">
              <Label>Subject (optional)</Label>
              <Input
                value={formData.templateSubject}
                onChange={(e) => updateFormData({ templateSubject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
          )}
          <Button onClick={saveAsTemplate} className="w-full" disabled={!formData.templateName}>
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
