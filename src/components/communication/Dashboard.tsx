
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { 
  Mail, 
  Phone, 
  Video, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  PhoneCall,
  MessageSquare,
  Share2
} from "lucide-react";

// Dummy data for communication metrics
const overallMetrics = {
  totalInteractionsToday: 47,
  totalInteractionsWeek: 312,
  responseRate: 85,
  unreadMessages: 23,
  activeConversations: 12
};

const emailMetrics = {
  sentToday: 15,
  sentWeek: 89,
  receivedToday: 22,
  receivedWeek: 156,
  avgResponseTime: "2.3 hours",
  activeThreads: [
    { subject: "Project Update - Q4 Review", sender: "Sarah Wilson", date: "2 hours ago", unread: 3 },
    { subject: "Client Meeting Schedule", sender: "Mike Johnson", date: "4 hours ago", unread: 2 },
    { subject: "Budget Approval Request", sender: "Lisa Chen", date: "Yesterday", unread: 1 },
    { subject: "Team Coordination", sender: "David Brown", date: "Yesterday", unread: 0 },
    { subject: "System Maintenance Notice", sender: "IT Support", date: "2 days ago", unread: 0 }
  ]
};

const phoneMetrics = {
  totalToday: 8,
  totalWeek: 45,
  avgDuration: "12 minutes",
  missedCalls: 3,
  callTypes: [
    { type: "Inbound", count: 28 },
    { type: "Outbound", count: 17 }
  ]
};

const videoMetrics = {
  totalToday: 4,
  totalWeek: 23,
  avgDuration: "28 minutes",
  missedCalls: 1,
  callTypes: [
    { type: "Inbound", count: 14 },
    { type: "Outbound", count: 9 }
  ]
};

const internalChatMetrics = {
  sentToday: 34,
  sentWeek: 198,
  receivedToday: 41,
  receivedWeek: 267,
  activeConversations: [
    { participants: "Sarah, Mike, Lisa", lastMessage: "Let's schedule the review meeting", date: "1 hour ago", unread: 2 },
    { participants: "Development Team", lastMessage: "Code review completed", date: "3 hours ago", unread: 0 },
    { participants: "Project Alpha", lastMessage: "Updated the requirements doc", date: "5 hours ago", unread: 1 },
    { participants: "HR Department", lastMessage: "Benefits enrollment reminder", date: "Yesterday", unread: 0 },
    { participants: "Marketing Team", lastMessage: "Campaign results are in", date: "Yesterday", unread: 3 }
  ],
  chatTypes: [
    { type: "Personal Chats", percentage: 45 },
    { type: "Group Chats", percentage: 35 },
    { type: "Task Chats", percentage: 20 }
  ]
};

const socialChatMetrics = {
  sentToday: 28,
  sentWeek: 156,
  receivedToday: 35,
  receivedWeek: 203,
  activeConversations: [
    { participants: "Client - ABC Corp", lastMessage: "Thanks for the quick response", date: "30 mins ago", unread: 1 },
    { participants: "Partner - XYZ Inc", lastMessage: "Meeting confirmed for tomorrow", date: "2 hours ago", unread: 0 },
    { participants: "Support Team", lastMessage: "Issue resolved successfully", date: "4 hours ago", unread: 0 },
    { participants: "Marketing Lead", lastMessage: "Campaign feedback received", date: "Yesterday", unread: 2 },
    { participants: "Customer Relations", lastMessage: "Follow-up scheduled", date: "Yesterday", unread: 0 }
  ],
  platformTypes: [
    { platform: "Messenger", percentage: 40 },
    { platform: "Instagram", percentage: 35 },
    { platform: "TikTok", percentage: 25 }
  ]
};

// Chart data
const emailActivityData = [
  { day: "Mon", sent: 12, received: 18 },
  { day: "Tue", sent: 15, received: 22 },
  { day: "Wed", sent: 10, received: 16 },
  { day: "Thu", sent: 18, received: 25 },
  { day: "Fri", sent: 14, received: 20 },
  { day: "Sat", sent: 8, received: 12 },
  { day: "Sun", sent: 6, received: 9 }
];

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Dashboard</h1>
          <p className="text-muted-foreground">Overview of all your communication channels</p>
        </div>
        <Button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`flex items-center gap-2 ${
            showAIChat 
              ? "bg-white text-primary border border-primary hover:bg-gray-50" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {showAIChat ? "Close Chat" : "CompanionedAI"}
        </Button>
      </div>

      {/* AI Chat Section */}
      {showAIChat && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get insights about your communications</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Overall Communication Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Communication Metrics
              </CardTitle>
              <CardDescription>Summary of all communication activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{overallMetrics.totalInteractionsToday}</div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{overallMetrics.totalInteractionsWeek}</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{overallMetrics.responseRate}%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{overallMetrics.unreadMessages}</div>
                  <div className="text-sm text-muted-foreground">Unread</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{overallMetrics.activeConversations}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Communication Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{emailMetrics.sentToday}/{emailMetrics.sentWeek}</div>
                    <div className="text-sm text-muted-foreground">Sent (Today/Week)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{emailMetrics.receivedToday}/{emailMetrics.receivedWeek}</div>
                    <div className="text-sm text-muted-foreground">Received (Today/Week)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg Response: {emailMetrics.avgResponseTime}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">View All Emails</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Email Threads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailMetrics.activeThreads.slice(0, 4).map((thread, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm truncate">{thread.subject}</div>
                        <div className="text-xs text-muted-foreground">From: {thread.sender}</div>
                        <div className="text-xs text-muted-foreground">{thread.date}</div>
                      </div>
                      {thread.unread > 0 && (
                        <Badge variant="secondary" className="ml-2">{thread.unread}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={emailActivityData}
                series={[
                  { dataKey: "sent", name: "Sent", color: "#3b82f6", enabled: true },
                  { dataKey: "received", name: "Received", color: "#10b981", enabled: true }
                ]}
                xAxisDataKey="day"
                height={300}
                chartTitle=""
                showSeriesToggle={true}
              />
            </CardContent>
          </Card>

          {/* Phone and Video Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{phoneMetrics.totalToday}/{phoneMetrics.totalWeek}</div>
                    <div className="text-sm text-muted-foreground">Calls (Today/Week)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">{phoneMetrics.missedCalls}</div>
                    <div className="text-sm text-muted-foreground">Missed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg Duration: {phoneMetrics.avgDuration}</span>
                </div>
                <BarChart
                  data={phoneMetrics.callTypes.map(item => ({ type: item.type, count: item.count }))}
                  series={[{ dataKey: "count", name: "Calls", color: "#8b5cf6", enabled: true }]}
                  xAxisDataKey="type"
                  height={200}
                  showSeriesToggle={false}
                />
                <Button variant="outline" size="sm" className="w-full">View Phone History</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{videoMetrics.totalToday}/{videoMetrics.totalWeek}</div>
                    <div className="text-sm text-muted-foreground">Calls (Today/Week)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">{videoMetrics.missedCalls}</div>
                    <div className="text-sm text-muted-foreground">Missed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg Duration: {videoMetrics.avgDuration}</span>
                </div>
                <BarChart
                  data={videoMetrics.callTypes.map(item => ({ type: item.type, count: item.count }))}
                  series={[{ dataKey: "count", name: "Calls", color: "#06b6d4", enabled: true }]}
                  xAxisDataKey="type"
                  height={200}
                  showSeriesToggle={false}
                />
                <Button variant="outline" size="sm" className="w-full">View Video History</Button>
              </CardContent>
            </Card>
          </div>

          {/* Internal and Social Chats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Internal Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{internalChatMetrics.sentToday}/{internalChatMetrics.sentWeek}</div>
                    <div className="text-sm text-muted-foreground">Sent (Today/Week)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{internalChatMetrics.receivedToday}/{internalChatMetrics.receivedWeek}</div>
                    <div className="text-sm text-muted-foreground">Received (Today/Week)</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium">Active Conversations:</div>
                  {internalChatMetrics.activeConversations.slice(0, 3).map((conv, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{conv.participants}</div>
                        <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
                        <div className="text-xs text-muted-foreground">{conv.date}</div>
                      </div>
                      {conv.unread > 0 && (
                        <Badge variant="secondary" className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">Go to Team Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{socialChatMetrics.sentToday}/{socialChatMetrics.sentWeek}</div>
                    <div className="text-sm text-muted-foreground">Sent (Today/Week)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{socialChatMetrics.receivedToday}/{socialChatMetrics.receivedWeek}</div>
                    <div className="text-sm text-muted-foreground">Received (Today/Week)</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium">Active Conversations:</div>
                  {socialChatMetrics.activeConversations.slice(0, 3).map((conv, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{conv.participants}</div>
                        <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
                        <div className="text-xs text-muted-foreground">{conv.date}</div>
                      </div>
                      {conv.unread > 0 && (
                        <Badge variant="secondary" className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">Open Social Chat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
