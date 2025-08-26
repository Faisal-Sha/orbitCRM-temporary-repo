
import React, { useState, useRef, useCallback } from "react";
import { Search, Edit2, FileText, Calendar, Settings, Target, MoreVertical, Mail, MessageSquare, Phone, Link, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

const ActiveCampaignsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [utmModalOpen, setUtmModalOpen] = useState(false);
  const [selectedCampaignForUTM, setSelectedCampaignForUTM] = useState<Campaign | null>(null);
  const [utmData, setUtmData] = useState<Record<string, any>>({});

  const lastFocusedElementRef = useRef<HTMLButtonElement | null>(null);
  const campaignsPerPage = 20;

  // Generate campaigns with longer names and audience data
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const dummyCampaigns: Campaign[] = [];
    
    // First two campaigns (new ones) with longer names
    dummyCampaigns.push(
      {
        id: "1",
        name: "Summer Sale Campaign for Premium Products and Services",
        type: "Paid Ads",
        audience: "Leads",
        dateCreated: "2024-01-15",
        totalLeads: 0,
        interestPercent: 0,
        hasForm: false,
        hasCalendar: false,
        hasAutomation: false,
        hasAdCampaign: false,
        hasUTM: false,
      },
      {
        id: "2",
        name: "Product Launch Campaign with Extended Marketing Push",
        type: "Organic",
        audience: "Clients",
        dateCreated: "2024-01-14",
        totalLeads: 0,
        interestPercent: 0,
        hasForm: false,
        hasCalendar: false,
        hasAutomation: false,
        hasAdCampaign: false,
        hasUTM: false,
      }
    );

    // Remaining 22 campaigns with varied data
    for (let i = 3; i <= 24; i++) {
      const audiences = AUDIENCE_OPTIONS;
      const types = TYPE_OPTIONS;
      dummyCampaigns.push({
        id: i.toString(),
        name: `Campaign ${i} - ${i % 3 === 0 ? 'Extended Marketing Strategy for Business Growth' : `Marketing Initiative ${i}`}`,
        type: types[Math.floor(Math.random() * types.length)],
        audience: audiences[Math.floor(Math.random() * audiences.length)],
        dateCreated: `2024-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
        totalLeads: Math.floor(Math.random() * 500) + 50,
        interestPercent: Math.floor(Math.random() * 80) + 10,
        hasForm: Math.random() > 0.4,
        hasCalendar: Math.random() > 0.4,
        hasAutomation: Math.random() > 0.4,
        hasAdCampaign: Math.random() > 0.4,
        hasUTM: Math.random() > 0.6,
      });
    }

    return dummyCampaigns;
  });

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);
  const startIndex = (currentPage - 1) * campaignsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + campaignsPerPage);

  const handleEditStart = useCallback((campaign: Campaign) => {
    setEditingCampaign(campaign.id);
    setEditValue(campaign.name);
  }, []);

  const handleEditSave = useCallback((campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, name: editValue }
          : campaign
      )
    );
    setEditingCampaign(null);
    setEditValue("");
  }, [editValue]);

  const handleEditCancel = useCallback(() => {
    setEditingCampaign(null);
    setEditValue("");
  }, []);

  const handleTypeChange = useCallback((campaignId: string, newType: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, type: newType }
          : campaign
      )
    );
  }, []);

  const handleAudienceChange = useCallback((campaignId: string, newAudience: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, audience: newAudience }
          : campaign
      )
    );
  }, []);

  const handleDelete = useCallback((campaign: Campaign, buttonRef: HTMLButtonElement | null) => {
    lastFocusedElementRef.current = buttonRef;
    setSelectedCampaign(campaign);
    setOpenDropdownId(null);
    setDeleteDialogOpen(true);
  }, []);

  const handleArchive = useCallback((campaign: Campaign, buttonRef: HTMLButtonElement | null) => {
    lastFocusedElementRef.current = buttonRef;
    setSelectedCampaign(campaign);
    setOpenDropdownId(null);
    setArchiveDialogOpen(true);
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

  const confirmArchive = useCallback(() => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    }
    setArchiveDialogOpen(false);
    setSelectedCampaign(null);
    
    // Return focus after a brief delay
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 100);
  }, [selectedCampaign]);

  const handleDialogClose = useCallback((dialogType: 'delete' | 'archive') => {
    if (dialogType === 'delete') {
      setDeleteDialogOpen(false);
    } else {
      setArchiveDialogOpen(false);
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

  const addNewCampaign = useCallback(() => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: "New Campaign - Click to Edit",
      type: "Paid Ads",
      audience: "Leads",
      dateCreated: new Date().toISOString().split('T')[0],
      totalLeads: 0,
      interestPercent: 0,
      hasForm: false,
      hasCalendar: false,
      hasAutomation: false,
      hasAdCampaign: false,
      hasUTM: false,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  }, []);

  return (
    <TooltipProvider>
      <div className="app-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="app-heading-3">Active Campaigns</h3>
            <Button
              onClick={addNewCampaign}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
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
              {paginatedCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="w-44">
                    <div className="flex items-center gap-2">
                      {editingCampaign === campaign.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleEditSave(campaign.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(campaign.id);
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          className="h-8"
                          autoFocus
                        />
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span 
                                className="cursor-pointer hover:text-primary truncate block max-w-[140px]"
                                onClick={() => handleEditStart(campaign)}
                              >
                                {campaign.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black border max-w-xs">
                              <p>{campaign.name}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Edit2 
                            className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer flex-shrink-0"
                            onClick={() => handleEditStart(campaign)}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{campaign.dateCreated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium cursor-pointer ${AUDIENCE_COLORS[campaign.audience]}`}>
                          {campaign.audience}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white border shadow-md z-50">
                        {AUDIENCE_OPTIONS.map((audience) => (
                          <DropdownMenuItem
                            key={audience}
                            onClick={() => handleAudienceChange(campaign.id, audience)}
                            className={`cursor-pointer ${AUDIENCE_COLORS[audience]} ${audience === campaign.audience ? "font-bold" : ""}`}
                          >
                            {audience}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium cursor-pointer ${TYPE_COLORS[campaign.type]}`}>
                          {campaign.type}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white border shadow-md z-50">
                        {TYPE_OPTIONS.map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => handleTypeChange(campaign.id, type)}
                            className={`cursor-pointer ${TYPE_COLORS[type]} ${type === campaign.type ? "font-bold" : ""}`}
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                          <p>{campaign.hasForm ? 'Review form' : 'Create form'}</p>
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
                          <p>{campaign.hasCalendar ? 'Review calendar' : 'Create calendar'}</p>
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
                          <p>{campaign.hasAutomation ? 'Review automation' : 'Create automation'}</p>
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
                          <p>{campaign.hasAdCampaign ? 'Review ad campaign' : 'Create ad campaign'}</p>
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
                              console.log('Create Email for campaign:', campaign.name);
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Create Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Create SMS for campaign:', campaign.name);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Create SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Create AI Voice for campaign:', campaign.name);
                            }}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Create AI Voice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(campaign, lastFocusedElementRef.current);
                            }}
                          >
                            Archive
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={() => handleDialogClose('delete')}
          onConfirm={confirmDelete}
          title="Delete Campaign"
          description={`Are you sure you want to delete "${selectedCampaign?.name}"? This action cannot be undone.`}
        />

        <DeleteConfirmationDialog
          open={archiveDialogOpen}
          onOpenChange={() => handleDialogClose('archive')}
          onConfirm={confirmArchive}
          title="Archive Campaign"
          description={`Are you sure you want to archive "${selectedCampaign?.name}"? You can restore it later from the Archived tab.`}
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

export default ActiveCampaignsTab;
