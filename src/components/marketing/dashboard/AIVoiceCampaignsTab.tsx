
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
  Phone, 
  Users, 
  Eye, 
  UserPlus,
  Bot,
  Globe,
  Smartphone,
  Clock,
  DollarSign,
  Calendar,
  PhoneCall,
  Voicemail,
  AlertTriangle,
  Star,
  BarChart3
} from "lucide-react";

interface AIVoiceAnalyticsData {
  totalCalled: number;
  reachRate: number;
  voicemailRate: number;
  failedRate: number;
  appointmentsScheduled: number;
  appointmentRate: number;
  humanCallRequests: number;
  humanCallRate: number;
  avgCallDuration: number;
  longestCall: number;
  shortestCall: number;
  avgCallCost: number;
  highestCallCost: number;
  lowestCallCost: number;
  avgLatency: number;
  highestLatency: number;
  lowestLatency: number;
  campaigns: VoiceCampaignMetrics[];
  deviceBreakdown: DeviceData[];
  engagementOverTime: EngagementData[];
  recipientActivity: RecipientActivity[];
  geographicData: GeographicData[];
  ratingDistribution: RatingDistribution[];
  qualityScoreDistribution: QualityDistribution[];
}

interface VoiceCampaignMetrics {
  id: string;
  name: string;
  called: number;
  reached: number;
  voicemail: number;
  failed: number;
  scheduled: number;
  reachRate: number;
  scheduleRate: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface DeviceData {
  device: string;
  percentage: number;
  count: number;
}

interface EngagementData {
  hour: number;
  called: number;
  reached: number;
}

interface RecipientActivity {
  id: string;
  phone: string;
  name: string;
  status: 'reached' | 'voicemail' | 'failed' | 'scheduled' | 'callback';
  timestamp: string;
  duration: number;
  rating: number;
}

interface GeographicData {
  location: string;
  called: number;
  reached: number;
  percentage: number;
}

interface RatingDistribution {
  range: string;
  count: number;
  percentage: number;
}

interface QualityDistribution {
  range: string;
  count: number;
  percentage: number;
}

const dummyVoiceAnalyticsData: AIVoiceAnalyticsData = {
  totalCalled: 8750,
  reachRate: 67.5,
  voicemailRate: 18.2,
  failedRate: 14.3,
  appointmentsScheduled: 892,
  appointmentRate: 15.1,
  humanCallRequests: 245,
  humanCallRate: 4.1,
  avgCallDuration: 142,
  longestCall: 540,
  shortestCall: 15,
  avgCallCost: 0.85,
  highestCallCost: 3.20,
  lowestCallCost: 0.12,
  avgLatency: 180,
  highestLatency: 450,
  lowestLatency: 85,
  campaigns: [
    {
      id: '1',
      name: 'Holiday Appointment Booking',
      called: 2500,
      reached: 1750,
      voicemail: 450,
      failed: 300,
      scheduled: 420,
      reachRate: 70.0,
      scheduleRate: 24.0,
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Service Follow-up Calls',
      called: 1800,
      reached: 1200,
      voicemail: 380,
      failed: 220,
      scheduled: 180,
      reachRate: 66.7,
      scheduleRate: 15.0,
      performance: 'good'
    },
    {
      id: '3',
      name: 'Lead Qualification Campaign',
      called: 3200,
      reached: 2000,
      voicemail: 600,
      failed: 600,
      scheduled: 240,
      reachRate: 62.5,
      scheduleRate: 12.0,
      performance: 'average'
    }
  ],
  deviceBreakdown: [
    { device: 'iPhone', percentage: 62.3, count: 5453 },
    { device: 'Android', percentage: 34.1, count: 2984 },
    { device: 'Landline', percentage: 3.6, count: 313 }
  ],
  engagementOverTime: [
    { hour: 8, called: 420, reached: 280 },
    { hour: 9, called: 650, reached: 450 },
    { hour: 10, called: 820, reached: 570 },
    { hour: 11, called: 750, reached: 520 },
    { hour: 12, called: 480, reached: 320 },
    { hour: 13, called: 680, reached: 460 },
    { hour: 14, called: 890, reached: 620 },
    { hour: 15, called: 780, reached: 540 },
    { hour: 16, called: 650, reached: 450 },
    { hour: 17, called: 420, reached: 290 }
  ],
  recipientActivity: [
    { id: '1', phone: '+1-555-0123', name: 'John Doe', status: 'scheduled', timestamp: '2024-12-20 10:15 AM', duration: 180, rating: 8 },
    { id: '2', phone: '+1-555-0124', name: 'Jane Smith', status: 'reached', timestamp: '2024-12-20 10:05 AM', duration: 120, rating: 7 },
    { id: '3', phone: '+1-555-0125', name: 'Bob Johnson', status: 'failed', timestamp: '2024-12-20 10:02 AM', duration: 0, rating: 0 },
    { id: '4', phone: '+1-555-0126', name: 'Alice Brown', status: 'callback', timestamp: '2024-12-20 10:30 AM', duration: 95, rating: 9 },
    { id: '5', phone: '+1-555-0127', name: 'David Wilson', status: 'voicemail', timestamp: '2024-12-20 10:45 AM', duration: 30, rating: 6 }
  ],
  geographicData: [
    { location: 'United States', called: 5250, reached: 3675, percentage: 60.0 },
    { location: 'Canada', called: 1400, reached: 980, percentage: 16.0 },
    { location: 'United Kingdom', called: 1050, reached: 735, percentage: 12.0 },
    { location: 'Australia', called: 700, reached: 490, percentage: 8.0 },
    { location: 'Other', called: 350, reached: 245, percentage: 4.0 }
  ],
  ratingDistribution: [
    { range: '0-2', count: 156, percentage: 5.2 },
    { range: '3-4', count: 298, percentage: 9.9 },
    { range: '5-6', count: 512, percentage: 17.1 },
    { range: '7-8', count: 1248, percentage: 41.6 },
    { range: '9-10', count: 786, percentage: 26.2 }
  ],
  qualityScoreDistribution: [
    { range: '0-2', count: 89, percentage: 3.0 },
    { range: '3-4', count: 187, percentage: 6.2 },
    { range: '5-6', count: 456, percentage: 15.2 },
    { range: '7-8', count: 1345, percentage: 44.8 },
    { range: '9-10', count: 923, percentage: 30.8 }
  ]
};

const AIVoiceCampaignsTab = () => {
  const [analyticsData] = useState<AIVoiceAnalyticsData>(dummyVoiceAnalyticsData);
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
      case 'reached': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'callback': return 'bg-purple-100 text-purple-800';
      case 'voicemail': return 'bg-orange-100 text-orange-800';
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

  const campaignChartData = analyticsData.campaigns.map(campaign => ({
    name: campaign.name,
    reachRate: campaign.reachRate,
    scheduleRate: campaign.scheduleRate
  }));

  const campaignChartSeries = [
    { dataKey: 'reachRate', name: 'Reach Rate', color: '#22c55e' },
    { dataKey: 'scheduleRate', name: 'Schedule Rate', color: '#3b82f6' }
  ];

  const engagementChartData = analyticsData.engagementOverTime.map(point => ({
    hour: `${point.hour}:00`,
    called: point.called,
    reached: point.reached
  }));

  const engagementSeries = [
    { dataKey: 'called', name: 'Called', color: '#f59e0b' },
    { dataKey: 'reached', name: 'Reached', color: '#22c55e' }
  ];

  const handleContactClick = (contactId: string) => {
    console.log(`Opening UserProfilePanel for contact ${contactId}`);
    // This would open the UserProfilePanel component with dummy user data
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Called</p>
                <p className="text-3xl font-bold">{analyticsData.totalCalled.toLocaleString()}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reach Rate</p>
                <p className="text-3xl font-bold">{analyticsData.reachRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(analyticsData.totalCalled * analyticsData.reachRate / 100)} reached
                </p>
              </div>
              <PhoneCall className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Voicemail Rate</p>
                <p className="text-3xl font-bold">{analyticsData.voicemailRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(analyticsData.totalCalled * analyticsData.voicemailRate / 100)} voicemails
                </p>
              </div>
              <Voicemail className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Rate</p>
                <p className="text-3xl font-bold">{analyticsData.failedRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(analyticsData.totalCalled * analyticsData.failedRate / 100)} failed
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments Scheduled</p>
                <p className="text-3xl font-bold">{analyticsData.appointmentsScheduled}</p>
                <p className="text-xs text-muted-foreground">{analyticsData.appointmentRate}% of total calls</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Human Call Requests</p>
                <p className="text-3xl font-bold">{analyticsData.humanCallRequests}</p>
                <p className="text-xs text-muted-foreground">{analyticsData.humanCallRate}% of total calls</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Call Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-bold">{analyticsData.avgCallDuration}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest</p>
                <p className="text-xl font-bold">{analyticsData.longestCall}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shortest</p>
                <p className="text-xl font-bold">{analyticsData.shortestCall}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Call Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-bold">${analyticsData.avgCallCost}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="text-xl font-bold">${analyticsData.highestCallCost}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="text-xl font-bold">${analyticsData.lowestCallCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Call Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-bold">{analyticsData.avgLatency}ms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="text-xl font-bold">{analyticsData.highestLatency}ms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="text-xl font-bold">{analyticsData.lowestLatency}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating and Quality Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Participant Call Ratings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.ratingDistribution.map((rating, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">{rating.range}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{rating.percentage}%</p>
                    <p className="text-sm text-muted-foreground">{rating.count} calls</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Quality Scores Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.qualityScoreDistribution.map((quality, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{quality.range}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{quality.percentage}%</p>
                    <p className="text-sm text-muted-foreground">{quality.count} calls</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={campaignChartData}
              series={campaignChartSeries}
              xAxisDataKey="name"
              xAxisLabel="Campaigns"
              yAxisLabel="Rate (%)"
              height={300}
            />
          </CardContent>
        </Card>

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
              yAxisLabel="Calls"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="devices">Device Report</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="bestworst">Best/Worst</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Voice Campaign Performance</CardTitle>
                <Button variant="outline" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  Ask AI Analytics
                </Button>
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
                    <TableHead>Called</TableHead>
                    <TableHead>Reached</TableHead>
                    <TableHead>Voicemail</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Reach Rate</TableHead>
                    <TableHead>Schedule Rate</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.called.toLocaleString()}</TableCell>
                      <TableCell>{campaign.reached.toLocaleString()}</TableCell>
                      <TableCell>{campaign.voicemail.toLocaleString()}</TableCell>
                      <TableCell>{campaign.failed.toLocaleString()}</TableCell>
                      <TableCell>{campaign.scheduled.toLocaleString()}</TableCell>
                      <TableCell>{campaign.reachRate}%</TableCell>
                      <TableCell>{campaign.scheduleRate}%</TableCell>
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
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button 
                  variant={selectedKPI === 'reached' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'reached' ? '' : 'reached')}
                >
                  Reached ({analyticsData.recipientActivity.filter(r => r.status === 'reached').length})
                </Button>
                <Button 
                  variant={selectedKPI === 'scheduled' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'scheduled' ? '' : 'scheduled')}
                >
                  Scheduled ({analyticsData.recipientActivity.filter(r => r.status === 'scheduled').length})
                </Button>
                <Button 
                  variant={selectedKPI === 'callback' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'callback' ? '' : 'callback')}
                >
                  Callback ({analyticsData.recipientActivity.filter(r => r.status === 'callback').length})
                </Button>
                <Button 
                  variant={selectedKPI === 'voicemail' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedKPI(selectedKPI === 'voicemail' ? '' : 'voicemail')}
                >
                  Voicemail ({analyticsData.recipientActivity.filter(r => r.status === 'voicemail').length})
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
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by phone..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add to Group
                      </Button>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rating</TableHead>
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
                          <TableCell>{recipient.duration}s</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {recipient.rating > 0 ? recipient.rating : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactClick(recipient.id)}
                            >
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
                        <p className="text-sm text-muted-foreground">{device.count.toLocaleString()} calls</p>
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
                    <TableHead>Called</TableHead>
                    <TableHead>Reached</TableHead>
                    <TableHead>Reach Rate</TableHead>
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
                      <TableCell>{location.called.toLocaleString()}</TableCell>
                      <TableCell>{location.reached.toLocaleString()}</TableCell>
                      <TableCell>{((location.reached / location.called) * 100).toFixed(1)}%</TableCell>
                      <TableCell>{location.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bestworst">
          <Card>
            <CardHeader>
              <CardTitle>Best vs Worst Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-600 mb-4">Best Performing</h4>
                  <div className="space-y-3">
                    {analyticsData.campaigns
                      .filter(c => c.performance === 'excellent')
                      .map((campaign, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg">
                          <p className="font-medium">{campaign.name}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                            <span>Reach: {campaign.reachRate}%</span>
                            <span>Schedule: {campaign.scheduleRate}%</span>
                            <span>Called: {campaign.called}</span>
                            <span>Reached: {campaign.reached}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-4">Needs Improvement</h4>
                  <div className="space-y-3">
                    {analyticsData.campaigns
                      .filter(c => c.performance === 'average' || c.performance === 'poor')
                      .map((campaign, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg">
                          <p className="font-medium">{campaign.name}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                            <span>Reach: {campaign.reachRate}%</span>
                            <span>Schedule: {campaign.scheduleRate}%</span>
                            <span>Called: {campaign.called}</span>
                            <span>Reached: {campaign.reached}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIVoiceCampaignsTab;
