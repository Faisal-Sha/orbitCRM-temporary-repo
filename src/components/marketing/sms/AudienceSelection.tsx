
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { SMSCampaignData } from './Create';

interface AudienceSelectionProps {
  data: SMSCampaignData;
  onUpdate: (updates: Partial<SMSCampaignData>) => void;
}

const AudienceSelection: React.FC<AudienceSelectionProps> = ({ data, onUpdate }) => {
  const recipientGroups = [
    { id: 'active-customers', name: 'Active Customers', count: 312 },
    { id: 'leads', name: 'Leads', count: 189 },
    { id: 'sms-subscribers', name: 'SMS Subscribers', count: 567 },
    { id: 'loyalty-members', name: 'Loyalty Members', count: 234 },
    { id: 'vip-customers', name: 'VIP Customers', count: 89 },
    { id: 'recent-purchasers', name: 'Recent Purchasers', count: 145 }
  ];

  const excludeGroups = [
    { id: 'opt-out', name: 'Opted Out', count: 78 },
    { id: 'invalid-numbers', name: 'Invalid Numbers', count: 34 },
    { id: 'do-not-disturb', name: 'Do Not Disturb', count: 23 },
    { id: 'blocked-numbers', name: 'Blocked Numbers', count: 12 }
  ];

  const handleRecipientGroupChange = (groupId: string, checked: boolean) => {
    if (checked) {
      onUpdate({ recipientGroups: [...data.recipientGroups, groupId] });
    } else {
      onUpdate({ recipientGroups: data.recipientGroups.filter(id => id !== groupId) });
    }
  };

  const handleExcludeGroupChange = (groupId: string, checked: boolean) => {
    if (checked) {
      onUpdate({ excludeGroups: [...data.excludeGroups, groupId] });
    } else {
      onUpdate({ excludeGroups: data.excludeGroups.filter(id => id !== groupId) });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Recipient Groups</Label>
        <div className="space-y-3">
          {recipientGroups.map(group => (
            <div key={group.id} className="flex items-center space-x-3">
              <Checkbox
                id={group.id}
                checked={data.recipientGroups.includes(group.id)}
                onCheckedChange={(checked) => handleRecipientGroupChange(group.id, !!checked)}
              />
              <Label htmlFor={group.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>{group.name}</span>
                  <span className="text-sm text-muted-foreground">({group.count})</span>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Exclude Groups</Label>
        <div className="space-y-3">
          {excludeGroups.map(group => (
            <div key={group.id} className="flex items-center space-x-3">
              <Checkbox
                id={`exclude-${group.id}`}
                checked={data.excludeGroups.includes(group.id)}
                onCheckedChange={(checked) => handleExcludeGroupChange(group.id, !!checked)}
              />
              <Label htmlFor={`exclude-${group.id}`} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>{group.name}</span>
                  <span className="text-sm text-muted-foreground">({group.count})</span>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="individualContacts" className="text-base font-semibold mb-3 block">
          Individual Contacts
        </Label>
        <Textarea
          id="individualContacts"
          value={data.individualContacts}
          onChange={(e) => onUpdate({ individualContacts: e.target.value })}
          placeholder="Enter phone numbers, one per line:&#10;+1234567890&#10;+1987654321"
          className="min-h-[200px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Add individual phone numbers with country codes, one per line
        </p>
      </div>
    </div>
  );
};

export default AudienceSelection;
