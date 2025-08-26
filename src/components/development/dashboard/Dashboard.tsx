
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, BarChart3, Target, BookOpen, Award, TrendingUp } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import GrowthStatusIndicator from "@/components/Growthstatus";

// Dummy data for different contexts
const dashboardData = {
  personal: {
    onboardingProgress: 75,
    goalsProgress: 60,
    trainingProgress: 85,
    certificates: 12,
    growthLevel: "developing" as const,
    metrics: {
      totalTasks: 45,
      completedTasks: 32,
      activeProjects: 8,
      skillsLearned: 23
    },
    recentActivities: [
      "Completed Advanced React Training",
      "Updated Professional Goals",
      "Earned JavaScript Certification",
      "Finished Onboarding Module 4"
    ]
  },
  clients: {
    onboardingProgress: 92,
    goalsProgress: 78,
    trainingProgress: 45,
    certificates: 8,
    growthLevel: "established" as const,
    metrics: {
      totalClients: 156,
      activeClients: 123,
      completedAssessments: 89,
      progressNotes: 234
    },
    recentActivities: [
      "Client onboarding completed - Sarah M.",
      "Progress assessment for John D.",
      "Training module assigned to 12 clients",
      "Certificate awarded to Emily R."
    ]
  },
  staff: {
    onboardingProgress: 88,
    goalsProgress: 95,
    trainingProgress: 72,
    certificates: 15,
    growthLevel: "established" as const,
    metrics: {
      totalStaff: 34,
      activeStaff: 31,
      completedTraining: 28,
      pendingCertifications: 6
    },
    recentActivities: [
      "New staff member onboarded - Dr. Smith",
      "Team training session completed",
      "Performance review scheduled",
      "Certification renewal for 5 staff"
    ]
  }
};

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedContext, setSelectedContext] = useState("personal");

  const currentData = dashboardData[selectedContext as keyof typeof dashboardData];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights and analytics overview</p>
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
            <CardDescription>Get insights about your development progress</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Global Filter */}
      <div className="flex gap-4">
        <Select value={selectedContext} onValueChange={setSelectedContext}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="clients">Clients</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.onboardingProgress}%</div>
            <Progress value={currentData.onboardingProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentData.onboardingProgress >= 90 ? "Nearly complete" : 
               currentData.onboardingProgress >= 70 ? "Good progress" : "Getting started"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.goalsProgress}%</div>
            <Progress value={currentData.goalsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentData.goalsProgress >= 80 ? "Excellent progress" : 
               currentData.goalsProgress >= 60 ? "On track" : "Needs attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.trainingProgress}%</div>
            <Progress value={currentData.trainingProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentData.trainingProgress >= 80 ? "Advanced level" : 
               currentData.trainingProgress >= 50 ? "Intermediate" : "Beginner"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.certificates}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {selectedContext === "personal" ? "Earned certificates" :
               selectedContext === "clients" ? "Client certificates" : "Staff certificates"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <GrowthStatusIndicator 
                growthStage={currentData.growthLevel} 
                showText={false}
              />
              <span className="text-sm font-medium capitalize">{currentData.growthLevel}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Current stage</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(currentData.metrics).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates for {selectedContext === "personal" ? "your profile" : selectedContext}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Completion Rate</span>
                <span className="font-semibold">
                  {Math.round((currentData.onboardingProgress + currentData.goalsProgress + currentData.trainingProgress) / 3)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Growth Trajectory</span>
                <span className="font-semibold text-green-600">Positive</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement Level</span>
                <span className="font-semibold">
                  {currentData.trainingProgress >= 70 ? "High" : 
                   currentData.trainingProgress >= 40 ? "Medium" : "Low"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedContext === "personal" && (
                <>
                  <div className="text-sm">• Complete remaining onboarding modules</div>
                  <div className="text-sm">• Focus on goal achievement strategies</div>
                  <div className="text-sm">• Consider advanced training programs</div>
                </>
              )}
              {selectedContext === "clients" && (
                <>
                  <div className="text-sm">• Follow up with inactive clients</div>
                  <div className="text-sm">• Implement new training modules</div>
                  <div className="text-sm">• Schedule progress assessments</div>
                </>
              )}
              {selectedContext === "staff" && (
                <>
                  <div className="text-sm">• Schedule team training sessions</div>
                  <div className="text-sm">• Review certification renewals</div>
                  <div className="text-sm">• Conduct performance evaluations</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
