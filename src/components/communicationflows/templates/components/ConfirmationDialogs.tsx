
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialogsProps } from '../types';
import { getContextLabel } from '../utils';

export const ConfirmationDialogs: React.FC<ConfirmationDialogsProps> = ({
  deleteTemplateId,
  pushTemplateId,
  onDeleteConfirm,
  onDeleteCancel,
  onPushConfirm,
  onPushCancel,
  templates,
  context
}) => {
  const contextLabel = getContextLabel(context);
  
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTemplateId !== null} onOpenChange={onDeleteCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Communication Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this communication template? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onDeleteCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteTemplateId && onDeleteConfirm(deleteTemplateId)}
              >
                Delete Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Push Confirmation Dialog */}
      <Dialog open={pushTemplateId !== null} onOpenChange={onPushCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Push Template Changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Performing this action will overwrite contents to all {contextLabel} where this template was used. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onPushCancel}>
                Cancel
              </Button>
              <Button 
                onClick={() => pushTemplateId && onPushConfirm(pushTemplateId)}
              >
                Push Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
