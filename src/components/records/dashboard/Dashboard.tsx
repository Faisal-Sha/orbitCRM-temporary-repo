import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Calendar, Filter } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import CompanionedAIChat from "@/components/CompanionedAIChat";

// Dummy data for widgets
const widgetData = {
  clientAssessments: 1247,
  clientProgressNotes: 3582,
  staffOnboarding: 89,
  staffMeetingNotes: 456
};

// Dummy data for charts and statistics
const assessmentData = [
  { month: "Jan", completed: 89 },
  { month: "Feb", completed: 94 },
  { month: "Mar", completed: 102 },
  { month: "Apr", completed: 87 },
  { month: "May", completed: 115 },
  { month: "Jun", completed: 108 }
];

const progressNotesData = [
  { month: "Jan", completed: 234 },
  { month: "Feb", completed: 289 },
  { month: "Mar", completed: 312 },
  { month: "Apr", completed: 298 },
  { month: "May", completed: 334 },
  { month: "Jun", completed: 356 }
];

const onboardingData = [
  { month: "Jan", started: 12, completed: 8 },
  { month: "Feb", started: 15, completed: 11 },
  { month: "Mar", started: 18, completed: 14 },
  { month: "Apr", started: 14, completed: 12 },
  { month: "May", started: 16, completed: 13 },
  { month: "Jun", started: 19, completed: 15 }
];

const salaryData = [
  { month: "Jan", desired: 75000, offered: 68000, actual: 70000 },
  { month: "Feb", desired: 76000, offered: 69000, actual: 71000 },
  { month: "Mar", desired: 77000, offered: 70000, actual: 72000 },
  { month: "Apr", desired: 78000, offered: 71000, actual: 73000 },
  { month: "May", desired: 79000, offered: 72000, actual: 74000 },
  { month: "Jun", desired: 80000, offered: 73000, actual: 75000 }
];

const developmentNotesData = [
  { month: "Jan", completed: 45 },
  { month: "Feb", completed: 52 },
  { month: "Mar", completed: 48 },
  { month: "Apr", completed: 56 },
  { month: "May", completed: 49 },
  { month: "Jun", completed: 53 }
];

const Dashboard = () => {
  const [showChat, setShowChat] = useState(false);
  const [recordType, setRecordType] = useState("Clients");
  const [dateRange, setDateRange] = useState("All");

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const StatCard = ({ title, value, change }: { title: string; value: number; change?: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          {change && (
            <Badge variant="secondary" className="ml-2">
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value }: { title: string; value: string }) => (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-2">{title}</h4>
        <p className="text-lg font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  const ListCard = ({ title, items }: { title: string; items: string[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="text-sm">{item}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Records Overview</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for all records</p>
        </div>
        <Button 
          onClick={toggleChat}
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

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Client Assessments" value={widgetData.clientAssessments} change="+12%" />
        <StatCard title="Client Progress Notes" value={widgetData.clientProgressNotes} change="+8%" />
        <StatCard title="Staff Onboarding" value={widgetData.staffOnboarding} change="+15%" />
        <StatCard title="Staff Meeting Notes" value={widgetData.staffMeetingNotes} change="+6%" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clients">Clients</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="Last Week">Last Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
              <SelectItem value="This Quarter">This Quarter</SelectItem>
              <SelectItem value="Last Quarter">Last Quarter</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
              <SelectItem value="Last Year">Last Year</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabbed Content */}
      {recordType === "Clients" && (
        <Tabs defaultValue="assessments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress-notes">Progress Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessments Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={assessmentData}
                    series={[{ dataKey: "completed", name: "Completed", color: "#3b82f6" }]}
                    xAxisDataKey="month"
                    height={300}
                    showSeriesToggle={false}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <MetricCard title="Avg Call Duration" value="50-min" />
                <MetricCard title="Avg Estimated Treatment Duration" value="12 weeks" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ListCard 
                title="Billing Codes" 
                items={[
                  "90791 (78%)",
                  "89272 (66%)",
                  "90834 (54%)",
                  "90837 (45%)",
                  "90847 (38%)",
                  "90853 (31%)",
                  "90901 (25%)"
                ]}
              />
              
              <ListCard 
                title="Top Clinicians" 
                items={[
                  "John Smith (56%)",
                  "Jemma Dee (49%)",
                  "Sarah Johnson (43%)",
                  "Mike Wilson (38%)",
                  "Lisa Brown (35%)",
                  "David Lee (32%)",
                  "Anna Davis (28%)"
                ]}
              />
              
              <ListCard 
                title="Diagnosis Formats" 
                items={[
                  "SOAP (77%)",
                  "DAP (73%)",
                  "APIE (55%)",
                  "ADPIE (45%)",
                  "SBAR (33%)"
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListCard 
                title="Treatment Formats" 
                items={[
                  "SOAP (77%)",
                  "DAP (73%)",
                  "APIE (55%)",
                  "ADPIE (45%)",
                  "SBAR (33%)"
                ]}
              />
              
              <ListCard 
                title="Treatment Frequencies" 
                items={[
                  "Daily (55%)",
                  "Weekly (35%)",
                  "Monthly (10%)"
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListCard 
                title="Top 7 Treatment Recommendations" 
                items={[
                  "Cognitive Behavioral Therapy (77%)",
                  "Dialectical Behavior Therapy (65%)",
                  "Mindfulness-Based Therapy (54%)",
                  "Psychodynamic Therapy (43%)",
                  "Solution-Focused Therapy (38%)",
                  "Acceptance and Commitment Therapy (31%)",
                  "Interpersonal Therapy (25%)"
                ]}
              />
              
              <ListCard 
                title="Top 10 Keywords" 
                items={[
                  "anxiety (23%)",
                  "stress (19%)",
                  "depression (17%)",
                  "relationships (14%)",
                  "goals (12%)",
                  "coping (11%)",
                  "trauma (9%)",
                  "sleep (8%)",
                  "work (7%)",
                  "family (6%)"
                ]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="progress-notes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Notes Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={progressNotesData}
                    series={[{ dataKey: "completed", name: "Completed", color: "#10b981" }]}
                    xAxisDataKey="month"
                    height={300}
                    showSeriesToggle={false}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <MetricCard title="Avg Call Duration" value="65-min" />
                <MetricCard title="Avg Provider Rating" value="4.5 stars" />
                <MetricCard title="Avg Client Rating" value="4.2 stars" />
                <MetricCard title="Avg Goals Progress" value="56%" />
                <MetricCard title="Avg Mental Health Progress" value="67%" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ListCard 
                title="Top Providers" 
                items={[
                  "Jessie Adams (20 notes)",
                  "Jemma Shy (18 notes)",
                  "Mark Thompson (16 notes)",
                  "Sarah Wilson (15 notes)",
                  "David Chen (14 notes)",
                  "Lisa Garcia (12 notes)",
                  "Michael Brown (11 notes)"
                ]}
              />
              
              <ListCard 
                title="Client Programs" 
                items={[
                  "Wellbeing (45%)",
                  "Stability (30%)",
                  "Achievement (25%)"
                ]}
              />
              
              <ListCard 
                title="Client Growth" 
                items={[
                  "Developing (37%)",
                  "Foundation (33%)",
                  "Established (30%)"
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListCard 
                title="Top 10 Goals" 
                items={[
                  "Find new job (43%)",
                  "Improve relationships (38%)",
                  "Manage anxiety (35%)",
                  "Better sleep habits (32%)",
                  "Exercise regularly (28%)",
                  "Reduce stress (25%)",
                  "Build confidence (22%)",
                  "Improve communication (19%)",
                  "Set boundaries (16%)",
                  "Practice mindfulness (13%)"
                ]}
              />
              
              <ListCard 
                title="Top 10 Keywords" 
                items={[
                  "anxiety (28%)",
                  "goals (24%)",
                  "progress (21%)",
                  "relationships (18%)",
                  "coping (15%)",
                  "stress (13%)",
                  "work (11%)",
                  "family (9%)",
                  "sleep (8%)",
                  "exercise (6%)"
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}

      {recordType === "Staff" && (
        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="development">Development Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="onboarding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={onboardingData}
                    series={[
                      { dataKey: "started", name: "Started", color: "#3b82f6" },
                      { dataKey: "completed", name: "Completed", color: "#10b981" }
                    ]}
                    xAxisDataKey="month"
                    height={300}
                    showSeriesToggle={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Salary Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={salaryData}
                    series={[
                      { dataKey: "desired", name: "Desired", color: "#ef4444" },
                      { dataKey: "offered", name: "Offered", color: "#f59e0b" },
                      { dataKey: "actual", name: "Actual", color: "#10b981" }
                    ]}
                    xAxisDataKey="month"
                    height={300}
                    showSeriesToggle={false}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard title="Avg Call Duration" value="50-min" />
              <MetricCard title="Avg 'Application to Ready Contract' Time" value="3 weeks" />
              <MetricCard title="Avg Confidence Level (All Applications)" value="72%" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ListCard 
                title="Desired Roles" 
                items={[
                  "Clinician (48%)",
                  "Therapist (32%)",
                  "Counselor (15%)",
                  "Psychiatrist (5%)"
                ]}
              />
              
              <ListCard 
                title="Interviewers" 
                items={[
                  "John Doe (86%)",
                  "Jane Smith (78%)",
                  "Mike Johnson (65%)",
                  "Sarah Wilson (54%)",
                  "David Lee (43%)"
                ]}
              />
              
              <ListCard 
                title="Top Career Motivations" 
                items={[
                  "Passion to help people (65%)",
                  "Work-life balance (52%)",
                  "Professional growth (47%)",
                  "Financial stability (38%)",
                  "Flexible schedule (32%)",
                  "Remote work (28%)",
                  "Team collaboration (23%)"
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListCard 
                title="Hired Staff Interview Evaluations" 
                items={[
                  "Emotional Intelligence (87%)",
                  "Mission & Values Alignment (77%)",
                  "Client-Facing Readiness (76%)",
                  "Communication (75%)",
                  "Clinical/Technical Judgment (59%)"
                ]}
              />
              
              <ListCard 
                title="Hired Staff Languages" 
                items={[
                  "English (100%)",
                  "Spanish (35%)",
                  "French (12%)",
                  "Chinese (4%)",
                  "Other (2%)"
                ]}
              />
            </div>

            <ListCard 
              title="Top 10 Keywords" 
              items={[
                "goals (22%)",
                "motivation (19%)",
                "experience (17%)",
                "passion (15%)",
                "growth (13%)",
                "helping (11%)",
                "skills (9%)",
                "team (8%)",
                "challenge (7%)",
                "learning (6%)"
              ]}
            />
          </TabsContent>
          
          <TabsContent value="development" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Development Notes Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={developmentNotesData}
                    series={[{ dataKey: "completed", name: "Completed", color: "#8b5cf6" }]}
                    xAxisDataKey="month"
                    height={300}
                    showSeriesToggle={false}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <MetricCard title="Avg Call Duration" value="65-min" />
                <MetricCard title="Avg Manager Rating" value="4.5 stars" />
                <MetricCard title="Avg Staff Member Rating" value="4.2 stars" />
                <MetricCard title="Avg Goals Progress" value="56%" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ListCard 
                title="Top Staff Members" 
                items={[
                  "Jessie Adams (10 notes)",
                  "Mark Thompson (9 notes)",
                  "Sarah Wilson (8 notes)",
                  "David Chen (7 notes)",
                  "Lisa Garcia (6 notes)",
                  "Michael Brown (5 notes)",
                  "Jennifer White (4 notes)"
                ]}
              />
              
              <ListCard 
                title="Staff Growth" 
                items={[
                  "Developing (37%)",
                  "Foundation (33%)",
                  "Established (30%)"
                ]}
              />
              
              <ListCard 
                title="Top 10 Goals" 
                items={[
                  "Earn $4,000-$5,000/month (43%)",
                  "Improve clinical skills (38%)",
                  "Get promoted (32%)",
                  "Better work-life balance (28%)",
                  "Lead a team (25%)",
                  "Obtain certification (22%)",
                  "Mentor others (19%)",
                  "Expand expertise (16%)",
                  "Reduce caseload (13%)",
                  "Increase confidence (10%)"
                ]}
              />
            </div>

            <ListCard 
              title="Top 10 Keywords" 
              items={[
                "growth (25%)",
                "challenge (22%)",
                "development (19%)",
                "skills (17%)",
                "goals (15%)",
                "feedback (13%)",
                "improvement (11%)",
                "learning (9%)",
                "progress (8%)",
                "support (6%)"
              ]}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;
