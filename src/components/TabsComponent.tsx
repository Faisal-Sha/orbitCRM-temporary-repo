
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  defaultTab?: string;
}

const TabsComponent = ({ tabs, defaultTab }: TabsComponentProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);
  const { 
    interceptNavigation, 
    showUnsavedModal, 
    setShowUnsavedModal, 
    pendingNavigation, 
    onSave, 
    onDiscard, 
    saving,
    setSaving 
  } = useUnsavedChanges();

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    
    interceptNavigation(newTab, () => {
      setActiveTab(newTab);
    });
  };

  const handleModalSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave();
        setShowUnsavedModal(false);
        if (pendingNavigation) {
          pendingNavigation();
        }
      } finally {
        setSaving(false);
      }
    }
  };

  const handleModalDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleModalCancel = () => {
    setShowUnsavedModal(false);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="app-tabs w-full mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="app-tab"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Unsaved Changes Modal */}
      <Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
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
              onClick={handleModalCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleModalDiscard}
              disabled={saving}
            >
              Discard
            </Button>
            <Button 
              onClick={handleModalSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabsComponent;
