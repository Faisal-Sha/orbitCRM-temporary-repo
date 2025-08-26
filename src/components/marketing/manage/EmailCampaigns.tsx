
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Edit3, Eye, Play, Pause, Calendar, Copy, Trash2, Search, Filter, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  audienceGroups: string[];
  sendDateTime: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Paused' | 'Failed';
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
  recipientCount: number;
  tags: string[];
}

const dummyCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Welcome New Clients Q4 2024',
    audienceGroups: ['New Clients', 'Active Subscribers'],
    sendDateTime: '2024-12-15 10:00 AM',
    status: 'Sent',
    totalSent: 2450,
    totalOpened: 1200,
    totalClicked: 340,
    openRate: 49.0,
    clickRate: 13.9,
    recipientCount: 2450,
    tags: ['Welcome', 'Q4']
  },
  {
    id: '2',
    name: 'Holiday Promotion 2024',
    audienceGroups: ['All Subscribers', 'VIP Clients'],
    sendDateTime: '2024-12-20 09:00 AM',
    status: 'Scheduled',
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: 0,
    clickRate: 0,
    recipientCount: 3200,
    tags: ['Holiday', 'Promotion']
  },
  {
    id: '3',
    name: 'Monthly Newsletter - December',
    audienceGroups: ['Newsletter Subscribers'],
    sendDateTime: '2024-12-10 08:30 AM',
    status: 'Sent',
    totalSent: 1850,
    totalOpened: 980,
    totalClicked: 165,
    openRate: 53.0,
    clickRate: 8.9,
    recipientCount: 1850,
    tags: ['Newsletter', 'Monthly']
  },
  {
    id: '4',
    name: 'Service Update Notification',
    audienceGroups: ['Active Clients'],
    sendDateTime: '2024-12-08 02:00 PM',
    status: 'Failed',
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: 0,
    clickRate: 0,
    recipientCount: 890,
    tags: ['Update', 'Service']
  },
  {
    id: '5',
    name: 'Year-End Survey Request',
    audienceGroups: ['All Clients'],
    sendDateTime: '',
    status: 'Draft',
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: 0,
    clickRate: 0,
    recipientCount: 2100,
    tags: ['Survey', 'Year-End']
  }
];

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(dummyCampaigns);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('sendDateTime');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Sending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-orange-100 text-orange-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.audienceGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedCampaigns(checked ? filteredCampaigns.map(c => c.id) : []);
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    setSelectedCampaigns(prev =>
      checked ? [...prev, campaignId] : prev.filter(id => id !== campaignId)
    );
  };

  const handleCampaignAction = (action: string, campaignId: string) => {
    console.log(`Action: ${action} for campaign: ${campaignId}`);
    // Mock action implementations
    switch (action) {
      case 'edit':
        window.open('/marketing/email-campaigns', '_blank');
        break;
      case 'duplicate':
        const originalCampaign = campaigns.find(c => c.id === campaignId);
        if (originalCampaign) {
          const newCampaign = {
            ...originalCampaign,
            id: Date.now().toString(),
            name: `${originalCampaign.name} (Copy)`,
            status: 'Draft' as const,
            totalSent: 0,
            totalOpened: 0,
            totalClicked: 0,
            openRate: 0,
            clickRate: 0
          };
          setCampaigns(prev => [newCampaign, ...prev]);
        }
        break;
      case 'delete':
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        break;
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for campaigns: ${selectedCampaigns}`);
    if (action === 'delete') {
      setCampaigns(prev => prev.filter(c => !selectedCampaigns.includes(c.id)));
      setSelectedCampaigns([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Email Campaigns</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and monitor all your email marketing campaigns
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.open('/marketing/email-campaigns', '_blank')}>
                Create Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Sending">Sending</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sendDateTime">Send Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="openRate">Open Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedCampaigns.length} campaign(s) selected
              </span>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
                Archive
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCampaigns.length === filteredCampaigns.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Audience Groups</TableHead>
                <TableHead>Send Date/Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="flex gap-1 mt-1">
                        {campaign.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {campaign.audienceGroups.map((group, index) => (
                        <div key={index} className="text-muted-foreground">
                          {group}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.sendDateTime ? (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.sendDateTime}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{campaign.recipientCount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {campaign.totalSent > 0 ? campaign.totalSent.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.totalOpened > 0 ? campaign.totalOpened.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.totalClicked > 0 ? campaign.totalClicked.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.clickRate > 0 ? `${campaign.clickRate}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCampaignAction('edit', campaign.id)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCampaignAction('preview', campaign.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        {campaign.status === 'Draft' && (
                          <DropdownMenuItem onClick={() => handleCampaignAction('send', campaign.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Send Now
                          </DropdownMenuItem>
                        )}
                        {(campaign.status === 'Draft' || campaign.status === 'Scheduled') && (
                          <DropdownMenuItem onClick={() => handleCampaignAction('schedule', campaign.id)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'Sending' && (
                          <DropdownMenuItem onClick={() => handleCampaignAction('pause', campaign.id)}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCampaignAction('duplicate', campaign.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCampaignAction('delete', campaign.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCampaigns;
