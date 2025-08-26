
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Eye, 
  MousePointer, 
  UserMinus, 
  AlertTriangle,
  Smartphone,
  Monitor,
  Tablet,
  MessageSquare,
  Search,
  Filter,
  ExternalLink,
  Users
} from "lucide-react";

interface AnalyticsData {
  campaignId: string;
  campaignName: string;
  totalSent: number;
  delivered: number;
  deliveredRate: number;
  opened: number;
  openRate: number;
  uniqueOpens: number;
  clicked: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribed: number;
  unsubscribeRate: number;
  bounced: number;
  bounceRate: number;
  spamComplaints: number;
  spamRate: number;
  sendDate: string;
  status: string;
}

const dummyAnalytics: AnalyticsData[] = [
  {
    campaignId: '1',
    campaignName: 'Welcome New Clients Q4 2024',
    totalSent: 2450,
    delivered: 2380,
    deliveredRate: 97.1,
    opened: 1200,
    openRate: 50.4,
    uniqueOpens: 1150,
    clicked: 340,
    clickRate: 14.3,
    clickToOpenRate: 29.6,
    unsubscribed: 12,
    unsubscribeRate: 0.5,
    bounced: 70,
    bounceRate: 2.9,
    spamComplaints: 3,
    spamRate: 0.1,
    sendDate: '2024-12-15',
    status: 'Sent'
  },
  {
    campaignId: '3',
    campaignName: 'Monthly Newsletter - December',
    totalSent: 1850,
    delivered: 1820,
    deliveredRate: 98.4,
    opened: 980,
    openRate: 53.8,
    uniqueOpens: 940,
    clicked: 165,
    clickRate: 9.1,
    clickToOpenRate: 17.6,
    unsubscribed: 8,
    unsubscribeRate: 0.4,
    bounced: 30,
    bounceRate: 1.6,
    spamComplaints: 2,
    spamRate: 0.1,
    sendDate: '2024-12-10',
    status: 'Sent'
  }
];

const deviceData = [
  { device: 'Mobile', opens: 1200, clicks: 320, percentage: 65 },
  { device: 'Desktop', opens: 680, clicks: 150, percentage: 28 },
  { device: 'Tablet', opens: 140, clicks: 35, percentage: 7 }
];

const clientData = [
  { client: 'Gmail', opens: 850, clicks: 220, percentage: 42 },
  { client: 'Outlook', opens: 520, clicks: 125, percentage: 26 },
  { client: 'Apple Mail', opens: 380, clicks: 95, percentage: 19 },
  { client: 'Yahoo', opens: 180, clicks: 40, percentage: 9 },
  { client: 'Other', opens: 90, clicks: 25, percentage: 4 }
];

const linkPerformanceData = [
  { link: 'https://example.com/learn-more', totalClicks: 185, uniqueClicks: 165, description: 'Learn More Button' },
  { link: 'https://example.com/book-appointment', totalClicks: 98, uniqueClicks: 87, description: 'Book Appointment' },
  { link: 'https://example.com/contact', totalClicks: 62, uniqueClicks: 58, description: 'Contact Us' },
  { link: 'https://example.com/unsubscribe', totalClicks: 20, uniqueClicks: 20, description: 'Unsubscribe' }
];

const engagementTimelineData = [
  { time: '0-1h', opens: 450, clicks: 125 },
  { time: '1-6h', opens: 380, clicks: 95 },
  { time: '6-12h', opens: 250, clicks: 65 },
  { time: '12-24h', opens: 180, clicks: 42 },
  { time: '1-3d', opens: 120, clicks: 28 },
  { time: '3-7d', opens: 85, clicks: 15 },
  { time: '7d+', opens: 45, clicks: 8 }
];

const EmailCampaignsTab = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Calculate aggregated metrics
  const totalMetrics = dummyAnalytics.reduce((acc, campaign) => ({
    totalSent: acc.totalSent + campaign.totalSent,
    delivered: acc.delivered + campaign.delivered,
    opened: acc.opened + campaign.opened,
    clicked: acc.clicked + campaign.clicked,
    unsubscribed: acc.unsubscribed + campaign.unsubscribed,
    bounced: acc.bounced + campaign.bounced,
    spamComplaints: acc.spamComplaints + campaign.spamComplaints
  }), {
    totalSent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    bounced: 0,
    spamComplaints: 0
  });

  const aggregatedRates = {
    deliveredRate: (totalMetrics.delivered / totalMetrics.totalSent) * 100,
    openRate: (totalMetrics.opened / totalMetrics.delivered) * 100,
    clickRate: (totalMetrics.clicked / totalMetrics.delivered) * 100,
    clickToOpenRate: (totalMetrics.clicked / totalMetrics.opened) * 100,
    unsubscribeRate: (totalMetrics.unsubscribed / totalMetrics.delivered) * 100,
    bounceRate: (totalMetrics.bounced / totalMetrics.totalSent) * 100,
    spamRate: (totalMetrics.spamComplaints / totalMetrics.delivered) * 100
  };

  const handleContactClick = (action: string) => {
    console.log(`Opening contact profile for ${action} action`);
    // This would open the UserProfilePanel component
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Chat and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Email Campaign Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive performance insights and AI-powered analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {dummyAnalytics.map(campaign => (
                  <SelectItem key={campaign.campaignId} value={campaign.campaignId}>
                    {campaign.campaignName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {aggregatedRates.deliveredRate.toFixed(1)}% delivered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedRates.openRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalMetrics.opened.toLocaleString()} unique opens
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedRates.clickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {aggregatedRates.clickToOpenRate.toFixed(1)}% click-to-open rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedRates.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalMetrics.bounced} bounced emails
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="links">Link Performance</TabsTrigger>
          <TabsTrigger value="devices">Devices & Clients</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={dummyAnalytics.map(campaign => ({
                    name: campaign.campaignName.split(' ')[0],
                    openRate: campaign.openRate,
                    clickRate: campaign.clickRate,
                    deliveredRate: campaign.deliveredRate
                  }))}
                  series={[
                    { dataKey: 'openRate', name: 'Open Rate', color: '#3b82f6' },
                    { dataKey: 'clickRate', name: 'Click Rate', color: '#10b981' },
                    { dataKey: 'deliveredRate', name: 'Delivered Rate', color: '#f59e0b' }
                  ]}
                  xAxisDataKey="name"
                  height={300}
                  chartTitle="Performance Metrics by Campaign"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best vs Worst Performing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Best Performing</h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium">Monthly Newsletter - December</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Open: 53.8%</span>
                        <span>Click: 9.1%</span>
                        <span>Delivered: 98.4%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Needs Improvement</h4>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="font-medium">Welcome New Clients Q4 2024</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Open: 50.4%</span>
                        <span>Click: 14.3%</span>
                        <span>Delivered: 97.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipient Activity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => handleContactClick('opened')}
                >
                  <Eye className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="font-bold">{totalMetrics.opened}</span>
                  <span className="text-xs text-muted-foreground">Opened</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => handleContactClick('clicked')}
                >
                  <MousePointer className="h-6 w-6 mb-2 text-green-600" />
                  <span className="font-bold">{totalMetrics.clicked}</span>
                  <span className="text-xs text-muted-foreground">Clicked</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => handleContactClick('bounced')}
                >
                  <AlertTriangle className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="font-bold">{totalMetrics.bounced}</span>
                  <span className="text-xs text-muted-foreground">Bounced</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => handleContactClick('unsubscribed')}
                >
                  <UserMinus className="h-6 w-6 mb-2 text-red-600" />
                  <span className="font-bold">{totalMetrics.unsubscribed}</span>
                  <span className="text-xs text-muted-foreground">Unsubscribed</span>
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add Recipients to Groups</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">VIP Clients</Badge>
                  <Badge variant="outline">Newsletter Subscribers</Badge>
                  <Badge variant="outline">Active Leads</Badge>
                  <Badge variant="outline">Potential Churners</Badge>
                  <Button variant="outline" size="sm">+ Create Group</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link Description</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Total Clicks</TableHead>
                    <TableHead>Unique Clicks</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkPerformanceData.map((link, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{link.description}</TableCell>
                      <TableCell className="text-blue-600 underline max-w-64 truncate">
                        {link.link}
                      </TableCell>
                      <TableCell>{link.totalClicks}</TableCell>
                      <TableCell>{link.uniqueClicks}</TableCell>
                      <TableCell>{((link.uniqueClicks / totalMetrics.delivered) * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {device.device === 'Mobile' ? <Smartphone className="h-5 w-5" /> :
                         device.device === 'Desktop' ? <Monitor className="h-5 w-5" /> :
                         <Tablet className="h-5 w-5" />}
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {device.opens} opens, {device.clicks} clicks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Client Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientData.map((client, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{client.client}</span>
                      <div className="text-right">
                        <div className="font-bold">{client.percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {client.opens} opens, {client.clicks} clicks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={engagementTimelineData}
                series={[
                  { dataKey: 'opens', name: 'Opens', color: '#3b82f6' },
                  { dataKey: 'clicks', name: 'Clicks', color: '#10b981' }
                ]}
                xAxisDataKey="time"
                height={300}
                chartTitle="Opens and Clicks Since Campaign Send"
                xAxisLabel="Time Since Send"
                yAxisLabel="Count"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCampaignsTab;
