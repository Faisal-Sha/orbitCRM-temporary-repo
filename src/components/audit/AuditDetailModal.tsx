
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  title: string;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  title
}) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="font-medium text-sm text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </span>
              <span className="text-sm">
                {typeof value === 'string' && value.includes('Success') ? (
                  <Badge variant="default">{value}</Badge>
                ) : typeof value === 'string' && value.includes('Failed') ? (
                  <Badge variant="destructive">{value}</Badge>
                ) : (
                  String(value)
                )}
              </span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This log entry is immutable and cannot be modified for compliance purposes.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailModal;
