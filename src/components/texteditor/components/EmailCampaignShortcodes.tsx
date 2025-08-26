
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getShortcodeCategories } from '@/utils/shortcodeGenerator';

interface EmailCampaignShortcodesProps {
  onInsertShortcode: (shortcode: string) => void;
}

export const EmailCampaignShortcodes: React.FC<EmailCampaignShortcodesProps> = ({ 
  onInsertShortcode 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Contact Information');
  const shortcodeCategories = getShortcodeCategories('email_campaign');

  const handleShortcodeClick = (shortcode: string) => {
    console.log('Shortcode clicked:', shortcode);
    
    // Use a small delay to ensure any focus events are processed
    setTimeout(() => {
      onInsertShortcode(shortcode);
    }, 50);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="shortcode-category">Shortcode Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(shortcodeCategories).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Available Shortcodes</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {shortcodeCategories[selectedCategory as keyof typeof shortcodeCategories]?.map(shortcode => (
                <div
                  key={shortcode}
                  className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm font-mono cursor-pointer hover:bg-blue-100 transition-colors"
                  onMouseDown={(e) => {
                    // Prevent the editor from losing focus
                    e.preventDefault();
                  }}
                  onClick={() => handleShortcodeClick(shortcode)}
                >
                  {shortcode}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click on any shortcode to add it to your email content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
