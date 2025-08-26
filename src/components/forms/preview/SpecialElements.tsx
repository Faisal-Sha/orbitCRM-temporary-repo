
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface SpecialElementsProps extends BaseElementProps {
  repeaterValues: Record<string, any[]>;
  setRepeaterValues: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  signatureCanvasRefs: React.MutableRefObject<Record<string, HTMLCanvasElement>>;
}

export const SpecialElements: React.FC<SpecialElementsProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
  repeaterValues,
  setRepeaterValues,
  signatureCanvasRefs,
}) => {
  const [signatureDrawing, setSignatureDrawing] = useState<Record<string, boolean>>({});

  const renderSignature = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="border border-border rounded-md p-4">
        <div className="relative">
          <canvas
            ref={(canvas) => {
              if (canvas) signatureCanvasRefs.current[element.id] = canvas;
            }}
            width={400}
            height={200}
            className="border border-dashed border-muted-foreground/50 w-full cursor-crosshair"
            style={{ maxWidth: '100%', height: '200px' }}
            onMouseDown={(e) => {
              const canvas = signatureCanvasRefs.current[element.id];
              if (!canvas) return;
              
              setSignatureDrawing(prev => ({ ...prev, [element.id]: true }));
              
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              
              const rect = canvas.getBoundingClientRect();
              const scaleX = canvas.width / rect.width;
              const scaleY = canvas.height / rect.height;
              const x = (e.clientX - rect.left) * scaleX;
              const y = (e.clientY - rect.top) * scaleY;
              
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineWidth = 2;
              ctx.strokeStyle = '#000';
              
              const draw = (e: MouseEvent) => {
                const newX = (e.clientX - rect.left) * scaleX;
                const newY = (e.clientY - rect.top) * scaleY;
                ctx.lineTo(newX, newY);
                ctx.stroke();
              };
              
              const stopDrawing = () => {
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', stopDrawing);
                
                const signatureData = canvas.toDataURL();
                updateFormValue(element.id, signatureData);
              };
              
              canvas.addEventListener('mousemove', draw);
              canvas.addEventListener('mouseup', stopDrawing);
            }}
          />
          {!signatureDrawing[element.id] && !value && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground text-sm">
              Click and Drag to Sign
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const canvas = signatureCanvasRefs.current[element.id];
              if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  updateFormValue(element.id, '');
                  setSignatureDrawing(prev => ({ ...prev, [element.id]: false }));
                }
              }
            }}
          >
            Clear Signature
          </Button>
        </div>
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderFileUpload = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="border border-dashed border-muted-foreground/50 rounded-md p-6 text-center">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              updateFormValue(element.id, file.name);
            }
          }}
          disabled={isDisabled}
          className="hidden"
          id={`file_${element.id}`}
        />
        <label
          htmlFor={`file_${element.id}`}
          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
        >
          {value ? `Selected: ${value}` : 'Drop files here or click to upload'}
        </label>
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderRecaptcha = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`recaptcha_${element.id}`}
          checked={value === true}
          onCheckedChange={(checked) => updateFormValue(element.id, checked)}
          disabled={isDisabled}
        />
        <label htmlFor={`recaptcha_${element.id}`} className="text-sm">
          I'm not a robot
        </label>
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderQuizSlider = () => (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Slider
        value={[parseInt(value) || element.sliderMin || 0]}
        onValueChange={(values) => updateFormValue(element.id, values[0])}
        min={element.sliderMin || 0}
        max={element.sliderMax || 10}
        step={1}
        disabled={isDisabled}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{element.sliderMin || 0}</span>
        <span>Current: {value || element.sliderMin || 0}</span>
        <span>{element.sliderMax || 10}</span>
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );

  const renderRepeater = () => {
    const repeaterItems = repeaterValues[element.id] || [{}];
    return (
      <div className={`space-y-4 ${getWidthClass(element.width)}`}>
        {element.showLabel && (
          <label className="block text-sm font-medium">
            {element.label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="space-y-3">
          {repeaterItems.map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Item {index + 1}</span>
                {repeaterItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = repeaterItems.filter((_, i) => i !== index);
                      setRepeaterValues(prev => ({ ...prev, [element.id]: newItems }));
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                placeholder="Enter value"
                value={item.value || ''}
                onChange={(e) => {
                  const newItems = [...repeaterItems];
                  newItems[index] = { ...newItems[index], value: e.target.value };
                  setRepeaterValues(prev => ({ ...prev, [element.id]: newItems }));
                  updateFormValue(element.id, newItems.map(item => item.value).join(', '));
                }}
                disabled={isDisabled}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newItems = [...repeaterItems, {}];
              setRepeaterValues(prev => ({ ...prev, [element.id]: newItems }));
            }}
            disabled={isDisabled}
          >
            Add Item
          </Button>
        </div>
        {error && <div className="text-xs text-destructive">{error}</div>}
      </div>
    );
  };

  switch (element.type) {
    case 'signature':
      return renderSignature();
    case 'fileupload':
      return renderFileUpload();
    case 'recaptcha':
      return renderRecaptcha();
    case 'quiz_slider':
      return renderQuizSlider();
    case 'repeater':
      return renderRepeater();
    default:
      return null;
  }
};
