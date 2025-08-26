
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
  totalDelivered: number;
  totalClicked: number;
  deliveredRate: number;
  clickRate: number;
  recipientCount: number;
  tags: string[];
}

const dummyCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Holiday SMS Promotion 2024',
    audienceGroups: ['VIP Customers', 'Active Subscribers'],
    sendDateTime: '2024-12-20 10:00 AM',
    status: 'Sent',
    totalSent: 1250,
    totalDelivered: 1200,
    totalClicked: 180,
    deliveredRate: 96.0,
    clickRate: 14.4,
    recipientCount: 1250,
    tags: ['Holiday', 'Promotion']
  },
  {
    id: '2',
    name: 'Flash Sale Alert',
    audienceGroups: ['All Subscribers'],
    sendDateTime: '2024-12-22 02:00 PM',
    status: 'Scheduled',
    totalSent: 0,
    totalDelivered: 0,
    totalClicked: 0,
    deliveredRate: 0,
    clickRate: 0,
    recipientCount: 2100,
    tags: ['Flash Sale', 'Alert']
  },
  {
    id: '3',
    name: 'Appointment Reminder',
    audienceGroups: ['Scheduled Clients'],
    sendDateTime: '2024-12-15 09:00 AM',
    status: 'Sent',
    totalSent: 450,
    totalDelivered: 440,
    totalClicked: 35,
    deliveredRate: 97.8,
    clickRate: 7.8,
    recipientCount: 450,
    tags: ['Reminder', 'Appointment']
  },
  {
    id: '4',
    name: 'Welcome New Customers',
    audienceGroups: ['New Customers'],
    sendDateTime: '2024-12-10 11:30 AM',
    status: 'Failed',
    totalSent: 0,
    totalDelivered: 0,
    totalClicked: 0,
    deliveredRate: 0,
    clickRate: 0,
    recipientCount: 320,
    tags: ['Welcome', 'New Customer']
  },
  {
    id: '5',
    name: 'Service Update Notification',
    audienceGroups: ['All Active Users'],
    sendDateTime: '',
    status: 'Draft',
    totalSent: 0,
    totalDelivered: 0,
    totalClicked: 0,
    deliveredRate: 0,
    clickRate: 0,
    recipientCount: 1850,
    tags: ['Update', 'Service']
  }
];

const SMSCampaigns = () => {
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
    console.log(`Action: ${action} for SMS campaign: ${campaignId}`);
    // Mock action implementations
    switch (action) {
      case 'edit':
        window.open('/marketing/sms-campaigns', '_blank');
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
            totalDelivered: 0,
            totalClicked: 0,
            deliveredRate: 0,
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
    console.log(`Bulk action: ${action} for SMS campaigns: ${selectedCampaigns}`);
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
              <CardTitle>SMS Campaigns</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and monitor all your SMS marketing campaigns
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.open('/marketing/sms-campaigns', '_blank')}>
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
                placeholder="Search SMS campaigns..."
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
                <SelectItem value="deliveredRate">Delivered Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedCampaigns.length} SMS campaign(s) selected
              </span>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
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
                <TableHead>Delivered</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Delivered Rate</TableHead>
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
                    {campaign.totalDelivered > 0 ? campaign.totalDelivered.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.totalClicked > 0 ? campaign.totalClicked.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.deliveredRate > 0 ? `${campaign.deliveredRate}%` : '-'}
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

export default SMSCampaigns;
