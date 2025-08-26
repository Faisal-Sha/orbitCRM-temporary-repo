
import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface BasicInputElementProps extends BaseElementProps {}

export const BasicInputElement: React.FC<BasicInputElementProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Built-in validation for number inputs - only allow numeric characters
    if (element.type === 'number') {
      newValue = newValue.replace(/[^0-9.-]/g, '');
    }
    
    updateFormValue(element.id, newValue);
  };

  return (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Input
        type={element.type === 'password' ? 'password' : element.type === 'number' ? 'text' : element.type === 'email' ? 'email' : element.type === 'url' ? 'url' : 'text'}
        placeholder={element.placeholder}
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        autoComplete={element.autocomplete ? 'on' : 'off'}
      />
      {element.showCharacterCount && (
        <div className="text-xs text-muted-foreground">
          {value.length}/{element.maxCharacters || '∞'} characters
        </div>
      )}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
};
