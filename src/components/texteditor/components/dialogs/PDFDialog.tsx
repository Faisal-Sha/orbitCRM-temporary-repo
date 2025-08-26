import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData, EditorActions } from '../../types';

interface PDFDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  actions: EditorActions;
  availablePDFs: any[];
  showPDFButton: boolean;
}

export const PDFDialog: React.FC<PDFDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  updateFormData,
  actions,
  availablePDFs,
  showPDFButton,
}) => {
  const handlePDFInsert = () => {
    if (formData.selectedPDFId) {
      const selectedPDF = availablePDFs.find((pdf: any) => pdf.id.toString() === formData.selectedPDFId);
      if (selectedPDF) {
        const pdfHtml = `<a href="#" onclick="downloadPDF('${selectedPDF.id}')" target="_blank">Download ${selectedPDF.name}</a>`;
        actions.insertHtml(pdfHtml);
        updateFormData({ selectedPDFId: '' });
        onOpenChange(false);
      }
    }
  };

  if (!showPDFButton) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          title="Insert PDF Download Link"
        >
          📄
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert PDF Download Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select PDF Document</Label>
            <Select value={formData.selectedPDFId} onValueChange={(value) => updateFormData({ selectedPDFId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a PDF document" />
              </SelectTrigger>
              <SelectContent>
                {availablePDFs.map((pdf: any) => (
                  <SelectItem key={pdf.id} value={pdf.id.toString()}>
                    {pdf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handlePDFInsert} className="w-full" disabled={!formData.selectedPDFId}>
            Insert PDF Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};