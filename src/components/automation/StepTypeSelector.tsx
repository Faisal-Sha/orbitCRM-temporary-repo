
import React from 'react';
import { Plus, Mail, MessageSquare, Phone, Clock, GitBranch, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StepTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

export const StepTypeSelector: React.FC<StepTypeSelectorProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  const stepTypes = [
    {
      category: 'Communication',
      steps: [
        { type: 'email', label: 'Send Email', icon: Mail, description: 'Send personalized emails to contacts' },
        { type: 'sms', label: 'Send SMS', icon: MessageSquare, description: 'Send text messages to contacts' },
        { type: 'call', label: 'AI Voice Call', icon: Phone, description: 'Make automated AI-powered calls' },
      ]
    },
    {
      category: 'Actions',
      steps: [
        { type: 'action', label: 'Contact Action', icon: Users, description: 'Add/remove contacts from groups, update fields' },
      ]
    },
    {
      category: 'Logic & Timing',
      steps: [
        { type: 'delay', label: 'Wait/Delay', icon: Clock, description: 'Add time delays between steps' },
        { type: 'condition', label: 'If/Then Branch', icon: GitBranch, description: 'Create conditional paths based on contact data' },
      ]
    }
  ];

  const handleSelectType = (type: string) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Workflow Step
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6">
            {stepTypes.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-medium text-gray-900 mb-3">{category.category}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {category.steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <Card 
                        key={step.type}
                        className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-blue-300"
                        onClick={() => handleSelectType(step.type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <Icon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 mb-1">{step.label}</h4>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
