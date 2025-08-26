import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { TextEditor } from '@/components/texteditor';
import { generateShortcodes } from '@/utils/shortcodeGenerator';
import { StepCardProps } from '../types';
import { 
  getStepTypeIcon, 
  getStepTypeBadgeColor, 
  getButtonElements 
} from '../utils';
import {
  DUMMY_EMAIL_OPTIONS,
  DUMMY_PHONE_NUMBERS,
  VOICE_OPTIONS,
  TRIGGER_TIME_OPTIONS_CALENDAR,
  TRIGGER_TIME_OPTIONS_FORM,
  TRIGGER_UNITS
} from '../constants';

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  flowId,
  isExpanded,
  onToggleExpansion,
  onUpdateStep,
  onDeleteStep,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggedOver,
  editingStepName,
  setEditingStepName,
  templates,
  customFields,
  context,
  formData,
  updateFormDataWithHistory
}) => {
  const triggerTimeOptions = context === 'calendar' 
    ? TRIGGER_TIME_OPTIONS_CALENDAR 
    : TRIGGER_TIME_OPTIONS_FORM;

  const addTemplate = (templateData: any) => {
    console.log('Template saved:', templateData);
  };

  // Handle drag start only from the grip handle
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, step);
  };

  return (
    <Card 
      className={`p-4 bg-muted/30 transition-all ${
        isDraggedOver ? 'bg-blue-100 border-blue-300' : ''
      }`}
      onDragOver={(e) => onDragOver(e, step)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, step, flowId)}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              draggable
              onDragStart={handleDragStart}
              className="cursor-move"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpansion(step.id)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <span className="text-lg">{getStepTypeIcon(step.type)}</span>
            {editingStepName === step.id ? (
              <Input
                value={step.name || ''}
                onChange={(e) => onUpdateStep(flowId, step.id, 'name', e.target.value)}
                onBlur={() => setEditingStepName(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditingStepName(null);
                  }
                }}
                className="font-medium text-sm h-auto py-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{step.name || `Step ${index + 1}`}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingStepName(step.id)}
                  className="p-1 h-6 w-6"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Badge className={getStepTypeBadgeColor(step.type)}>
              {step.type.toUpperCase()}
            </Badge>
            <Switch
              checked={step.enabled}
              onCheckedChange={(checked) => onUpdateStep(flowId, step.id, 'enabled', checked)}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteStep(flowId, step.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {isExpanded && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Communication Type</Label>
                <Select
                  value={step.type}
                  onValueChange={(value) => onUpdateStep(flowId, step.id, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="sms">💬 SMS</SelectItem>
                    <SelectItem value="aivoice">🎤 AI Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {context === 'form' ? 'When Button is Clicked' : 'Trigger Time'}
                </Label>
                {context === 'form' ? (
                  <Select
                    value={step.triggerButton || ''}
                    onValueChange={(value) => onUpdateStep(flowId, step.id, 'triggerButton', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button" />
                    </SelectTrigger>
                    <SelectContent>
                      {getButtonElements(formData).map(button => (
                        <SelectItem key={button.id} value={button.id}>
                          {button.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={step.triggerTime}
                    onValueChange={(value) => onUpdateStep(flowId, step.id, 'triggerTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTimeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {context === 'form' && step.triggerButton && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delay</Label>
                  <Select
                    value={step.triggerTime || 'immediately'}
                    onValueChange={(value) => onUpdateStep(flowId, step.id, 'triggerTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTimeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {step.triggerTime && step.triggerTime !== 'immediately' && (
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      type="number"
                      value={step.customTriggerValue || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'customTriggerValue', e.target.value)}
                      placeholder="Enter number"
                    />
                  </div>
                )}
              </div>
            )}

            {context === 'calendar' && (step.triggerTime === 'after_scheduling' || step.triggerTime === 'before_appointment') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    type="number"
                    value={step.customTriggerValue || ''}
                    onChange={(e) => onUpdateStep(flowId, step.id, 'customTriggerValue', e.target.value)}
                    placeholder="Enter number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select
                    value={step.customTriggerUnit || 'minutes'}
                    onValueChange={(value) => onUpdateStep(flowId, step.id, 'customTriggerUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_UNITS.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {step.type === 'email' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={step.fromName || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'fromName', e.target.value)}
                      placeholder="Your Organization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Address</Label>
                    <Select
                      value={step.fromAddress || ''}
                      onValueChange={(value) => onUpdateStep(flowId, step.id, 'fromAddress', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select email address" />
                      </SelectTrigger>
                      <SelectContent>
                        {DUMMY_EMAIL_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CC Address</Label>
                    <Input
                      value={step.ccAddress || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'ccAddress', e.target.value)}
                      placeholder="cc@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BCC Address</Label>
                    <Input
                      value={step.bccAddress || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'bccAddress', e.target.value)}
                      placeholder="bcc@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reply to</Label>
                    <Input
                      value={step.replyTo || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'replyTo', e.target.value)}
                      placeholder="reply@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Placeholder text</Label>
                    <Input
                      value={step.placeholderText || ''}
                      onChange={(e) => onUpdateStep(flowId, step.id, 'placeholderText', e.target.value)}
                      placeholder="Enter placeholder text"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={step.subject || ''}
                    onChange={(e) => onUpdateStep(flowId, step.id, 'subject', e.target.value)}
                    placeholder="Email subject"
                  />
                </div>
              </div>
            )}
            
            {(step.type === 'sms' || step.type === 'aivoice') && (
              <div className="space-y-2">
                <Label>{step.type === 'sms' ? 'Send From Number' : 'Call From Number'}</Label>
                <Select
                  value={step.fromNumber || ''}
                  onValueChange={(value) => onUpdateStep(flowId, step.id, 'fromNumber', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${step.type === 'sms' ? 'SMS' : 'calling'} number`} />
                  </SelectTrigger>
                  <SelectContent>
                    {DUMMY_PHONE_NUMBERS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {step.type === 'aivoice' && (
              <div className="space-y-2">
                <Label>AI Voice</Label>
                <Select
                  value={step.voice || 'kim'}
                  onValueChange={(value) => onUpdateStep(flowId, step.id, 'voice', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>
                {step.type === 'email' ? 'Email Content' : 
                 step.type === 'sms' ? 'SMS Content' : 'AI Voice Script'}
              </Label>
              <TextEditor
                value={step.content || ''}
                onChange={(value: string) => onUpdateStep(flowId, step.id, 'content', value)}
                availableShortcodes={generateShortcodes(customFields, context, formData)}
                customFields={customFields}
                templates={templates}
                onSaveTemplate={addTemplate}
                templateType={step.type}
                context={context}
                formData={formData}
              />
            </div>
            
            {step.type === 'aivoice' && (
              <div className="space-y-2">
                <Label>Knowledge Base</Label>
                <TextEditor
                  value={step.knowledgeBase || ''}
                  onChange={(value: string) => onUpdateStep(flowId, step.id, 'knowledgeBase', value)}
                  availableShortcodes={generateShortcodes(customFields, context, formData)}
                  customFields={customFields}
                  templates={templates}
                  onSaveTemplate={addTemplate}
                  templateType="knowledge"
                  context={context}
                  formData={formData}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
