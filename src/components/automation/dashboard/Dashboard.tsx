import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import CompanionedAIChat from '@/components/CompanionedAIChat';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Mail, 
  MessageSquare, 
  Phone, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Brain,
  AlertTriangle,
  Bot,
  X,
  MessageCircle
} from 'lucide-react';

// Dummy data
const overallMetrics = {
  totalContacts: 15247,
  completedWorkflows: 12895,
  activeWorkflows: 8,
  unsubscribeRate: 2.3
};

const workflowPerformance = [
  { name: 'Welcome Series', entered: 3421, completed: 2987, rate: 87.3 },
  { name: 'Lead Nurturing', entered: 2156, completed: 1834, rate: 85.1 },
  { name: 'Appointment Reminders', entered: 4523, completed: 4291, rate: 94.9 },
  { name: 'Re-engagement', entered: 1987, completed: 1456, rate: 73.3 },
  { name: 'Onboarding', entered: 3160, completed: 2327, rate: 73.6 }
];

const channelMetrics = {
  email: {
    sent: 45623,
    opened: 32437,
    clicked: 8956,
    unsubscribed: 423,
    openRate: 71.1,
    clickRate: 27.6,
    unsubscribeRate: 0.9
  },
  sms: {
    sent: 12456,
    delivered: 12198,
    replied: 3421,
    deliveryRate: 97.9,
    replyRate: 28.0
  },
  calls: {
    attempted: 5678,
    answered: 3421,
    completed: 2987,
    answerRate: 60.2,
    completionRate: 87.3,
    avgDuration: '4:32'
  }
};

const engagementTrends = [
  { month: 'Jan', engagement: 78, emails: 85, sms: 72, calls: 65 },
  { month: 'Feb', engagement: 82, emails: 88, sms: 75, calls: 68 },
  { month: 'Mar', engagement: 79, emails: 86, sms: 73, calls: 62 },
  { month: 'Apr', engagement: 85, emails: 91, sms: 78, calls: 71 },
  { month: 'May', engagement: 88, emails: 93, sms: 81, calls: 74 },
  { month: 'Jun', engagement: 91, emails: 95, sms: 84, calls: 78 }
];

const pieData = [
  { name: 'Completed', value: 68, color: '#10b981' },
  { name: 'In Progress', value: 24, color: '#3b82f6' },
  { name: 'Dropped Off', value: 8, color: '#ef4444' }
];

const aiRecommendations = [
  {
    type: 'optimization',
    title: 'Optimize Email Send Times',
    description: 'Send emails at 10 AM for 23% higher open rates',
    impact: 'High',
    workflow: 'Welcome Series'
  },
  {
    type: 'engagement',
    title: 'Add SMS Follow-up',
    description: 'Users who don\'t open emails respond well to SMS',
    impact: 'Medium',
    workflow: 'Lead Nurturing'
  },
  {
    type: 'churn',
    title: 'Risk Alert',
    description: '127 contacts showing disengagement patterns',
    impact: 'High',
    workflow: 'Re-engagement'
  }
];

const Dashboard: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');
  const [showChat, setShowChat] = useState(false);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
                {change}
              </div>
            )}
          </div>
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automation Dashboard</h1>
          <p className="text-muted-foreground">AI-powered overview of your automated workflows</p>
        </div>
        <Button
          onClick={() => setShowChat(!showChat)}
          className={`flex items-center gap-2 ${
            showChat 
              ? "bg-white text-primary border border-primary hover:bg-gray-50" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {showChat ? "Close Chat" : "CompanionedAI"}
        </Button>
      </div>

      {/* AI Chat Section */}
      {showChat && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workflows</SelectItem>
                <SelectItem value="welcome">Welcome Series</SelectItem>
                <SelectItem value="nurturing">Lead Nurturing</SelectItem>
                <SelectItem value="reminders">Appointment Reminders</SelectItem>
                <SelectItem value="reengagement">Re-engagement</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts Entered"
          value={overallMetrics.totalContacts.toLocaleString()}
          change="+12.5% vs last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Workflows Completed"
          value={overallMetrics.completedWorkflows.toLocaleString()}
          change="+8.2% vs last month"
          icon={CheckCircle}
          trend="up"
        />
        <MetricCard
          title="Active Workflows"
          value={overallMetrics.activeWorkflows}
          icon={Target}
        />
        <MetricCard
          title="Unsubscribe Rate"
          value={`${overallMetrics.unsubscribeRate}%`}
          change="-0.3% vs last month"
          icon={XCircle}
          trend="up"
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workflowPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 'Trigger Activated', rate: 100, count: '15,247' },
                  { step: 'Email 1 Sent', rate: 98, count: '14,942' },
                  { step: 'Email 1 Opened', rate: 71, count: '10,825' },
                  { step: 'Email 2 Sent', rate: 85, count: '12,960' },
                  { step: 'Call Attempted', rate: 45, count: '6,861' },
                  { step: 'Workflow Completed', rate: 65, count: '9,911' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.step}</span>
                        <span className="text-sm text-gray-600">{item.rate}% ({item.count})</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sent</span>
                  <span className="font-medium">{channelMetrics.email.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Rate</span>
                  <span className="font-medium text-green-600">{channelMetrics.email.openRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Click Rate</span>
                  <span className="font-medium text-blue-600">{channelMetrics.email.clickRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Unsubscribe Rate</span>
                  <span className="font-medium text-red-600">{channelMetrics.email.unsubscribeRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  SMS Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sent</span>
                  <span className="font-medium">{channelMetrics.sms.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Rate</span>
                  <span className="font-medium text-green-600">{channelMetrics.sms.deliveryRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Reply Rate</span>
                  <span className="font-medium text-blue-600">{channelMetrics.sms.replyRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Attempted</span>
                  <span className="font-medium">{channelMetrics.calls.attempted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Answer Rate</span>
                  <span className="font-medium text-green-600">{channelMetrics.calls.answerRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="font-medium text-blue-600">{channelMetrics.calls.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Duration</span>
                  <span className="font-medium">{channelMetrics.calls.avgDuration}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={3} name="Overall" />
                  <Line type="monotone" dataKey="emails" stroke="#10b981" strokeWidth={2} name="Email" />
                  <Line type="monotone" dataKey="sms" stroke="#f59e0b" strokeWidth={2} name="SMS" />
                  <Line type="monotone" dataKey="calls" stroke="#ef4444" strokeWidth={2} name="Calls" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time to Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { workflow: 'Welcome Series', time: '3.2 days', change: '-12%' },
                    { workflow: 'Lead Nurturing', time: '8.7 days', change: '+5%' },
                    { workflow: 'Appointment Reminders', time: '2.1 hours', change: '-8%' },
                    { workflow: 'Re-engagement', time: '5.8 days', change: '+15%' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.workflow}</span>
                      <div className="text-right">
                        <span className="font-medium">{item.time}</span>
                        <span className={`ml-2 text-xs ${
                          item.change.startsWith('-') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { segment: 'High Engagement', score: 92, count: '4,521', color: 'bg-green-500' },
                    { segment: 'Medium Engagement', score: 67, count: '7,832', color: 'bg-yellow-500' },
                    { segment: 'Low Engagement', score: 34, count: '2,894', color: 'bg-red-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.segment}</span>
                        <span className="text-sm text-gray-600">{item.count} contacts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.score} className="flex-1" />
                        <span className="text-sm font-medium w-12">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge variant={rec.impact === 'High' ? 'destructive' : 'secondary'}>
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <p className="text-xs text-gray-500">Workflow: {rec.workflow}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Churn Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { risk: 'High Risk', count: 127, percentage: 8.3, color: 'text-red-600' },
                    { risk: 'Medium Risk', count: 342, percentage: 22.4, color: 'text-yellow-600' },
                    { risk: 'Low Risk', count: 1056, percentage: 69.3, color: 'text-green-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.risk}</span>
                      <div className="text-right">
                        <span className={`font-medium ${item.color}`}>{item.count}</span>
                        <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predicted Next Best Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Send personalized email', contacts: 1542, confidence: 87 },
                    { action: 'Schedule follow-up call', contacts: 892, confidence: 73 },
                    { action: 'Send SMS reminder', contacts: 634, confidence: 91 },
                    { action: 'Pause communications', contacts: 234, confidence: 68 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.action}</span>
                        <span className="text-xs text-gray-500">{item.contacts} contacts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.confidence} className="flex-1" />
                        <span className="text-xs w-12">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
