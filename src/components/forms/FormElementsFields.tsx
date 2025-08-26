import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Mail, Phone, MapPin, Hash, Link, EyeOff, ChevronDown, 
         Circle, Square, Heading1, FileText, Minus, ArrowRight, ArrowLeft, 
         Save, Send, Calendar, Star, PenTool, Upload, Shield, Copy, Repeat, 
         Lock, BarChart3 } from 'lucide-react';

interface FormElementsFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setSelectedElement: (element: any) => void;
}

export const FormElementsFields: React.FC<FormElementsFieldsProps> = ({
  formData,
  setFormData,
  currentStep,
  setSelectedElement,
}) => {
  const addElement = (type: string) => {
    const newElement = {
      id: `${type}_${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      placeholder: '',
      required: false,
      hidden: false,
      showLabel: type !== 'next' && type !== 'previous' && type !== 'save' && type !== 'submit',
      userStatus: 'any',
      minCharacters: '',
      maxCharacters: '',
      showCharacterCount: false,
      options: type.includes('dropdown') || type.includes('radio') || type.includes('checkbox') ? 
        [{ id: 1, text: 'Option 1', score: type.includes('quiz') ? 0 : undefined }] : undefined,
      width: '100%',
      position: { x: 0, y: 0 },
      // Add dataSource configuration for hidden fields
      ...(type === 'hidden' ? { dataSource: { type: 'none' } } : {}),
      ...getTypeSpecificDefaults(type)
    };

    const updatedSteps = [...formData.steps];
    
    // Ensure the current step exists
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

    // Add element to the current step
    updatedSteps[currentStep] = {
      ...updatedSteps[currentStep],
      elements: [...updatedSteps[currentStep].elements, newElement]
    };

    setFormData({
      ...formData,
      steps: updatedSteps
    });

    // Auto-select the newly added element for property editing
    setSelectedElement(newElement);
  };

  const getDefaultLabel = (type: string) => {
    const labels = {
      text: 'Text Input',
      textarea: 'Text Area',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      number: 'Number',
      url: 'URL',
      hidden: 'Hidden Field',
      dropdown: 'Dropdown',
      radio: 'Radio Buttons',
      checkbox: 'Checkboxes',
      heading: 'Heading',
      paragraph: 'Paragraph',
      linebreak: 'Line Break',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      submit: 'Submit',
      datetime: 'Date/Time',
      rating: 'Rating',
      signature: 'Signature',
      fileupload: 'File Upload',
      recaptcha: 'reCAPTCHA',
      prepopulated: 'Pre-populated Field',
      repeater: 'Repeater Field',
      password: 'Password',
      quiz_dropdown: 'Quiz Dropdown',
      quiz_radio: 'Quiz Radio',
      quiz_checkbox: 'Quiz Checkbox',
      quiz_slider: 'Quiz Slider'
    };
    return labels[type as keyof typeof labels] || 'New Field';
  };

  const getTypeSpecificDefaults = (type: string) => {
    const defaults: any = {};
    
    if (type === 'datetime') {
      defaults.dateType = 'date';
      defaults.dateFormat = 'us';
    }
    
    if (type === 'rating') {
      defaults.iconDesign = 'star';
      defaults.maxRating = 5;
      defaults.iconColor = 'yellow';
    }
    
    if (type === 'phone') {
      defaults.phoneFormat = 'us';
      defaults.autocomplete = true;
    }
    
    if (['email', 'address', 'url'].includes(type)) {
      defaults.autocomplete = true;
    }
    
    if (type === 'quiz_slider') {
      defaults.sliderMin = 0;
      defaults.sliderMax = 10;
    }
    
    return defaults;
  };

  const elementCategories = [
    {
      title: 'Basic Inputs',
      elements: [
        { type: 'text', icon: Type, label: 'Text Input' },
        { type: 'textarea', icon: FileText, label: 'Textarea' },
        { type: 'email', icon: Mail, label: 'Email Input' },
        { type: 'phone', icon: Phone, label: 'Phone Number' },
        { type: 'address', icon: MapPin, label: 'Address Field' },
        { type: 'number', icon: Hash, label: 'Number Input' },
        { type: 'url', icon: Link, label: 'URL Field' },
        { type: 'password', icon: Lock, label: 'Password Field' },
        { type: 'hidden', icon: EyeOff, label: 'Hidden Field' },
      ]
    },
    {
      title: 'Selection Elements',
      elements: [
        { type: 'dropdown', icon: ChevronDown, label: 'Dropdown' },
        { type: 'radio', icon: Circle, label: 'Radio Buttons' },
        { type: 'checkbox', icon: Square, label: 'Checkboxes' },
      ]
    },
    {
      title: 'Content Elements',
      elements: [
        { type: 'heading', icon: Heading1, label: 'Heading' },
        { type: 'paragraph', icon: FileText, label: 'Paragraph/HTML' },
        { type: 'linebreak', icon: Minus, label: 'Line Break' },
      ]
    },
    {
      title: 'Button Elements',
      elements: [
        { type: 'next', icon: ArrowRight, label: 'Next Button' },
        { type: 'previous', icon: ArrowLeft, label: 'Previous Button' },
        { type: 'save', icon: Save, label: 'Save Button' },
        { type: 'submit', icon: Send, label: 'Submit Button' },
      ]
    },
    {
      title: 'Specialized Elements',
      elements: [
        { type: 'datetime', icon: Calendar, label: 'Date/Time' },
        { type: 'rating', icon: Star, label: 'Rating Scales' },
        { type: 'signature', icon: PenTool, label: 'Signature Field' },
        { type: 'fileupload', icon: Upload, label: 'File Upload' },
        { type: 'recaptcha', icon: Shield, label: 'reCAPTCHA' },
        { type: 'prepopulated', icon: Copy, label: 'Pre-Populated Field' },
        { type: 'repeater', icon: Repeat, label: 'Repeater Field' },
      ]
    },
    {
      title: 'Quiz Elements',
      elements: [
        { type: 'quiz_dropdown', icon: ChevronDown, label: 'Quiz Dropdown' },
        { type: 'quiz_radio', icon: Circle, label: 'Quiz Radio' },
        { type: 'quiz_checkbox', icon: Square, label: 'Quiz Checkbox' },
        { type: 'quiz_slider', icon: BarChart3, label: 'Quiz Slider' },
      ]
    }
  ];

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Form Elements</h3>
      <div className="space-y-6">
        {elementCategories.map((category) => (
          <div key={category.title}>
            <div className="bg-muted/50 px-3 py-2 rounded-md mb-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category.title}
              </h4>
            </div>
            <div className="space-y-2">
              {category.elements.map((element) => {
                const IconComponent = element.icon;
                return (
                  <Button
                    key={element.type}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => addElement(element.type)}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span className="text-xs">{element.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
