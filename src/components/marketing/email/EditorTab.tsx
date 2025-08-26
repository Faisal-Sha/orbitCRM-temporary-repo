
import React from 'react';
import { TextEditor } from '@/components/texteditor/TextEditor';
import { generateShortcodes } from '@/utils/shortcodeGenerator';
import { CampaignData } from './Create';

interface EditorTabProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
  templates: any[];
  onSaveTemplate?: (templateData: any) => void;
}

const EditorTab: React.FC<EditorTabProps> = ({ 
  data, 
  onUpdate, 
  templates = [],
  onSaveTemplate 
}) => {
  // Generate shortcodes for email campaign context
  const availableShortcodes = generateShortcodes([], 'email_campaign');

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Email Content Editor</h3>
            <p className="text-sm text-muted-foreground">
              Create and edit your email campaign content with rich text formatting and personalization shortcodes.
            </p>
          </div>

          <TextEditor
            value={data.content || ''}
            onChange={(content) => onUpdate({ content })}
            availableShortcodes={availableShortcodes}
            templates={templates}
            onSaveTemplate={onSaveTemplate}
            templateType="email"
            context="email_campaign"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorTab;
