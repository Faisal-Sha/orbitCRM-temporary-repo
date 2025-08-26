
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Target, Users, CheckCircle } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";

const StaffCompanionedAI = () => {
  const [activeSubTab, setActiveSubTab] = useState("chat");

  const AISupervisorInsightsTab = () => (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Disclaimer:</strong> AI-generated insights are provided for context only. 
              Do not use this section as the sole basis for staff development decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Development Progress</p>
                <p className="font-semibold text-blue-600">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance Trend</p>
                <p className="font-semibold text-green-600">Improving</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal Achievement</p>
                <p className="font-semibold text-purple-600">On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Development Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Development Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Strengths</h4>
              <p className="text-sm text-blue-800">
                Staff member shows consistent improvement in clinical documentation and client rapport building. 
                Demonstrates strong commitment to professional development and actively seeks feedback. 
                Excellent attendance at training sessions and supervision meetings.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Progress Areas</h4>
              <p className="text-sm text-green-800">
                Notable improvement in time management and case organization. 
                Increased confidence in handling complex cases and difficult client interactions. 
                Developing specialized skills in trauma-informed care approaches.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Development Opportunities</h4>
              <p className="text-sm text-orange-800">
                Continue focus on advanced therapeutic techniques and group facilitation skills. 
                Explore leadership opportunities and mentoring junior staff members. 
                Consider pursuing additional certifications in specialized areas of interest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Development Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-1">Continue Current Path</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Recommendation:</strong> Maintain current development trajectory with increased focus on specialized skills
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-1">Training Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Enroll in advanced group therapy certification, consider trauma-informed care specialization, 
                explore leadership development programs
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-1">Career Advancement</h4>
              <p className="text-sm text-muted-foreground">
                Ready for increased responsibilities, consider senior clinician track, 
                potential for supervisory roles within 12-18 months
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Clinical Skills</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Professional Growth</span>
              <Badge variant="outline" className="text-blue-600 border-blue-600">Strong</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Leadership Potential</span>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">Developing</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Team Collaboration</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentorship Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mentorship & Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Mentorship Readiness</h4>
              <p className="text-sm text-muted-foreground">
                Ready to mentor junior staff members in clinical documentation and client engagement
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Project Leadership</h4>
              <p className="text-sm text-muted-foreground">
                Capable of leading quality improvement initiatives and training program development
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Professional Development</h4>
              <p className="text-sm text-muted-foreground">
                Encourage participation in professional associations and conference presentations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Schedule advanced training enrollment</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Assign mentorship responsibilities</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Review career advancement opportunities</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Update professional development plan</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="app-card">
      <Tabs defaultValue={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="app-tabs w-full mb-6">
          <TabsTrigger value="chat" className="app-tab">
            Chat
          </TabsTrigger>
          <TabsTrigger value="insights" className="app-tab">
            AI-Assisted Supervisor Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-0">
          <div className="h-[600px]">
            <CompanionedAIChat />
          </div>
        </TabsContent>
        <TabsContent value="insights" className="mt-0">
          <AISupervisorInsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffCompanionedAI;
