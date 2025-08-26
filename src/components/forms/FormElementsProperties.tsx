import React, { useEffect, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface FormElementsPropertiesProps {
  selectedElement: any;
  formData: any;
  setFormData: (data: any) => void;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export const FormElementsProperties: React.FC<FormElementsPropertiesProps> = ({
  selectedElement,
  formData,
  setFormData,
  updateFormDataWithHistory,
}) => {
  const labelInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on label input when element is selected
  useEffect(() => {
    if (selectedElement && labelInputRef.current) {
      setTimeout(() => {
        labelInputRef.current?.focus();
        labelInputRef.current?.select();
      }, 100);
    }
  }, [selectedElement?.id]);

  // Find the current element in form data to ensure we have the latest version
  const currentElement = useMemo(() => {
    if (!selectedElement) return null;
    
    // Find the element in the current form data
    for (const step of formData.steps) {
      const element = step.elements?.find((el: any) => el.id === selectedElement.id);
      if (element) return element;
    }
    return null; // Element no longer exists (was undone)
  }, [selectedElement, formData.steps]);

  // Reset selected element if it no longer exists
  useEffect(() => {
    if (selectedElement && !currentElement) {
      // Element was removed via undo/redo, clear selection
      // This will be handled by the parent component
    }
  }, [currentElement, selectedElement]);

  if (!currentElement) {
    return (
      <div className="p-4">
        <div className="text-center text-muted-foreground py-12">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateElement = (property: string, value: any) => {
    const updatedSteps = [...formData.steps];
    
    // Find the correct step and element
    let updated = false;
    let elementLabel = currentElement.label || currentElement.type;
    
    for (let i = 0; i < updatedSteps.length; i++) {
      const elementIndex = updatedSteps[i].elements?.findIndex((el: any) => el.id === currentElement.id);
      if (elementIndex !== -1) {
        const updatedElement = { ...updatedSteps[i].elements[elementIndex], [property]: value };
        updatedSteps[i] = {
          ...updatedSteps[i],
          elements: updatedSteps[i].elements.map((el: any, idx: number) =>
            idx === elementIndex ? updatedElement : el
          )
        };
        updated = true;
        break;
      }
    }
    
    if (updated) {
      const newFormData = {
        ...formData,
        steps: updatedSteps
      };
      
      // Use enhanced history tracking if available
      if (updateFormDataWithHistory) {
        const propertyName = property === 'label' ? 'label' : 
                           property === 'required' ? 'required status' :
                           property === 'hidden' ? 'visibility' :
                           property === 'width' ? 'width' :
                           property === 'dataSource' ? 'data source' :
                           property;
        updateFormDataWithHistory(
          newFormData, 
          'property_change', 
          `${elementLabel} ${propertyName} changed`
        );
      } else {
        setFormData(newFormData);
      }
    }
  };

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      text: `Option ${(currentElement.options?.length || 0) + 1}`,
      score: currentElement.type.includes('quiz') ? 0 : undefined
    };
    
    const updatedOptions = [...(currentElement.options || []), newOption];
    updateElement('options', updatedOptions);
  };

  const updateOption = (optionId: number, field: string, value: any) => {
    const updatedOptions = currentElement.options.map((option: any) =>
      option.id === optionId ? { ...option, [field]: value } : option
    );
    updateElement('options', updatedOptions);
  };

  const removeOption = (optionId: number) => {
    const updatedOptions = currentElement.options.filter((option: any) => option.id !== optionId);
    updateElement('options', updatedOptions);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const isButtonElement = ['next', 'previous', 'save', 'submit'].includes(currentElement.type);
  const isHiddenElement = currentElement.type === 'hidden';

  return (
    <div className="p-4 space-y-6">
      <h3 className="font-semibold">Element Properties</h3>
      
      {/* Label */}
      <div className="space-y-2">
        <Label>{isButtonElement ? 'Button Text' : 'Label'}</Label>
        <Input
          ref={labelInputRef}
          value={currentElement.label || ''}
          onChange={(e) => updateElement('label', e.target.value)}
          placeholder="Enter label"
        />
      </div>

      {/* Show Label Toggle (not for buttons or hidden fields) */}
      {!isButtonElement && !isHiddenElement && (
        <div className="flex items-center justify-between">
          <Label>Show Label</Label>
          <Switch
            checked={currentElement.showLabel !== false}
            onCheckedChange={(checked) => updateElement('showLabel', checked)}
          />
        </div>
      )}

      {/* Hidden Toggle (not for hidden fields - they're always hidden) */}
      {!isHiddenElement && (
        <div className="flex items-center justify-between">
          <Label>Hidden</Label>
          <Switch
            checked={currentElement.hidden || false}
            onCheckedChange={(checked) => updateElement('hidden', checked)}
          />
        </div>
      )}

      {/* Placeholder (not for buttons, headings, paragraphs, line breaks, hidden fields) */}
      {!isButtonElement && !isHiddenElement && !['heading', 'paragraph', 'linebreak', 'signature', 'fileupload', 'recaptcha'].includes(currentElement.type) && (
        <div className="space-y-2">
          <Label>Placeholder Text</Label>
          <Input
            value={currentElement.placeholder || ''}
            onChange={(e) => updateElement('placeholder', e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {/* Required Toggle (not for buttons, line breaks, or hidden fields) */}
      {!isButtonElement && !isHiddenElement && currentElement.type !== 'linebreak' && (
        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={currentElement.required || false}
            onCheckedChange={(checked) => updateElement('required', checked)}
          />
        </div>
      )}

      {/* User Status */}
      <div className="space-y-2">
        <Label>User Status</Label>
        <Select 
          value={currentElement.userStatus || 'any'} 
          onValueChange={(value) => updateElement('userStatus', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="logged_in">Is Logged In</SelectItem>
            <SelectItem value="logged_out">Is Logged Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Source Section (only for hidden fields) */}
      {currentElement.type === 'hidden' && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <Label className="text-base font-semibold">Data Source Configuration</Label>
          
          {/* Source Type Dropdown */}
          <div className="space-y-2">
            <Label>Source Type</Label>
            <Select 
              value={currentElement.dataSource?.type || 'none'} 
              onValueChange={(value) => updateElement('dataSource', { 
                ...currentElement.dataSource, 
                type: value,
                // Clear other properties when type changes
                parameterName: value === 'url_parameter' ? currentElement.dataSource?.parameterName : undefined,
                contactField: value === 'user_contact_field' ? currentElement.dataSource?.contactField : undefined,
                staticValue: value === 'static_value' ? currentElement.dataSource?.staticValue : undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="url_parameter">URL Parameter</SelectItem>
                <SelectItem value="referrer_url">Referrer URL</SelectItem>
                <SelectItem value="user_contact_field">Logged-in User/Contact Field</SelectItem>
                <SelectItem value="static_value">Static Value</SelectItem>
                <SelectItem value="client_ip">Client IP Address</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields based on Source Type */}
          {currentElement.dataSource?.type === 'url_parameter' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Parameter Name</Label>
                <Input
                  value={currentElement.dataSource?.parameterName || ''}
                  onChange={(e) => updateElement('dataSource', {
                    ...currentElement.dataSource,
                    parameterName: e.target.value
                  })}
                  placeholder="Enter URL parameter name"
                />
              </div>
              
              {/* UTM Parameter Quick Copy Options */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Common UTM Parameters (click to copy):</Label>
                <div className="flex flex-wrap gap-2">
                  {['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].map((param) => (
                    <Button
                      key={param}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => copyToClipboard(param)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {param}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentElement.dataSource?.type === 'user_contact_field' && (
            <div className="space-y-2">
              <Label>Field to Pull</Label>
              <Select 
                value={currentElement.dataSource?.contactField || ''} 
                onValueChange={(value) => updateElement('dataSource', {
                  ...currentElement.dataSource,
                  contactField: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact_first_name">Contact First Name</SelectItem>
                  <SelectItem value="contact_last_name">Contact Last Name</SelectItem>
                  <SelectItem value="contact_email">Contact Email</SelectItem>
                  <SelectItem value="contact_phone">Contact Phone</SelectItem>
                  <SelectItem value="contact_id">Contact ID</SelectItem>
                  <SelectItem value="user_id">User ID</SelectItem>
                  <SelectItem value="user_email">User Email</SelectItem>
                  <SelectItem value="user_role">User Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {currentElement.dataSource?.type === 'static_value' && (
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={currentElement.dataSource?.staticValue || ''}
                onChange={(e) => updateElement('dataSource', {
                  ...currentElement.dataSource,
                  staticValue: e.target.value
                })}
                placeholder="Enter static value"
              />
            </div>
          )}

          {/* Info text for other types */}
          {currentElement.dataSource?.type === 'referrer_url' && (
            <div className="text-sm text-muted-foreground p-2 bg-blue-50 rounded">
              This field will be automatically populated with the referring URL when the form is loaded.
            </div>
          )}

          {currentElement.dataSource?.type === 'client_ip' && (
            <div className="text-sm text-muted-foreground p-2 bg-blue-50 rounded">
              This field will be automatically populated with the client's IP address when the form is loaded.
            </div>
          )}
        </div>
      )}

      {/* Character Limits (for text inputs) */}
      {['text', 'textarea', 'email', 'phone', 'address', 'url', 'password'].includes(currentElement.type) && (
        <>
          <div className="space-y-2">
            <Label>Minimum Characters</Label>
            <Input
              type="number"
              value={currentElement.minCharacters || ''}
              onChange={(e) => updateElement('minCharacters', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Characters</Label>
            <Input
              type="number"
              value={currentElement.maxCharacters || ''}
              onChange={(e) => updateElement('maxCharacters', e.target.value)}
              placeholder="No limit"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Character Count</Label>
            <Switch
              checked={currentElement.showCharacterCount || false}
              onCheckedChange={(checked) => updateElement('showCharacterCount', checked)}
            />
          </div>
        </>
      )}

      {/* Autocomplete (for email, phone, address, url) */}
      {['email', 'phone', 'address', 'url'].includes(currentElement.type) && (
        <div className="flex items-center justify-between">
          <Label>Autocomplete</Label>
          <Switch
            checked={currentElement.autocomplete !== false}
            onCheckedChange={(checked) => updateElement('autocomplete', checked)}
          />
        </div>
      )}

      {/* Phone Format */}
      {currentElement.type === 'phone' && (
        <div className="space-y-2">
          <Label>Phone Format</Label>
          <Select 
            value={currentElement.phoneFormat || 'us'} 
            onValueChange={(value) => updateElement('phoneFormat', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">US</SelectItem>
              <SelectItem value="uk">UK</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Options (for dropdowns, radio, checkbox) */}
      {(currentElement.options) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>
          <div className="space-y-3">
            {currentElement.options.map((option: any) => (
              <div key={option.id} className="space-y-2 p-3 border rounded-md">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Option text"
                    value={option.text || ''}
                    onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {currentElement.type.includes('quiz') && (
                  <Input
                    type="number"
                    placeholder="Score"
                    value={option.score || 0}
                    onChange={(e) => updateOption(option.id, 'score', parseInt(e.target.value) || 0)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date/Time specific properties */}
      {currentElement.type === 'datetime' && (
        <>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={currentElement.dateType || 'date'} 
              onValueChange={(value) => updateElement('dateType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="datetime">Date/Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select 
              value={currentElement.dateFormat || 'us'} 
              onValueChange={(value) => updateElement('dateFormat', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">US</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="iso">ISO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Rating specific properties */}
      {currentElement.type === 'rating' && (
        <>
          <div className="space-y-2">
            <Label>Icon Design</Label>
            <Select 
              value={currentElement.iconDesign || 'star'} 
              onValueChange={(value) => updateElement('iconDesign', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star">Star</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Max Rating</Label>
            <Input
              type="number"
              value={currentElement.maxRating || 5}
              onChange={(e) => updateElement('maxRating', parseInt(e.target.value) || 5)}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon Color</Label>
            <Select 
              value={currentElement.iconColor || 'yellow'} 
              onValueChange={(value) => updateElement('iconColor', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Quiz Slider specific properties */}
      {currentElement.type === 'quiz_slider' && (
        <>
          <div className="space-y-2">
            <Label>From (Minimum)</Label>
            <Input
              type="number"
              value={currentElement.sliderMin || 0}
              onChange={(e) => updateElement('sliderMin', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>To (Maximum)</Label>
            <Input
              type="number"
              value={currentElement.sliderMax || 10}
              onChange={(e) => updateElement('sliderMax', parseInt(e.target.value) || 10)}
            />
          </div>
        </>
      )}

      {/* Pre-populated field source */}
      {currentElement.type === 'prepopulated' && (
        <div className="space-y-2">
          <Label>Pre-fill from another field</Label>
          <Select 
            value={currentElement.sourceField || ''} 
            onValueChange={(value) => updateElement('sourceField', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source field" />
            </SelectTrigger>
            <SelectContent>
              {formData.steps.flatMap((step: any) => 
                step.elements.filter((el: any) => 
                  el.id !== currentElement.id && 
                  !['next', 'previous', 'save', 'submit', 'linebreak'].includes(el.type)
                )
              ).map((element: any) => (
                <SelectItem key={element.id} value={element.id}>
                  {element.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Element Width */}
      <div className="space-y-2">
        <Label>Element Width</Label>
        <Select 
          value={currentElement.width || '100%'} 
          onValueChange={(value) => updateElement('width', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100%">Full Width</SelectItem>
            <SelectItem value="50%">Half Width</SelectItem>
            <SelectItem value="33.33%">One Third</SelectItem>
            <SelectItem value="66.66%">Two Thirds</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
