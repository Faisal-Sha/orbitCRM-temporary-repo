import { useState } from 'react';

export const useDragAndDrop = (flows: any[], setFlows: (flows: any[]) => void) => {
  const [draggedStep, setDraggedStep] = useState<any>(null);
  const [dragOverStep, setDragOverStep] = useState<any>(null);

  const handleDragStart = (e: React.DragEvent, step: any) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, step: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStep(step);
  };

  const handleDragLeave = () => {
    setDragOverStep(null);
  };

  const handleDrop = (e: React.DragEvent, targetStep: any, flowId: number) => {
    e.preventDefault();
    
    if (!draggedStep || draggedStep.id === targetStep.id) {
      setDraggedStep(null);
      setDragOverStep(null);
      return;
    }

    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;

    const steps = [...flow.steps];
    const draggedIndex = steps.findIndex(s => s.id === draggedStep.id);
    const targetIndex = steps.findIndex(s => s.id === targetStep.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      steps.splice(draggedIndex, 1);
      steps.splice(targetIndex, 0, draggedStep);

      setFlows(flows.map(f => 
        f.id === flowId ? { ...f, steps } : f
      ));
    }

    setDraggedStep(null);
    setDragOverStep(null);
  };

  return {
    draggedStep,
    dragOverStep,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};