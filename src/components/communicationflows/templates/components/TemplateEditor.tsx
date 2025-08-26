
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share, Trash2 } from 'lucide-react';
import { TextEditor } from '@/components/texteditor';
import { generateShortcodes } from '@/utils/shortcodeGenerator';
import { TemplateEditorProps } from '../types';
import { getTypeIcon, getTypeBadgeColor, getContextLabel, getUsedBy } from '../utils';
import { VOICE_OPTIONS } from '../constants';

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onUpdate,
  onBack,
  onDelete,
  onPush,
  customFields,
  templates,
  context,
  formData,
  updateFormDataWithHistory
}) => {
  const usedBy = getUsedBy(template, context);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id, e);
  };

  const handlePushClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPush(template.id, e);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div className="flex items-center space-x-2">
          {usedBy && usedBy.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePushClick}
            >
              <Share className="h-4 w-4 mr-2" />
              Push to {context === 'calendar' ? 'Calendars' : context === 'form' ? 'Forms' : context === 'confirmation' ? 'Confirmations' : context === 'email_campaign' ? 'Campaign Emails' : 'PDFs'}
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(template.type)}</span>
            <div className="flex-1">
              <Input
                value={template.name}
                onChange={(e) => onUpdate(template.id, 'name', e.target.value)}
                className="text-lg font-medium"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getTypeBadgeColor(template.type)}>
                  {template.type === 'email' && template.context === 'email_campaign' ? 'EMAILCAMPAIGN' : template.type.toUpperCase()}
                </Badge>
                {usedBy && usedBy.length > 0 && (
                  <Badge variant="outline">
                    Used by {usedBy.length} {getContextLabel(context)}{usedBy.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {template.type === 'email' && (
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={template.subject || ''}
                onChange={(e) => onUpdate(template.id, 'subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>
          )}
          
          {template.type === 'aivoice' && (
            <div className="space-y-2">
              <Label>AI Voice</Label>
              <Select
                value={template.voice || 'kim'}
                onValueChange={(value) => onUpdate(template.id, 'voice', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((option) => (
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
              {template.type === 'email' ? 'Email Content' : 
               template.type === 'sms' ? 'SMS Content' : 
               template.type === 'aivoice' ? 'AI Voice Script' : 
               template.type === 'pdf' ? 'PDF Content' : 'Knowledge Base Content'}
            </Label>
            <TextEditor
              value={template.content || ''}
              onChange={(value) => onUpdate(template.id, 'content', value)}
              availableShortcodes={generateShortcodes(customFields, context as any, formData)}
              customFields={customFields}
              templates={templates.filter(t => t.id !== template.id)}
              templateType={template.type === 'confirmation' ? 'confirmation' : template.type as any}
              context={context as any}
              formData={formData}
              updateFormDataWithHistory={updateFormDataWithHistory}
            />
          </div>
          
          {template.type === 'aivoice' && (
            <div className="space-y-2">
              <Label>Knowledge Base</Label>
              <TextEditor
                value={template.knowledgeBase || ''}
                onChange={(value) => onUpdate(template.id, 'knowledgeBase', value)}
                availableShortcodes={generateShortcodes(customFields, context as any, formData)}
                customFields={customFields}
                templates={templates.filter(t => t.type === 'knowledge')}
                templateType="knowledge"
                context={context as any}
                formData={formData}
                updateFormDataWithHistory={updateFormDataWithHistory}
              />
            </div>
          )}
          
          {usedBy && usedBy.length > 0 && (
            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Used by {getContextLabel(context)}:</Label>
                <div className="flex flex-wrap gap-2">
                  {usedBy.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
