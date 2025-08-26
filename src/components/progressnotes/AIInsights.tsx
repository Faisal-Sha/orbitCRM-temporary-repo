
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  Target,
  Brain,
  Heart,
  Activity,
  Calendar,
  BarChart3
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AIInsights = () => {
  // Dummy data for AI insights based on progress notes
  const progressData = [
    { date: "Jan", wellbeing: 65, stability: 72, achievement: 58 },
    { date: "Feb", wellbeing: 70, stability: 75, achievement: 62 },
    { date: "Mar", wellbeing: 75, stability: 78, achievement: 68 },
    { date: "Apr", wellbeing: 78, stability: 82, achievement: 72 },
    { date: "May", wellbeing: 82, stability: 85, achievement: 75 },
    { date: "Jun", wellbeing: 85, stability: 88, achievement: 78 }
  ];

  const sessionRatingsData = [
    { session: "Session 1", provider: 4, client: 3 },
    { session: "Session 2", provider: 5, client: 4 },
    { session: "Session 3", provider: 4, client: 4 },
    { session: "Session 4", provider: 5, client: 5 },
    { session: "Session 5", provider: 4, client: 4 },
    { session: "Session 6", provider: 5, client: 5 },
    { session: "Session 7", provider: 5, client: 4 }
  ];

  const goalProgressData = [
    { name: "Anxiety Management", value: 85, color: "#22c55e" },
    { name: "Social Skills", value: 72, color: "#3b82f6" },
    { name: "Academic Performance", value: 68, color: "#f59e0b" },
    { name: "Family Relationships", value: 78, color: "#8b5cf6" }
  ];

  const mentalHealthTrends = [
    { metric: "Anxiety Level", current: 3, previous: 5, trend: "improving" },
    { metric: "Depression Level", current: 2, previous: 4, trend: "improving" },
    { metric: "Overall Wellbeing", current: 8, previous: 6, trend: "improving" },
    { metric: "Stress Management", current: 7, previous: 5, trend: "improving" }
  ];

  const keyInsights = [
    {
      type: "positive",
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Significant Progress",
      description: "Client shows 23% improvement in overall wellbeing scores over the last 6 sessions"
    },
    {
      type: "attention",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Areas for Focus",
      description: "Academic performance goals need additional support and intervention strategies"
    },
    {
      type: "achievement",
      icon: <CheckCircle className="h-4 w-4" />,
      title: "Goal Achievement",
      description: "Successfully completed 3 out of 4 primary treatment objectives this quarter"
    },
    {
      type: "pattern",
      icon: <Brain className="h-4 w-4" />,
      title: "Behavioral Pattern",
      description: "Sessions scheduled on Tuesdays show 15% higher engagement rates"
    }
  ];

  const chartConfig = {
    wellbeing: { label: "Wellbeing", color: "#22c55e" },
    stability: { label: "Stability", color: "#3b82f6" },
    achievement: { label: "Achievement", color: "#f59e0b" }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "improving" ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case "positive":
        return "border-green-200 bg-green-50";
      case "attention":
        return "border-yellow-200 bg-yellow-50";
      case "achievement":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* AI Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Generated Client Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Based on analysis of 7 recent progress notes, this client demonstrates <strong>strong positive trajectory</strong> across 
              multiple domains. Key improvements include anxiety management (40% reduction), enhanced social engagement, and 
              consistent attendance. Current growth stage indicates transition from <Badge variant="outline">Developing</Badge> to 
              <Badge variant="outline">Established</Badge> levels. Recommend continuing current therapeutic approach with 
              increased focus on academic performance goals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keyInsights.map((insight, index) => (
          <Card key={index} className={getInsightStyle(insight.type)}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {insight.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Program Progress Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={progressData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="wellbeing" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="stability" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="achievement" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Wellbeing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Stability</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Achievement</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mental Health Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentalHealthTrends.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div>{getTrendIcon(item.trend)}</div>
                  <span className="font-medium text-sm">{item.metric}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">
                    {item.previous} → {item.current}
                  </div>
                  <div className="w-16">
                    <Progress value={(item.current / 10) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goalProgressData.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">{goal.value}%</span>
                </div>
                <Progress value={goal.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Ratings Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Session Quality Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[250px]">
            <BarChart data={sessionRatingsData}>
              <XAxis dataKey="session" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="provider" fill="#3b82f6" name="Provider Rating" />
              <Bar dataKey="client" fill="#22c55e" name="Client Rating" />
            </BarChart>
          </ChartContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Provider Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Client Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">6.2</p>
                <p className="text-xs text-muted-foreground">Avg Session Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations for Next Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-900">Focus Area: Academic Performance</p>
              <p className="text-xs text-blue-700 mt-1">
                Consider implementing structured homework planning and time management techniques
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-900">Continue Success: Anxiety Management</p>
              <p className="text-xs text-green-700 mt-1">
                Current coping strategies are highly effective - reinforce and expand techniques
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-sm font-medium text-purple-900">Engagement Strategy: Group Activities</p>
              <p className="text-xs text-purple-700 mt-1">
                Client responds well to collaborative sessions - consider peer support integration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
