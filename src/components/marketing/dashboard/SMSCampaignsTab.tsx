
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
  Search, 
  MessageSquare, 
  Users, 
  Eye, 
  MousePointer, 
  UserPlus,
  Bot,
  Globe,
  Smartphone,
  Clock
} from "lucide-react";

interface AnalyticsData {
  totalSent: number;
  deliveredRate: number;
  clickThroughRate: number;
  failedRate: number;
  campaigns: CampaignMetrics[];
  deviceBreakdown: DeviceData[];
  linkPerformance: LinkData[];
  engagementOverTime: EngagementData[];
  recipientActivity: RecipientActivity[];
  geographicData: GeographicData[];
}

interface CampaignMetrics {
  id: string;
  name: string;
  sent: number;
  delivered: number;
  clicked: number;
  failed: number;
  deliveredRate: number;
  clickRate: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface DeviceData {
  device: string;
  percentage: number;
  count: number;
}

interface LinkData {
  url: string;
  totalClicks: number;
  uniqueClicks: number;
  clickRate: number;
}

interface EngagementData {
  hour: number;
  delivered: number;
  clicked: number;
}

interface RecipientActivity {
  id: string;
  phone: string;
  name: string;
  status: 'delivered' | 'failed' | 'clicked';
  timestamp: string;
  device: string;
}

interface GeographicData {
  location: string;
  delivered: number;
  clicked: number;
  percentage: number;
}

const dummyAnalyticsData: AnalyticsData = {
  totalSent: 5420,
  deliveredRate: 96.2,
  clickThroughRate: 12.8,
  failedRate: 3.8,
  campaigns: [
    {
      id: '1',
      name: 'Holiday SMS Promotion 2024',
      sent: 1250,
      delivered: 1200,
      clicked: 180,
      failed: 50,
      deliveredRate: 96.0,
      clickRate: 14.4,
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      sent: 450,
      delivered: 440,
      clicked: 35,
      failed: 10,
      deliveredRate: 97.8,
      clickRate: 7.8,
      performance: 'good'
    },
    {
      id: '3',
      name: 'Service Update',
      sent: 800,
      delivered: 750,
      clicked: 45,
      failed: 50,
      deliveredRate: 93.8,
      clickRate: 5.6,
      performance: 'average'
    }
  ],
  deviceBreakdown: [
    { device: 'iPhone', percentage: 58.2, count: 3154 },
    { device: 'Android', percentage: 39.1, count: 2119 },
    { device: 'Other', percentage: 2.7, count: 147 }
  ],
  linkPerformance: [
    { url: 'https://shop.example.com/holiday-sale', totalClicks: 145, uniqueClicks: 138, clickRate: 11.5 },
    { url: 'https://book.example.com/appointment', totalClicks: 89, uniqueClicks: 85, clickRate: 19.4 },
    { url: 'https://support.example.com/updates', totalClicks: 32, uniqueClicks: 30, clickRate: 4.0 }
  ],
  engagementOverTime: [
    { hour: 0, delivered: 45, clicked: 2 },
    { hour: 6, delivered: 180, clicked: 15 },
    { hour: 9, delivered: 320, clicked: 42 },
    { hour: 12, delivered: 280, clicked: 38 },
    { hour: 15, delivered: 240, clicked: 35 },
    { hour: 18, delivered: 190, clicked: 28 },
    { hour: 21, delivered: 120, clicked: 18 }
  ],
  recipientActivity: [
    { id: '1', phone: '+1-555-0123', name: 'John Doe', status: 'clicked', timestamp: '2024-12-20 10:15 AM', device: 'iPhone' },
    { id: '2', phone: '+1-555-0124', name: 'Jane Smith', status: 'delivered', timestamp: '2024-12-20 10:05 AM', device: 'Android' },
    { id: '3', phone: '+1-555-0125', name: 'Bob Johnson', status: 'failed', timestamp: '2024-12-20 10:02 AM', device: 'iPhone' },
    { id: '4', phone: '+1-555-0126', name: 'Alice Brown', status: 'clicked', timestamp: '2024-12-20 10:30 AM', device: 'Android' }
  ],
  geographicData: [
    { location: 'United States', delivered: 3200, clicked: 420, percentage: 59.0 },
    { location: 'Canada', delivered: 850, clicked: 95, percentage: 15.7 },
    { location: 'United Kingdom', delivered: 680, clicked: 78, percentage: 12.5 },
    { location: 'Australia', delivered: 420, clicked: 48, percentage: 7.7 },
    { location: 'Other', delivered: 270, clicked: 25, percentage: 5.1 }
  ]
};

const SMSCampaignsTab = () => {
  const [analyticsData] = useState<AnalyticsData>(dummyAnalyticsData);
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'clicked': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = analyticsData.campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerformance = performanceFilter === 'all' || campaign.performance === performanceFilter;
    return matchesSearch && matchesPerformance;
  });

  const filteredRecipients = analyticsData.recipientActivity.filter(recipient => {
    if (!selectedKPI) return false;
    return selectedKPI === 'all' || recipient.status === selectedKPI;
  });

  const chartData = analyticsData.campaigns.map(campaign => ({
    name: campaign.name,
    delivered: campaign.deliveredRate,
    clicked: campaign.clickRate
  }));

  const chartSeries = [
    { dataKey: 'delivered', name: 'Delivered Rate', color: '#22c55e' },
    { dataKey: 'clicked', name: 'Click Rate', color: '#3b82f6' }
  ];

  const engagementChartData = analyticsData.engagementOverTime.map(point => ({
    hour: `${point.hour}:00`,
    delivered: point.delivered,
    clicked: point.clicked
  }));

  const engagementSeries = [
    { dataKey: 'delivered', name: 'Delivered', color: '#22c55e' },
    { dataKey: 'clicked', name: 'Clicked', color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <p className="text-3xl font-bold">{analyticsData.totalSent.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered Rate</p>
                <p className="text-3xl font-bold">{analyticsData.deliveredRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+2.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click-Through Rate</p>
                <p className="text-3xl font-bold">{analyticsData.clickThroughRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+1.2%</span>
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Rate</p>
                <p className="text-3xl font-bold">{analyticsData.failedRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-0.5%</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={chartData}
              series={chartSeries}
              xAxisDataKey="name"
              xAxisLabel="Campaigns"
              yAxisLabel="Rate (%)"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Engagement Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={engagementChartData}
              series={engagementSeries}
              xAxisDataKey="hour"
              xAxisLabel="Hour"
              yAxisLabel="Count"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campaign Performance Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    Ask AI Analytics
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performance</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Clicked</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Delivered Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>{campaign.delivered.toLocaleString()}</TableCell>
                      <TableCell>{campaign.clicked.toLocaleString()}</TableCell>
                      <TableCell>{campaign.failed.toLocaleString()}</TableCell>
                      <TableCell>{campaign.deliveredRate}%</TableCell>
                      <TableCell>{campaign.clickRate}%</TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(campaign.performance)}>
                          {campaign.performance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients">
          <Card>
            <CardHeader>
              <CardTitle>Recipient Activity Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on any KPI to drill down into specific recipient groups
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={selectedKPI === 'delivered' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'delivered' ? '' : 'delivered')}
                >
                  Delivered ({analyticsData.recipientActivity.filter(r => r.status === 'delivered').length})
                </Button>
                <Button 
                  variant={selectedKPI === 'clicked' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'clicked' ? '' : 'clicked')}
                >
                  Clicked ({analyticsData.recipientActivity.filter(r => r.status === 'clicked').length})
                </Button>
                <Button 
                  variant={selectedKPI === 'failed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'failed' ? '' : 'failed')}
                >
                  Failed ({analyticsData.recipientActivity.filter(r => r.status === 'failed').length})
                </Button>
              </div>

              {selectedKPI && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {selectedKPI.charAt(0).toUpperCase() + selectedKPI.slice(1)} Recipients
                    </h4>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add to Group
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell className="font-mono">{recipient.phone}</TableCell>
                          <TableCell>{recipient.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(recipient.status)}>
                              {recipient.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{recipient.timestamp}</TableCell>
                          <TableCell>{recipient.device}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Total Clicks</TableHead>
                    <TableHead>Unique Clicks</TableHead>
                    <TableHead>Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.linkPerformance.map((link, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{link.url}</TableCell>
                      <TableCell>{link.totalClicks}</TableCell>
                      <TableCell>{link.uniqueClicks}</TableCell>
                      <TableCell>{link.clickRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-muted-foreground">{device.count.toLocaleString()} recipients</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{device.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Clicked</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.geographicData.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {location.location}
                      </TableCell>
                      <TableCell>{location.delivered.toLocaleString()}</TableCell>
                      <TableCell>{location.clicked.toLocaleString()}</TableCell>
                      <TableCell>{location.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SMSCampaignsTab;
