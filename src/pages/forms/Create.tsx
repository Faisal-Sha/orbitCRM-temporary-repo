import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { FormDesignTab } from "@/components/forms/FormDesignTab";
import { FormSettingsTab } from "@/components/forms/FormSettingsTab";
import { FormPreviewTab } from "@/components/forms/FormPreviewTab";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Share, Undo, Redo, Copy } from "lucide-react";
import { toast } from "sonner";

interface HistoryAction {
  type: string;
  description: string;
  data: any;
}

const Create = () => {
  const [formData, setFormData] = useState({
    steps: [
      {
        id: 'step_1',
        name: 'Step 1',
        elements: []
      }
    ],
    currentStep: 0,
    settings: {
      title: 'New Form',
      description: '',
      showStepNames: true,
      allowIncompleteNavigation: false,
      quiz: {
        scoreDisplayType: 'number',
        scoreRanges: []
      },
      confirmations: [
        {
          id: 1,
          name: 'Default Confirmation',
          type: 'design',
          content: 'Thank you for your submission!',
          url: '',
          conditions: []
        }
      ],
      emails: [],
      conditionalRules: []
    }
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState<HistoryAction[]>([
    {
      type: 'initial',
      description: 'Form created',
      data: formData
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const updateFormDataWithHistory = (newData: any, actionType: string, description: string) => {
    setFormData(newData);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    const newAction: HistoryAction = {
      type: actionType,
      description,
      data: newData
    };
    newHistory.push(newAction);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateFormData = (newData: any) => {
    updateFormDataWithHistory(newData, 'update', 'Form updated');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousIndex = historyIndex - 1;
      const previousAction = history[previousIndex];
      setHistoryIndex(previousIndex);
      setFormData(previousAction.data);
      
      // Clear selected element if it no longer exists
      if (selectedElement) {
        const elementExists = previousAction.data.steps.some((step: any) => 
          step.elements?.some((el: any) => el.id === selectedElement.id)
        );
        if (!elementExists) {
          setSelectedElement(null);
        }
      }
      
      toast.success(`Undo: ${history[historyIndex].description}`);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextAction = history[nextIndex];
      setHistoryIndex(nextIndex);
      setFormData(nextAction.data);
      toast.success(`Redo: ${nextAction.description}`);
    }
  };

  const handleSave = () => {
    // Simulate form save
    console.log('Saving form data:', formData);
    toast.success("Form saved successfully!");
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const generateShareUrl = () => {
    return `${window.location.origin}/forms/preview/${formData.settings.title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const generateEmbedCode = () => {
    return `<iframe src="${generateShareUrl()}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  const tabContent = (tabName: string) => {
    switch (tabName) {
      case "Design":
        return (
          <FormDesignTab
            formData={formData}
            setFormData={updateFormData}
            updateFormDataWithHistory={updateFormDataWithHistory}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        );
      case "Settings":
        return (
          <FormSettingsTab
            formData={formData}
            setFormData={updateFormData}
            updateFormDataWithHistory={updateFormDataWithHistory}
          />
        );
      case "Preview":
        return (
          <FormPreviewTab
            formData={formData}
          />
        );
      default:
        return (
          <div className="app-card">
            <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
            <p>This is the {tabName.toLowerCase()} tab content for Form Builder.</p>
          </div>
        );
    }
  };

  const tabs = [
    { value: "design", label: "Design", content: tabContent("Design") },
    { value: "settings", label: "Settings", content: tabContent("Settings") },
    { value: "preview", label: "Preview", content: tabContent("Preview") },
  ];

  return (
    <PageContainer
      title="Form Builder"
      description="Create and design forms with advanced features"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4 mr-1" />
            Redo
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-1" />
            Share Form
          </Button>
          <Button
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL Link</Label>
              <div className="flex space-x-2">
                <Input
                  value={generateShareUrl()}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateShareUrl())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>HTML Embed Code</Label>
              <div className="flex space-x-2">
                <Textarea
                  value={generateEmbedCode()}
                  readOnly
                  rows={3}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateEmbedCode())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TabsComponent tabs={tabs} defaultTab="design" />
    </PageContainer>
  );
};

export default Create;
