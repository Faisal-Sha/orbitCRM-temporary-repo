
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CampaignData } from './Create';

interface AudienceSelectionProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const AudienceSelection: React.FC<AudienceSelectionProps> = ({ data, onUpdate }) => {
  const recipientGroups = [
    { id: 'active-clients', name: 'Active Clients', count: 245 },
    { id: 'leads', name: 'Leads', count: 189 },
    { id: 'newsletter-subscribers', name: 'Newsletter Subscribers', count: 432 },
    { id: 'trial-users', name: 'Trial Users', count: 76 },
    { id: 'premium-customers', name: 'Premium Customers', count: 158 },
    { id: 'past-clients', name: 'Past Clients', count: 203 }
  ];

  const excludeGroups = [
    { id: 'unsubscribed', name: 'Unsubscribed', count: 45 },
    { id: 'bounce-list', name: 'Bounce List', count: 23 },
    { id: 'do-not-email', name: 'Do Not Email', count: 12 },
    { id: 'competitors', name: 'Competitors', count: 8 }
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
          placeholder="Enter email addresses, one per line:&#10;john@example.com&#10;jane@example.com"
          className="min-h-[200px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Add individual email addresses, one per line
        </p>
      </div>
    </div>
  );
};

export default AudienceSelection;
