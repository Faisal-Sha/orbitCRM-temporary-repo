
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { TemplateListProps } from '../types';
import { TemplateCard } from './TemplateCard';

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEdit,
  onDelete,
  onPush,
  onAdd,
  filterType,
  onFilterChange,
  context
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-medium">Communication Templates</h4>
          <p className="text-sm text-muted-foreground">
            Create and manage reusable templates for your {context} communication flows.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {context === 'confirmation' ? (
                <SelectItem value="confirmation">Confirmation</SelectItem>
              ) : context === 'pdf' ? (
                <SelectItem value="pdf">PDF</SelectItem>
              ) : context === 'email_campaign' || context === 'email_automation' ? (
                <SelectItem value="email">Email</SelectItem>
              ) : context === 'sms_automation' || context === 'sms_campaign' ? (
                <SelectItem value="sms">SMS</SelectItem>
              ) : context === 'call_automation' ? (
                <>
                  <SelectItem value="aivoice">AI Voice</SelectItem>
                  <SelectItem value="knowledge">Knowledge</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="aivoice">AI Voice</SelectItem>
                  <SelectItem value="knowledge">Knowledge</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {context === 'confirmation' ? (
            <Button onClick={() => onAdd('confirmation')} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Confirmation
            </Button>
          ) : context === 'pdf' ? (
            <Button onClick={() => onAdd('pdf')} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              PDF
            </Button>
          ) : context === 'email_campaign' || context === 'email_automation' ? (
            <Button onClick={() => onAdd('email')} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Email
            </Button>
          ) : context === 'sms_automation' || context === 'sms_campaign' ? (
            <Button onClick={() => onAdd('sms')} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              SMS
            </Button>
          ) : context === 'call_automation' ? (
            <>
              <Button onClick={() => onAdd('aivoice')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                AI Voice
              </Button>
              <Button onClick={() => onAdd('knowledge')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Knowledge
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => onAdd('email')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button onClick={() => onAdd('sms')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                SMS
              </Button>
              <Button onClick={() => onAdd('aivoice')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                AI Voice
              </Button>
              <Button onClick={() => onAdd('knowledge')} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Knowledge
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={onEdit}
            onDelete={onDelete}
            onPush={onPush}
            context={context}
          />
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No {filterType === 'all' ? '' : filterType} templates found for {context}.</p>
          <p className="text-sm">Create templates to reuse across multiple communication flows.</p>
        </div>
      )}
    </>
  );
};
