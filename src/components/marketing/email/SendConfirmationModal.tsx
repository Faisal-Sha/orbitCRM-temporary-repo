
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Clock, Users, Mail } from "lucide-react";
import { CampaignData } from './Create';
import { useToast } from "@/hooks/use-toast";

interface SendConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignData: CampaignData;
  sendAction: 'now' | 'schedule';
  recipientCount: number;
}

const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
  open,
  onOpenChange,
  campaignData,
  sendAction,
  recipientCount
}) => {
  const { toast } = useToast();

  const handleConfirmSend = () => {
    const action = sendAction === 'now' ? 'sent' : 'scheduled';
    
    toast({
      title: `Campaign Successfully ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
      description: `Your email campaign "${campaignData.name}" has been ${action} to ${recipientCount} recipients.`,
    });
    
    console.log(`Campaign ${action}:`, {
      name: campaignData.name,
      recipients: recipientCount,
      action: sendAction
    });
    
    onOpenChange(false);
  };

  const getSendTimeText = () => {
    if (sendAction === 'now') {
      return 'Immediately';
    }
    // In a real app, this would show the actual scheduled time
    return 'As scheduled';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {sendAction === 'now' ? (
              <Send className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-blue-600" />
            )}
            Confirm {sendAction === 'now' ? 'Send' : 'Schedule'} Campaign
          </DialogTitle>
          <DialogDescription>
            Please review the campaign details before {sendAction === 'now' ? 'sending' : 'scheduling'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Overview */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-600">Campaign Name</div>
              <div className="font-semibold">{campaignData.name || 'Untitled Campaign'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-600">Subject Line</div>
              <div>{campaignData.subjectLine || 'No subject'}</div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">From</span>
              </div>
              <div className="text-sm">
                {campaignData.fromName || 'Unknown'} &lt;{campaignData.fromEmail}&gt;
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Recipients</span>
              </div>
              <Badge variant="secondary">{recipientCount.toLocaleString()}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Send Time</span>
              </div>
              <div className="text-sm">{getSendTimeText()}</div>
            </div>
          </div>

          {/* Selected Groups */}
          {campaignData.recipientGroups.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">Recipient Groups</div>
              <div className="flex flex-wrap gap-1">
                {campaignData.recipientGroups.map(groupId => (
                  <Badge key={groupId} variant="outline" className="text-xs">
                    {groupId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> Once {sendAction === 'now' ? 'sent' : 'scheduled'}, 
              this campaign cannot be stopped or modified. Please ensure all details are correct.
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSend}
            className={sendAction === 'now' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {sendAction === 'now' ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Confirm Send
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Confirm Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendConfirmationModal;
