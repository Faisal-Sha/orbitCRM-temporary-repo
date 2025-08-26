
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filteredTemplates: any[];
  templateType?: string;
  context?: string;
  onLoadTemplate: (template: any) => void;
}

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  filteredTemplates,
  templateType,
  context,
  onLoadTemplate,
}) => {
  const loadTemplate = (template: any) => {
    onLoadTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
        >
          📝 Load Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => loadTemplate(template)}>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.type.toUpperCase()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No templates available for {templateType?.toUpperCase()} in {context} context.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
