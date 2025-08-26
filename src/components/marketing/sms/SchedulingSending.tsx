
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchedulingSendingProps {
  onSendAction: (action: 'now' | 'schedule') => void;
  onSaveDraft: () => void;
}

const SchedulingSending: React.FC<SchedulingSendingProps> = ({ 
  onSendAction, 
  onSaveDraft 
}) => {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const { toast } = useToast();

  const handleSaveDraft = () => {
    onSaveDraft();
    toast({
      title: "Draft Saved",
      description: "Your SMS campaign has been saved as a draft.",
    });
  };

  const handleSendNow = () => {
    onSendAction('now');
  };

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Schedule Details Required",
        description: "Please select both date and time for scheduling.",
        variant: "destructive"
      });
      return;
    }
    
    onSendAction('schedule');
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Set minimum time to current time if date is today
  const getCurrentTime = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    if (scheduleDate === currentDate) {
      return now.toTimeString().slice(0, 5);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          className="flex-1 sm:flex-none"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        
        <Button 
          onClick={handleSendNow}
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Now
        </Button>
      </div>

      {/* Schedule Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5" />
          <Label className="text-base font-semibold">Schedule for Later</Label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduleDate" className="text-sm font-medium mb-2 block">
              Date
            </Label>
            <Input
              id="scheduleDate"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={today}
            />
          </div>
          
          <div>
            <Label htmlFor="scheduleTime" className="text-sm font-medium mb-2 block">
              Time
            </Label>
            <Input
              id="scheduleTime"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              min={getCurrentTime()}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSchedule}
          className="w-full sm:w-auto"
          variant="outline"
        >
          <Clock className="w-4 h-4 mr-2" />
          Schedule Campaign
        </Button>
        
        {scheduleDate && scheduleTime && (
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
            <strong>Scheduled for:</strong> {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
          </div>
        )}
      </div>

      {/* Best Practices Tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">📱 SMS Best Practices:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Send SMS during business hours (9 AM - 6 PM) for best response</li>
          <li>• Avoid sending on weekends unless it's urgent</li>
          <li>• Tuesday - Thursday tend to have higher engagement rates</li>
          <li>• Consider your audience's time zone when scheduling</li>
          <li>• Test your messages before sending to large groups</li>
        </ul>
      </div>
    </div>
  );
};

export default SchedulingSending;
