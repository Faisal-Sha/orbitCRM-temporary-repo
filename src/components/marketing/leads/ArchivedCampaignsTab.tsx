
import React, { useState, useRef, useCallback } from "react";
import { Search, FileText, Calendar, Settings, Target, MoreVertical, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DeleteConfirmationDialog from "@/components/settings/usersandroles/DeleteConfirmationDialog";
import UTMBuilderModal from "./UTMBuilderModal";
import { AUDIENCE_OPTIONS, TYPE_OPTIONS, AUDIENCE_COLORS, TYPE_COLORS } from "@/utils/campaignUtils";

interface Campaign {
  id: string;
  name: string;
  type: string;
  audience: string;
  dateCreated: string;
  totalLeads: number;
  interestPercent: number;
  hasForm: boolean;
  hasCalendar: boolean;
  hasAutomation: boolean;
  hasAdCampaign: boolean;
  hasUTM: boolean;
}

const ArchivedCampaignsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [utmModalOpen, setUtmModalOpen] = useState(false);
  const [selectedCampaignForUTM, setSelectedCampaignForUTM] = useState<Campaign | null>(null);
  const [utmData, setUtmData] = useState<Record<string, any>>({});

  const lastFocusedElementRef = useRef<HTMLButtonElement | null>(null);

  // Generate 7 dummy archived campaigns with longer names
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const dummyCampaigns: Campaign[] = [];
    const types = TYPE_OPTIONS;
    const audiences = AUDIENCE_OPTIONS;
    
    const longNames = [
      "Archived Campaign 1 - Comprehensive Holiday Marketing Strategy for Q4 Business Growth",
      "Archived Campaign 2 - Extended Product Launch Campaign with Multi-Channel Approach",
      "Archived Campaign 3 - Partnership Development Initiative for Strategic Business Expansion",
      "Archived Campaign 4 - Client Retention Program with Advanced Analytics and Personalization",
      "Archived Campaign 5 - Lead Generation Webinar Series for Professional Development",
      "Archived Campaign 6 - Social Media Marketing Campaign for Brand Awareness and Engagement",
      "Archived Campaign 7 - Email Marketing Automation Sequence for Customer Journey Optimization"
    ];
    
    for (let i = 1; i <= 7; i++) {
      dummyCampaigns.push({
        id: i.toString(),
        name: longNames[i - 1],
        type: types[Math.floor(Math.random() * types.length)],
        audience: audiences[Math.floor(Math.random() * audiences.length)],
        dateCreated: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        totalLeads: Math.floor(Math.random() * 300) + 20,
        interestPercent: Math.floor(Math.random() * 60) + 15,
        hasForm: Math.random() > 0.3,
        hasCalendar: Math.random() > 0.3,
        hasAutomation: Math.random() > 0.3,
        hasAdCampaign: Math.random() > 0.3,
        hasUTM: Math.random() > 0.5,
      });
    }

    return dummyCampaigns;
  });

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = useCallback((campaign: Campaign, buttonRef: HTMLButtonElement | null) => {
    lastFocusedElementRef.current = buttonRef;
    setSelectedCampaign(campaign);
    setOpenDropdownId(null);
    setDeleteDialogOpen(true);
  }, []);

  const handleRestore = useCallback((campaign: Campaign, buttonRef: HTMLButtonElement | null) => {
    lastFocusedElementRef.current = buttonRef;
    setSelectedCampaign(campaign);
    setOpenDropdownId(null);
    setRestoreDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    }
    setDeleteDialogOpen(false);
    setSelectedCampaign(null);
    
    // Return focus after a brief delay
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 100);
  }, [selectedCampaign]);

  const confirmRestore = useCallback(() => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    }
    setRestoreDialogOpen(false);
    setSelectedCampaign(null);
    
    // Return focus after a brief delay
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 100);
  }, [selectedCampaign]);

  const handleDialogClose = useCallback((dialogType: 'delete' | 'restore') => {
    if (dialogType === 'delete') {
      setDeleteDialogOpen(false);
    } else {
      setRestoreDialogOpen(false);
    }
    setSelectedCampaign(null);
    
    // Return focus after a brief delay
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 100);
  }, []);

  const handleUTMClick = useCallback((campaign: Campaign) => {
    setSelectedCampaignForUTM(campaign);
    setUtmModalOpen(true);
  }, []);

  const handleUTMSave = useCallback((campaignId: string, utmData: any) => {
    setUtmData(prev => ({ ...prev, [campaignId]: utmData }));
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, hasUTM: true }
          : campaign
      )
    );
  }, []);

  return (
    <TooltipProvider>
      <div className="app-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="app-heading-3">Archived Campaigns</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Campaign</TableHead>
                <TableHead className="w-28">Date Created</TableHead>
                <TableHead className="w-24">Audience</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead className="w-24">Total Leads</TableHead>
                <TableHead className="w-24">Interest %</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="w-44">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground truncate block max-w-[140px]">
                          {campaign.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border max-w-xs">
                        <p>{campaign.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{campaign.dateCreated}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${AUDIENCE_COLORS[campaign.audience]}`}>
                      {campaign.audience}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[campaign.type]}`}>
                      {campaign.type}
                    </span>
                  </TableCell>
                  <TableCell>{campaign.totalLeads}</TableCell>
                  <TableCell>{campaign.interestPercent}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUTMClick(campaign)}
                          >
                            <Link 
                              className={`h-4 w-4 ${campaign.hasUTM ? 'text-blue-400' : 'text-red-400'}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border">
                          <p>{campaign.hasUTM ? 'View UTM' : 'Create UTM'}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <FileText 
                              className={`h-4 w-4 ${campaign.hasForm ? 'text-blue-400' : 'text-red-400'}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border">
                          <p>{campaign.hasForm ? 'Edit form' : 'Restore campaign to create'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Calendar 
                              className={`h-4 w-4 ${campaign.hasCalendar ? 'text-blue-400' : 'text-red-400'}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border">
                          <p>{campaign.hasCalendar ? 'Review calendar' : 'Restore campaign to create'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Settings 
                              className={`h-4 w-4 ${campaign.hasAutomation ? 'text-blue-400' : 'text-red-400'}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border">
                          <p>{campaign.hasAutomation ? 'Review automation' : 'Restore campaign to create'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Target 
                              className={`h-4 w-4 ${campaign.hasAdCampaign ? 'text-blue-400' : 'text-red-400'}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border">
                          <p>{campaign.hasAdCampaign ? 'Review ad campaign' : 'Restore campaign to create'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu 
                        open={openDropdownId === campaign.id} 
                        onOpenChange={(open) => setOpenDropdownId(open ? campaign.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            ref={(ref) => {
                              if (openDropdownId === campaign.id) {
                                lastFocusedElementRef.current = ref;
                              }
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end"
                          className="bg-white border shadow-md z-50"
                        >
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(campaign, lastFocusedElementRef.current);
                            }}
                          >
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(campaign, lastFocusedElementRef.current);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No archived campaigns found.
          </div>
        )}

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={() => handleDialogClose('delete')}
          onConfirm={confirmDelete}
          title="Delete Campaign"
          description={`Are you sure you want to permanently delete "${selectedCampaign?.name}"? This action cannot be undone.`}
        />

        <DeleteConfirmationDialog
          open={restoreDialogOpen}
          onOpenChange={() => handleDialogClose('restore')}
          onConfirm={confirmRestore}
          title="Restore Campaign"
          description={`Are you sure you want to restore "${selectedCampaign?.name}"? It will be moved back to the Active tab.`}
        />

        <UTMBuilderModal
          open={utmModalOpen}
          onOpenChange={setUtmModalOpen}
          campaignId={selectedCampaignForUTM?.id || ''}
          campaignName={selectedCampaignForUTM?.name || ''}
          utmData={selectedCampaignForUTM ? utmData[selectedCampaignForUTM.id] : undefined}
          onSave={handleUTMSave}
        />
      </div>
    </TooltipProvider>
  );
};

export default ArchivedCampaignsTab;
