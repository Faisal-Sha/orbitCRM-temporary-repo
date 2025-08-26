
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface TextareaElementProps extends BaseElementProps {}

export const TextareaElement: React.FC<TextareaElementProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
}) => {
  return (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Textarea
        placeholder={element.placeholder}
        value={value}
        onChange={(e) => updateFormValue(element.id, e.target.value)}
        disabled={isDisabled}
        rows={4}
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
