import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FlowsBuilderProps } from './types';
import { FlowCard } from './components/FlowCard';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { useFlowsManagement } from './hooks/useFlowsManagement';
import { useDragAndDrop } from './hooks/useDragAndDrop';

export function FlowsBuilder({
  flows,
  setFlows,
  templates,
  customFields,
  context = 'calendar',
  formData,
  updateFormDataWithHistory,
}: FlowsBuilderProps) {
  const {
    expandedFlow,
    setExpandedFlow,
    expandedSteps,
    editingStepName,
    setEditingStepName,
    deleteFlowId,
    setDeleteFlowId,
    addFlow,
    updateFlow,
    deleteFlow,
    addStep,
    updateStep,
    deleteStep,
    toggleStepExpansion
  } = useFlowsManagement(flows, setFlows, context);

  const {
    draggedStep,
    dragOverStep,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop(flows, setFlows);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-medium">Communication Flows</h4>
          <p className="text-sm text-muted-foreground">
            Create automated communication sequences for your {context === 'calendar' ? 'appointments' : 'forms'}.
          </p>
        </div>
        <Button onClick={addFlow}>
          <Plus className="h-4 w-4 mr-2" />
          Add Flow
        </Button>
      </div>

      <div className="space-y-4">
        {flows.map((flow) => (
          <FlowCard
            key={flow.id}
            flow={flow}
            expandedFlow={expandedFlow}
            setExpandedFlow={setExpandedFlow}
            onUpdateFlow={updateFlow}
            onDeleteFlow={setDeleteFlowId}
            onAddStep={addStep}
            expandedSteps={expandedSteps}
            onToggleStepExpansion={toggleStepExpansion}
            templates={templates}
            customFields={customFields}
            context={context}
            formData={formData}
            updateFormDataWithHistory={updateFormDataWithHistory}
            onUpdateStep={updateStep}
            onDeleteStep={deleteStep}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            dragOverStep={dragOverStep}
            editingStepName={editingStepName}
            setEditingStepName={setEditingStepName}
          />
        ))}
      </div>

      {flows.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No communication flows configured.</p>
          <p className="text-sm">Create flows to automate email, SMS, and AI voice communications for your {context === 'calendar' ? 'appointments' : 'forms'}.</p>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteFlowId !== null}
        onClose={() => setDeleteFlowId(null)}
        onConfirm={() => deleteFlowId && deleteFlow(deleteFlowId)}
      />
    </div>
  );
}