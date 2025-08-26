import { useState, useEffect } from 'react';
import { createNewFlow, createNewStep } from '../utils';

export const useFlowsManagement = (
  flows: any[],
  setFlows: (flows: any[]) => void,
  context: string
) => {
  const [expandedFlow, setExpandedFlow] = useState<number | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});
  const [editingStepName, setEditingStepName] = useState<number | null>(null);
  const [deleteFlowId, setDeleteFlowId] = useState<number | null>(null);

  // Remember expanded state in localStorage
  const storageKey = `flowsBuilder_${context}_expanded`;
  
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setExpandedFlow(parsed.expandedFlow);
      setExpandedSteps(parsed.expandedSteps || {});
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({
      expandedFlow,
      expandedSteps
    }));
  }, [expandedFlow, expandedSteps, storageKey]);

  const addFlow = () => {
    const newFlow = createNewFlow(flows);
    setFlows([...flows, newFlow]);
    setExpandedFlow(newFlow.id);
  };

  const updateFlow = (flowId: number, field: string, value: any) => {
    setFlows(flows.map(flow => 
      flow.id === flowId ? { ...flow, [field]: value } : flow
    ));
  };

  const deleteFlow = (flowId: number) => {
    setFlows(flows.filter(flow => flow.id !== flowId));
    if (expandedFlow === flowId) {
      setExpandedFlow(null);
    }
    setDeleteFlowId(null);
  };

  const addStep = (flowId: number) => {
    const newStep = createNewStep(context);
    
    setFlows(flows.map(flow => 
      flow.id === flowId 
        ? { ...flow, steps: [...(flow.steps || []), newStep] }
        : flow
    ));

    // Automatically expand the new step
    setExpandedSteps(prev => ({
      ...prev,
      [newStep.id]: true
    }));
  };

  const updateStep = (flowId: number, stepId: number, field: string, value: any) => {
    setFlows(flows.map(flow => 
      flow.id === flowId 
        ? {
            ...flow,
            steps: flow.steps.map((step: any) => 
              step.id === stepId ? { ...step, [field]: value } : step
            )
          }
        : flow
    ));
  };

  const deleteStep = (flowId: number, stepId: number) => {
    setFlows(flows.map(flow => 
      flow.id === flowId 
        ? { ...flow, steps: flow.steps.filter((step: any) => step.id !== stepId) }
        : flow
    ));
  };

  const toggleStepExpansion = (stepId: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  return {
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
  };
};