import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData, EditorActions } from '../../types';

interface LinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  actions: EditorActions;
  resetFormData: () => void;
}

export const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  updateFormData,
  actions,
  resetFormData,
}) => {
  const handleLinkInsert = () => {
    if (formData.linkUrl) {
      const linkHtml = `<a href="${formData.linkUrl}" target="_blank">${formData.linkText || formData.linkUrl}</a>`;
      actions.insertHtml(linkHtml);
      updateFormData({ linkUrl: '', linkText: '' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
        >
          🔗
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={formData.linkUrl}
              onChange={(e) => updateFormData({ linkUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Link Text (optional)</Label>
            <Input
              value={formData.linkText}
              onChange={(e) => updateFormData({ linkText: e.target.value })}
              placeholder="Click here"
            />
          </div>
          <Button onClick={handleLinkInsert} className="w-full">
            Insert Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};