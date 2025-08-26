
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { TextEditor } from '@/components/texteditor';
import { generateShortcodes } from '@/utils/shortcodeGenerator';

interface FormPDFBuilderProps {
  formData: any;
  setFormData: (data: any) => void;
  templates: any[];
  onSaveTemplate?: (templateData: any) => void;
}

export const FormPDFBuilder: React.FC<FormPDFBuilderProps> = ({
  formData,
  setFormData,
  templates,
  onSaveTemplate,
}) => {
  const updatePDFSettings = (pdfs: any[]) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        pdfs
      }
    });
  };

  const addPDF = () => {
    const currentPDFs = formData.settings?.pdfs || [];
    const newPDF = {
      id: Date.now(),
      name: `PDF Document ${currentPDFs.length + 1}`,
      filename: `document_${currentPDFs.length + 1}`,
      content: 'Your PDF content goes here. Use shortcodes to include form data.'
    };
    
    updatePDFSettings([...currentPDFs, newPDF]);
  };

  const updatePDF = (pdfId: number, field: string, value: any) => {
    const currentPDFs = formData.settings?.pdfs || [];
    const updatedPDFs = currentPDFs.map((pdf: any) =>
      pdf.id === pdfId ? { ...pdf, [field]: value } : pdf
    );
    updatePDFSettings(updatedPDFs);
  };

  const removePDF = (pdfId: number) => {
    const currentPDFs = formData.settings?.pdfs || [];
    const updatedPDFs = currentPDFs.filter((pdf: any) => pdf.id !== pdfId);
    updatePDFSettings(updatedPDFs);
  };

  const currentPDFs = formData.settings?.pdfs || [];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">PDF Documents</h3>
        <Button onClick={addPDF}>
          <Plus className="h-4 w-4 mr-1" />
          Add PDF
        </Button>
      </div>

      <div className="space-y-6">
        {currentPDFs.map((pdf: any) => (
          <div key={pdf.id} className="p-4 border rounded-md space-y-4">
            <div className="flex items-center justify-between">
              <Input
                value={pdf.name}
                onChange={(e) => updatePDF(pdf.id, 'name', e.target.value)}
                className="font-medium"
                placeholder="PDF configuration name"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePDF(pdf.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>PDF Filename</Label>
              <Input
                value={pdf.filename || ''}
                onChange={(e) => updatePDF(pdf.id, 'filename', e.target.value)}
                placeholder="document_filename"
              />
            </div>

            <div className="space-y-2">
              <Label>PDF Content</Label>
              <TextEditor
                value={pdf.content || ''}
                onChange={(value) => updatePDF(pdf.id, 'content', value)}
                availableShortcodes={generateShortcodes([], 'form', formData)}
                templates={templates}
                onSaveTemplate={onSaveTemplate}
                templateType="email"
                context="pdf"
                formData={formData}
              />
            </div>
          </div>
        ))}
      </div>

      {currentPDFs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No PDF documents configured.</p>
          <p className="text-sm">Add a PDF document to allow users to download form submissions as PDF files.</p>
        </div>
      )}
    </div>
  );
};
