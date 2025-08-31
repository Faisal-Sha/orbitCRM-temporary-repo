
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import { useState } from "react";

const UnsavedChangesModal = () => {
  const {
    showModal,
    setShowModal,
    pendingNavigation,
    setPendingNavigation,
    onSave,
    onDiscard,
    setHasUnsavedChanges,
  } = useUnsavedChanges();
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setSaving(true);
      await onSave();
      setHasUnsavedChanges(false);
      setShowModal(false);
      if (pendingNavigation) {
        pendingNavigation();
        setPendingNavigation(null);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    setHasUnsavedChanges(false);
    setShowModal(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingNavigation(null);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes that will be lost if you navigate away. 
            Would you like to save your changes before continuing?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDiscard}
            disabled={saving}
          >
            Discard
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsavedChangesModal;
