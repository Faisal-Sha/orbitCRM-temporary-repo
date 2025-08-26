
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Plus, X } from 'lucide-react';
import { AUDIENCE_OPTIONS, TYPE_OPTIONS, generateDummyCampaigns } from '@/utils/campaignUtils';

interface LeadCampaignSelectorProps {
  onSelectionChange?: (data: any) => void;
}

export const LeadCampaignSelector: React.FC<LeadCampaignSelectorProps> = ({ onSelectionChange }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [availableCampaigns, setAvailableCampaigns] = useState<Array<{id: string, name: string, audience: string, type: string}>>([]);

  useEffect(() => {
    const campaigns = generateDummyCampaigns(selectedAudiences, selectedTypes);
    setAvailableCampaigns(campaigns);
    
    // Filter out campaigns that are no longer available
    setSelectedCampaigns(prev => prev.filter(id => campaigns.some(c => c.id === id)));
  }, [selectedAudiences, selectedTypes]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        audiences: selectedAudiences,
        types: selectedTypes,
        campaigns: selectedCampaigns
      });
    }
  }, [selectedAudiences, selectedTypes, selectedCampaigns, onSelectionChange]);

  const toggleAudience = (audience: string) => {
    setSelectedAudiences(prev => 
      prev.includes(audience) 
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(c => c !== campaignId)
        : [...prev, campaignId]
    );
  };

  if (!showSelector) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowSelector(true)}
          className="justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Assign Lead Campaign
        </Button>
      </div>
    );
  }

  const showCampaignSelection = selectedAudiences.length > 0 || selectedTypes.length > 0;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Lead Campaign Assignment</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowSelector(false);
            setSelectedAudiences([]);
            setSelectedTypes([]);
            setSelectedCampaigns([]);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Audience Selection */}
        <div className="space-y-2">
          <Label>Audience</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedAudiences.length > 0 ? `${selectedAudiences.length} selected` : 'Select Audience'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white border shadow-md z-50">
              {AUDIENCE_OPTIONS.map((audience) => (
                <DropdownMenuItem
                  key={audience}
                  onClick={() => toggleAudience(audience)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAudiences.includes(audience)}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    {audience}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedAudiences.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedAudiences.map(audience => (
                <Badge key={audience} variant="secondary" className="text-xs">
                  {audience}
                  <button
                    onClick={() => toggleAudience(audience)}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Type Selection */}
        <div className="space-y-2">
          <Label>Type</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedTypes.length > 0 ? `${selectedTypes.length} selected` : 'Select Type'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white border shadow-md z-50">
              {TYPE_OPTIONS.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => toggleType(type)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    {type}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <button
                    onClick={() => toggleType(type)}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Selection */}
      {showCampaignSelection && (
        <div className="space-y-2">
          <Label>Campaigns</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedCampaigns.length > 0 ? `${selectedCampaigns.length} campaigns selected` : 'Select Campaigns'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white border shadow-md z-50">
              {availableCampaigns.map((campaign) => (
                <DropdownMenuItem
                  key={campaign.id}
                  onClick={() => toggleCampaign(campaign.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-xs text-gray-500">{campaign.audience} • {campaign.type}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedCampaigns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedCampaigns.map(campaignId => {
                const campaign = availableCampaigns.find(c => c.id === campaignId);
                return campaign ? (
                  <Badge key={campaignId} variant="secondary" className="text-xs">
                    {campaign.name}
                    <button
                      onClick={() => toggleCampaign(campaignId)}
                      className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
