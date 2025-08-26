
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface SelectElementProps extends BaseElementProps {}

export const SelectElement: React.FC<SelectElementProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
}) => {
  const renderDropdown = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Select value={value} onValueChange={(val) => updateFormValue(element.id, val)} disabled={isDisabled}>
        <SelectTrigger>
          <SelectValue placeholder={element.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {element.options?.map((option: any) => (
            <SelectItem key={option.id} value={option.text}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderRadio = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <RadioGroup
        value={value}
        onValueChange={(val) => updateFormValue(element.id, val)}
        disabled={isDisabled}
      >
        {element.options?.map((option: any) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.text} id={`${element.id}_${option.id}`} />
            <label htmlFor={`${element.id}_${option.id}`} className="text-sm">
              {option.text}
            </label>
          </div>
        ))}
      </RadioGroup>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderCheckbox = () => {
    const checkboxValues = Array.isArray(value) ? value : [];
    return (
      <div className={`space-y-2 ${getWidthClass(element.width)}`}>
        {element.showLabel && (
          <label className="block text-sm font-medium">
            {element.label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="space-y-2">
          {element.options?.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${element.id}_${option.id}`}
                checked={checkboxValues.includes(option.text)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...checkboxValues, option.text]
                    : checkboxValues.filter((v: string) => v !== option.text);
                  updateFormValue(element.id, newValues);
                }}
                disabled={isDisabled}
              />
              <label htmlFor={`${element.id}_${option.id}`} className="text-sm">
                {option.text}
              </label>
            </div>
          ))}
        </div>
        {error && <div className="text-xs text-destructive">{error}</div>}
      </div>
    );
  };

  if (element.type === 'dropdown' || element.type === 'quiz_dropdown') {
    return renderDropdown();
  } else if (element.type === 'radio' || element.type === 'quiz_radio') {
    return renderRadio();
  } else if (element.type === 'checkbox' || element.type === 'quiz_checkbox') {
    return renderCheckbox();
  }

  return null;
};
