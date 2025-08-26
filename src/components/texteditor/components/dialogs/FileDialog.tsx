import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData, EditorActions } from '../../types';

interface FileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  actions: EditorActions;
}

export const FileDialog: React.FC<FileDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  updateFormData,
  actions,
}) => {
  const handleFileInsert = () => {
    if (formData.fileUrl && formData.fileName) {
      const fileHtml = `<a href="${formData.fileUrl}" download="${formData.fileName}" target="_blank">${formData.fileName}</a>`;
      actions.insertHtml(fileHtml);
      updateFormData({ fileUrl: '', fileName: '' });
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
          📎
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload File</Label>
            <Input
              type="file"
              onChange={(e) => actions.handleFileUpload(e, 'file')}
            />
          </div>
          <div className="text-center text-muted-foreground">or</div>
          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              value={formData.fileUrl}
              onChange={(e) => updateFormData({ fileUrl: e.target.value })}
              placeholder="https://example.com/document.pdf"
            />
          </div>
          <div className="space-y-2">
            <Label>File Name</Label>
            <Input
              value={formData.fileName}
              onChange={(e) => updateFormData({ fileName: e.target.value })}
              placeholder="document.pdf"
            />
          </div>
          <Button onClick={handleFileInsert} className="w-full">
            Insert File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};