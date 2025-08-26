import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData, EditorActions } from '../../types';

interface ImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  actions: EditorActions;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  updateFormData,
  actions,
}) => {
  const handleImageInsert = () => {
    if (formData.imageUrl) {
      const imageHtml = `<img src="${formData.imageUrl}" alt="${formData.imageAlt}" style="max-width: 100%; height: auto;" />`;
      actions.insertHtml(imageHtml);
      updateFormData({ imageUrl: '', imageAlt: '' });
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
          🖼️
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => actions.handleFileUpload(e, 'image')}
            />
          </div>
          <div className="text-center text-muted-foreground">or</div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => updateFormData({ imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={formData.imageAlt}
              onChange={(e) => updateFormData({ imageAlt: e.target.value })}
              placeholder="Image description"
            />
          </div>
          <Button onClick={handleImageInsert} className="w-full">
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};