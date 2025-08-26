
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, RefreshCw, Copy } from 'lucide-react';

interface AIDraftGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export const AIDraftGenerator: React.FC<AIDraftGeneratorProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [emailType, setEmailType] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const toneOptions = ['professional', 'friendly', 'urgent', 'casual', 'formal', 'persuasive'];
  const emailTypeOptions = [
    'newsletter', 'promotion', 'announcement', 'welcome', 'follow-up', 
    'event invitation', 'product update', 'educational', 'seasonal'
  ];

  const contentTemplates = {
    newsletter: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Weekly Newsletter</h2>
      <p>Dear <span style="background-color: #e3f2fd; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbdefb;">{{Contact.FirstName}}</span>,</p>
      <p>We hope this message finds you well! Here's what's new this week:</p>
      
      <h3 style="color: #007bff; margin-top: 25px;">🎯 Featured Updates</h3>
      <ul style="line-height: 1.8;">
        <li><strong>[Key update or announcement]</strong></li>
        <li><strong>[Important news or development]</strong></li>
        <li><strong>[Upcoming event or opportunity]</strong></li>
      </ul>

      <h3 style="color: #007bff; margin-top: 25px;">📈 Industry Insights</h3>
      <p>Stay ahead with these trending topics in your field...</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
        <h4 style="margin-top: 0; color: #333;">💡 Quick Tip</h4>
        <p style="margin-bottom: 0;">[Helpful advice or best practice]</p>
      </div>

      <p>We value your continued partnership and look forward to serving you better.</p>

      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0;"><strong>Best regards,<br>The Team</strong></p>
      </div>
    </div>`,

    promotion: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Special Offer Inside!</h1>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Dear <span style="background-color: #e3f2fd; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbdefb;">{{Contact.FirstName}}</span>,</p>
        
        <p>We're excited to offer you an exclusive opportunity that's too good to miss!</p>

        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #333; margin-top: 0;">✨ What You Get:</h3>
          <ul style="line-height: 1.8;">
            <li><strong>[Benefit 1]</strong></li>
            <li><strong>[Benefit 2]</strong></li>
            <li><strong>[Benefit 3]</strong></li>
          </ul>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #856404; margin-top: 0;">⏰ Limited Time Only</h4>
          <p style="color: #856404; margin-bottom: 0;">This special pricing is available until [Date]. Don't wait!</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">[Call-to-Action Button]</a>
        </div>

        <p>Questions? Our team is here to help at [Contact Information].</p>

        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0;"><strong>Best regards,<br>The Team</strong></p>
        </div>
      </div>
    </div>`,

    announcement: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="border-top: 4px solid #17a2b8; padding: 30px; background-color: #ffffff;">
        <h2 style="color: #17a2b8; margin-top: 0;">📢 Important Announcement</h2>
        
        <p>Dear <span style="background-color: #e3f2fd; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbdefb;">{{Contact.FirstName}}</span>,</p>
        
        <p>We're thrilled to share some exciting news with you!</p>

        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #0c5460; margin-top: 0;">🚀 What's New:</h3>
          <p style="color: #0c5460; margin-bottom: 0;">[Main announcement details]</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h4 style="color: #333; margin-top: 0;">📅 Timeline:</h4>
            <p style="margin-bottom: 0;">[When changes take effect]</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h4 style="color: #333; margin-top: 0;">💬 What This Means for You:</h4>
            <p style="margin-bottom: 0;">[Impact and benefits]</p>
          </div>
        </div>

        <p>We're committed to providing you with the best possible experience.</p>
        
        <div style="border-left: 4px solid #17a2b8; padding-left: 20px; margin: 25px 0;">
          <p style="margin: 0; font-style: italic; color: #555;">Thank you for being part of our community!</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0;"><strong>Best regards,<br>The Team</strong></p>
        </div>
      </div>
    </div>`
  };

  const handleGenerate = () => {
    let baseTemplate = contentTemplates[emailType as keyof typeof contentTemplates] || contentTemplates.newsletter;
    
    // Apply tone modifications
    if (tone === 'urgent') {
      baseTemplate = baseTemplate.replace('Dear {{Contact.FirstName}},', '⚡ URGENT: Dear {{Contact.FirstName}},');
    } else if (tone === 'friendly') {
      baseTemplate = baseTemplate.replace('Dear {{Contact.FirstName}},', 'Hi {{Contact.FirstName}}! 😊');
    } else if (tone === 'formal') {
      baseTemplate = baseTemplate.replace('We hope this message finds you well!', 'We trust this correspondence finds you in good health.');
    }

    // Incorporate keywords if provided
    if (keywords) {
      baseTemplate = baseTemplate.replace('[Key update or announcement]', `Updates about ${keywords}`);
      baseTemplate = baseTemplate.replace('[Main announcement details]', `Important information regarding ${keywords}`);
    }

    // Add additional instructions context
    if (additionalInstructions) {
      const psSection = `<div style="margin-top: 25px; padding: 15px; background-color: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
        <p style="margin: 0;"><strong>P.S.</strong> ${additionalInstructions}</p>
      </div>`;
      baseTemplate = baseTemplate.replace('</div>', psSection + '</div>');
    }

    // Add footer
    const footer = `<hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
    <div style="text-align: center; font-size: 12px; color: #6c757d;">
      <p><span style="background-color: #e3f2fd; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbdefb;">{{Company.Name}}</span></p>
      <p>[Company Physical Address]</p>
      <p><span style="background-color: #e3f2fd; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbdefb;">{{Unsubscribe.Link}}</span></p>
    </div>`;
    
    baseTemplate = baseTemplate + footer;
    setGeneratedContent(baseTemplate);
  };

  const handleRegenerate = () => {
    const variations = [
      'We wanted to reach out with some exciting updates...',
      'Hope you\'re having a great day! We have some news to share...',
      'Thank you for being a valued member of our community...',
    ];
    
    let newContent = generatedContent;
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    newContent = newContent.replace(/Dear.*?,/g, randomVariation);
    
    setGeneratedContent(newContent);
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      onClose();
      // Reset form
      setKeywords('');
      setTone('');
      setEmailType('');
      setAdditionalInstructions('');
      setGeneratedContent('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            AI Content Draft Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email Type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  {emailTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Keywords/Topics</Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords or main topics (e.g., product launch, holiday sale)"
            />
          </div>

          <div>
            <Label>Additional Instructions</Label>
            <Textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Any specific instructions or requirements for the content..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerate} 
              className="flex-1"
              disabled={!emailType || !tone}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Generate Content
            </Button>
            <Button 
              onClick={handleRegenerate} 
              variant="outline"
              disabled={!generatedContent}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>

          {generatedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated Content Preview:</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy HTML
                </Button>
              </div>
              <div className="border rounded-md max-h-80 overflow-y-auto">
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleInsert} 
              className="flex-1"
              disabled={!generatedContent}
            >
              Insert Content
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
