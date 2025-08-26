import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormElementsCanvasProps {
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const FormElementsCanvas: React.FC<FormElementsCanvasProps> = ({
  formData,
  setFormData,
  updateFormDataWithHistory,
  selectedElement,
  setSelectedElement,
  currentStep,
  setCurrentStep,
}) => {
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverStepIndex, setDragOverStepIndex] = useState<number | null>(null);
  const stepScrollRef = useRef<HTMLDivElement>(null);

  // Listen for element drops from FormElementsFields
  React.useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const elementType = e.dataTransfer?.getData('application/json');
      if (elementType) {
        try {
          const element = JSON.parse(elementType);
          addElementToCurrentStep(element);
        } catch (error) {
          console.error('Error parsing dropped element:', error);
        }
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const canvasElement = document.querySelector('.form-canvas');
    if (canvasElement) {
      canvasElement.addEventListener('drop', handleDrop as EventListener);
      canvasElement.addEventListener('dragover', handleDragOver as EventListener);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('drop', handleDrop as EventListener);
        canvasElement.removeEventListener('dragover', handleDragOver as EventListener);
      }
    };
  }, [currentStep, formData, setFormData, setSelectedElement]);

  const addElementToCurrentStep = (elementData: any) => {
    const newElement = {
      ...elementData,
      id: `${elementData.type}_${Date.now()}`,
      label: elementData.label || `${elementData.type.charAt(0).toUpperCase() + elementData.type.slice(1)} Field`,
      showLabel: elementData.type !== 'linebreak' && !['next', 'previous', 'save', 'submit'].includes(elementData.type),
    };

    const updatedSteps = [...formData.steps];
    if (!updatedSteps[currentStep]) {
      updatedSteps[currentStep] = {
        id: `step_${currentStep + 1}`,
        name: `Step ${currentStep + 1}`,
        elements: []
      };
    }

    if (!updatedSteps[currentStep].elements) {
      updatedSteps[currentStep].elements = [];
    }

    updatedSteps[currentStep] = {
      ...updatedSteps[currentStep],
      elements: [...updatedSteps[currentStep].elements, newElement]
    };

    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    // Use enhanced history tracking if available
    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'element_add',
        `${newElement.label} added`
      );
    } else {
      setFormData(newFormData);
    }

    // Auto-select the newly added element
    setSelectedElement(newElement);
  };

  const addStep = () => {
    const newStep = {
      id: `step_${Date.now()}`,
      name: `Step ${formData.steps.length + 1}`,
      elements: []
    };
    
    const newFormData = {
      ...formData,
      steps: [...formData.steps, newStep]
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'step_add',
        `${newStep.name} added`
      );
    } else {
      setFormData(newFormData);
    }
  };

  const deleteStep = (stepIndex: number) => {
    if (formData.steps.length <= 1) return;
    
    const stepName = formData.steps[stepIndex].name;
    const updatedSteps = formData.steps.filter((_: any, index: number) => index !== stepIndex);
    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'step_delete',
        `${stepName} deleted`
      );
    } else {
      setFormData(newFormData);
    }
    
    const newCurrentStep = Math.min(currentStep, updatedSteps.length - 1);
    setCurrentStep(newCurrentStep);
  };

  const renameStep = (stepIndex: number, newName: string) => {
    const oldName = formData.steps[stepIndex].name;
    const updatedSteps = [...formData.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      name: newName
    };
    
    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'step_rename',
        `Step renamed from "${oldName}" to "${newName}"`
      );
    } else {
      setFormData(newFormData);
    }
  };

  const deleteElement = (elementId: string) => {
    const currentStepElements = formData.steps[currentStep]?.elements || [];
    const elementToDelete = currentStepElements.find((el: any) => el.id === elementId);
    const updatedElements = currentStepElements.filter((el: any) => el.id !== elementId);
    
    const updatedSteps = [...formData.steps];
    updatedSteps[currentStep] = {
      ...updatedSteps[currentStep],
      elements: updatedElements
    };

    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'element_delete',
        `${elementToDelete?.label || 'Element'} deleted`
      );
    } else {
      setFormData(newFormData);
    }

    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Element drag and drop handlers
  const handleElementDragStart = (e: React.DragEvent, element: any, index: number) => {
    setDraggedElement({ element, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElementDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleElementDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedElement) return;

    const currentStepElements = [...(formData.steps[currentStep]?.elements || [])];
    const draggedElementData = currentStepElements[draggedElement.index];
    
    // Remove from original position
    currentStepElements.splice(draggedElement.index, 1);
    
    // Insert at new position
    const insertIndex = draggedElement.index < dropIndex ? dropIndex - 1 : dropIndex;
    currentStepElements.splice(insertIndex, 0, draggedElementData);

    const updatedSteps = [...formData.steps];
    updatedSteps[currentStep] = {
      ...updatedSteps[currentStep],
      elements: currentStepElements
    };

    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'element_move',
        `${draggedElementData.label} moved`
      );
    } else {
      setFormData(newFormData);
    }

    setDraggedElement(null);
    setDragOverIndex(null);
  };

  // Step drag and drop handlers
  const handleStepDragStart = (e: React.DragEvent, stepIndex: number) => {
    setDraggedStep(stepIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStepDragOver = (e: React.DragEvent, stepIndex: number) => {
    e.preventDefault();
    setDragOverStepIndex(stepIndex);
  };

  const handleStepDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedStep === null) return;

    const updatedSteps = [...formData.steps];
    const draggedStepData = updatedSteps[draggedStep];
    
    // Remove from original position
    updatedSteps.splice(draggedStep, 1);
    
    // Insert at new position
    const insertIndex = draggedStep < dropIndex ? dropIndex - 1 : dropIndex;
    updatedSteps.splice(insertIndex, 0, draggedStepData);

    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'step_move',
        `${draggedStepData.name} moved`
      );
    } else {
      setFormData(newFormData);
    }

    // Update current step if needed
    if (currentStep === draggedStep) {
      setCurrentStep(insertIndex);
    } else if (currentStep > draggedStep && currentStep <= insertIndex) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep < draggedStep && currentStep >= insertIndex) {
      setCurrentStep(currentStep + 1);
    }

    setDraggedStep(null);
    setDragOverStepIndex(null);
  };

  const updateElementWidth = (elementId: string, width: string) => {
    const currentStepElements = formData.steps[currentStep]?.elements || [];
    const element = currentStepElements.find((el: any) => el.id === elementId);
    const updatedElements = currentStepElements.map((el: any) =>
      el.id === elementId ? { ...el, width } : el
    );
    
    const updatedSteps = [...formData.steps];
    updatedSteps[currentStep] = {
      ...updatedSteps[currentStep],
      elements: updatedElements
    };

    const newFormData = {
      ...formData,
      steps: updatedSteps
    };

    if (updateFormDataWithHistory) {
      updateFormDataWithHistory(
        newFormData,
        'element_resize',
        `${element?.label || 'Element'} width changed to ${width}`
      );
    } else {
      setFormData(newFormData);
    }
  };

  const scrollSteps = (direction: 'left' | 'right') => {
    if (stepScrollRef.current) {
      const scrollAmount = 200;
      stepScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderFormElement = (element: any, index: number) => {
    const isSelected = selectedElement?.id === element.id;
    const isDraggedOver = dragOverIndex === index;
    
    return (
      <div
        key={element.id}
        className={`relative p-3 border rounded-md cursor-pointer transition-all duration-200 ${
          isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
        } ${isDraggedOver ? 'border-dashed border-primary bg-primary/10' : ''}`}
        onClick={() => setSelectedElement(element)}
        style={{ width: element.width || '100%' }}
        draggable
        onDragStart={(e) => handleElementDragStart(e, element, index)}
        onDragOver={(e) => handleElementDragOver(e, index)}
        onDrop={(e) => handleElementDrop(e, index)}
        onDragEnd={() => {
          setDraggedElement(null);
          setDragOverIndex(null);
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
            {isSelected && (
              <div className="flex items-center space-x-1">
                <Select
                  value={element.width || '100%'}
                  onValueChange={(value) => updateElementWidth(element.id, value)}
                >
                  <SelectTrigger className="h-6 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100%">Full</SelectItem>
                    <SelectItem value="50%">Half</SelectItem>
                    <SelectItem value="33.33%">1/3</SelectItem>
                    <SelectItem value="66.66%">2/3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(element.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {element.showLabel && element.label && (
          <label className="block text-sm font-medium mb-1">
            {element.label}
            {element.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {renderElementPreview(element)}
      </div>
    );
  };

  const renderElementPreview = (element: any) => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'address':
      case 'number':
      case 'url':
      case 'password':
        return (
          <Input
            placeholder={element.placeholder}
            disabled
            className="bg-muted/50"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            disabled
            className="w-full p-2 border border-input rounded-md bg-muted/50 min-h-[80px] resize-none"
          />
        );
      
      case 'dropdown':
      case 'quiz_dropdown':
        return (
          <select disabled className="w-full p-2 border border-input rounded-md bg-muted/50">
            <option>{element.placeholder || 'Select an option'}</option>
            {element.options?.map((option: any) => (
              <option key={option.id}>{option.text}</option>
            ))}
          </select>
        );
      
      case 'radio':
      case 'quiz_radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option: any) => (
              <div key={option.id} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span className="text-sm">{option.text}</span>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
      case 'quiz_checkbox':
        return (
          <div className="space-y-2">
            {element.options?.map((option: any) => (
              <div key={option.id} className="flex items-center">
                <input type="checkbox" disabled className="mr-2" />
                <span className="text-sm">{option.text}</span>
              </div>
            ))}
          </div>
        );
      
      case 'heading':
        return <h3 className="text-lg font-semibold">{element.label}</h3>;
      
      case 'paragraph':
        return <p className="text-sm text-muted-foreground">{element.label}</p>;
      
      case 'linebreak':
        return <hr className="border-border" />;
      
      case 'next':
      case 'previous':
      case 'save':
      case 'submit':
        return (
          <Button variant="default" disabled>
            {element.label}
          </Button>
        );
      
      case 'datetime':
        return (
          <Input
            type={element.dateType === 'time' ? 'time' : element.dateType === 'datetime' ? 'datetime-local' : 'date'}
            disabled
            className="bg-muted/50"
          />
        );
      
      case 'rating':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: element.maxRating || 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
        );
      
      case 'signature':
        return (
          <div className="border border-dashed border-muted-foreground/50 h-24 flex items-center justify-center bg-muted/30">
            <span className="text-muted-foreground text-sm">Click and Drag to Sign</span>
          </div>
        );
      
      case 'fileupload':
        return (
          <div className="border border-dashed border-muted-foreground/50 h-16 flex items-center justify-center bg-muted/30">
            <span className="text-muted-foreground text-sm">Drop files here or click to upload</span>
          </div>
        );
      
      case 'recaptcha':
        return (
          <div className="flex items-center">
            <input type="checkbox" disabled className="mr-2" />
            <span className="text-sm">I'm not a robot</span>
          </div>
        );
      
      case 'quiz_slider':
        return (
          <div className="space-y-2">
            <input type="range" min={element.sliderMin || 0} max={element.sliderMax || 10} disabled className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{element.sliderMin || 0}</span>
              <span>{element.sliderMax || 10}</span>
            </div>
          </div>
        );
      
      case 'hidden':
        return <span className="text-xs text-muted-foreground italic">Hidden field</span>;
      
      default:
        return (
          <Input
            placeholder={element.placeholder}
            disabled
            className="bg-muted/50"
          />
        );
    }
  };

  const currentStepElements = formData.steps[currentStep]?.elements || [];

  return (
    <div className="p-4">
      {/* Step Tabs with Scroll */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollSteps('left')}
          className="shrink-0 mr-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div 
          ref={stepScrollRef}
          className="flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-1 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {formData.steps.map((step: any, index: number) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md border cursor-pointer whitespace-nowrap transition-all ${
                index === currentStep ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              } ${dragOverStepIndex === index ? 'border-dashed border-primary bg-primary/5' : ''}`}
              onClick={() => setCurrentStep(index)}
              draggable
              onDragStart={(e) => handleStepDragStart(e, index)}
              onDragOver={(e) => handleStepDragOver(e, index)}
              onDrop={(e) => handleStepDrop(e, index)}
              onDragEnd={() => {
                setDraggedStep(null);
                setDragOverStepIndex(null);
              }}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
              <Input
                value={step.name}
                onChange={(e) => renameStep(index, e.target.value)}
                className="border-none p-0 h-auto text-sm font-medium bg-transparent min-w-[80px]"
                onClick={(e) => e.stopPropagation()}
              />
              {formData.steps.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStep(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scrollSteps('right')}
          className="shrink-0 ml-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={addStep}
          className="shrink-0 ml-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>

      {/* Canvas Area */}
      <div 
        className="form-canvas min-h-[400px] border border-dashed border-muted-foreground/30 rounded-lg p-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedElement && currentStepElements.length === 0) {
            handleElementDrop(e, 0);
          }
        }}
      >
        {currentStepElements.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg mb-2">Drop elements here to start building your form</p>
            <p className="text-sm">Drag elements from the left panel to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentStepElements.map((element: any, index: number) => renderFormElement(element, index))}
          </div>
        )}
      </div>
    </div>
  );
};
