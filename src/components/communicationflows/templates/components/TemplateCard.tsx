
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share, Trash2 } from 'lucide-react';
import { TemplateCardProps } from '../types';
import { getTypeIcon, getTypeBadgeColor, getContextLabel, getUsedBy } from '../utils';

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onPush,
  context
}) => {
  const usedBy = getUsedBy(template, context);

  return (
    <Card 
      key={template.id} 
      className="border hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => onEdit(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getTypeIcon(template.type)}</span>
            <div>
              <h4 className="font-medium">{template.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getTypeBadgeColor(template.type)}>
                  {template.type.toUpperCase()}
                </Badge>
                {usedBy && usedBy.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Used by {usedBy.length} {getContextLabel(context)}{usedBy.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {usedBy && usedBy.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => onPush(template.id, e)}
              >
                <Share className="h-4 w-4 mr-1" />
                Push
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onDelete(template.id, e)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground line-clamp-2">
          {template.content && template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
        </div>
        
        {usedBy && usedBy.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              <strong>Used by:</strong> {usedBy.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
