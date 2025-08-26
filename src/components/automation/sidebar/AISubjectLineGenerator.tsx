
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wand2, RefreshCw } from 'lucide-react';

interface AISubjectLineGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (subjectLine: string) => void;
}

export const AISubjectLineGenerator: React.FC<AISubjectLineGeneratorProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [tone, setTone] = useState('');
  const [emailType, setEmailType] = useState('');
  const [customText, setCustomText] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState('');

  const toneOptions = ['natural', 'formal', 'catchy', 'friendly', 'persuasive', 'urgent'];
  const emailTypeOptions = [
    'promotion', 'announcement', 'newsletter', 'event invitation', 
    'feedback or survey', 're-engagement'
  ];

  const handleGenerate = () => {
    // Simulate AI generation with dummy data
    const subjects =  [
      `${tone === 'urgent' ? '⚡ ' : ''}Your ${emailType} is waiting${tone === 'friendly' ? ' 😊' : ''}`,
      `${tone === 'catchy' ? '🎯 ' : ''}Don't miss out on ${customText || 'this opportunity'}`,
      `${tone === 'formal' ? 'Important:' : ''} ${emailType} update ${customText ? `- ${customText}` : ''}`,
      `${tone === 'persuasive' ? 'Last chance:' : ''} ${customText || emailType}${tone === 'friendly' ? ' 🌟' : ''}`,
      `${tone === 'natural' ? 'Hi there!' : ''} ${emailType} ${customText ? `about ${customText}` : 'inside'}`
    ];
    
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    setGeneratedSubject(randomSubject);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleInsert = () => {
    if (generatedSubject) {
      onInsert(generatedSubject);
      onClose();
      // Reset form
      setTone('');
      setEmailType('');
      setCustomText('');
      setGeneratedSubject('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            AI Subject Line Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
            <Label>Custom Text/Keywords</Label>
            <Input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter keywords or custom text"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerate} 
              className="flex-1"
              disabled={!tone || !emailType}
            >
              <Wand2 className="h-4 w-4 mr-1" />
              Generate
            </Button>
            <Button 
              onClick={handleRegenerate} 
              variant="outline"
              disabled={!generatedSubject}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>

          {generatedSubject && (
            <div className="p-3 bg-gray-50 rounded-md">
              <Label className="text-sm font-medium">Generated Subject Line:</Label>
              <p className="mt-1 text-sm">{generatedSubject}</p>
            </div>
          )}

          <Button 
            onClick={handleInsert} 
            className="w-full"
            disabled={!generatedSubject}
          >
            Insert Subject Line
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
