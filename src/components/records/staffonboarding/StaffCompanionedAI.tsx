
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Target, Users, CheckCircle } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";

const StaffCompanionedAI = () => {
  const [activeSubTab, setActiveSubTab] = useState("chat");

  const AIHRInsightsTab = () => (
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
              Do not use this section as the sole basis for hiring or rejection decisions.
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
                <p className="text-sm text-muted-foreground">Overall Fit</p>
                <p className="font-semibold text-blue-600">Excellent</p>
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
                <p className="text-sm text-muted-foreground">Hiring Confidence</p>
                <p className="font-semibold text-green-600">High</p>
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
                <p className="text-sm text-muted-foreground">Role Match</p>
                <p className="font-semibold text-purple-600">Strong</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Candidate Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Strengths</h4>
              <p className="text-sm text-blue-800">
                Candidate demonstrates excellent clinical skills with strong educational background (MSW from UCLA). 
                Interview responses show high emotional intelligence and strong values alignment. 
                Current LCSW license and relevant experience in therapy settings.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Cultural Fit</h4>
              <p className="text-sm text-green-800">
                Strong alignment with organizational values of compassion and diversity. 
                Demonstrated commitment to serving underserved populations. 
                Positive communication style and collaborative approach.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Areas for Development</h4>
              <p className="text-sm text-orange-800">
                Limited experience with specific therapeutic modalities we use. 
                May need additional training on our documentation systems and protocols. 
                Consider pairing with senior clinician for first 90 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Hiring Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-1">Primary Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Recommend for hire</strong> - Candidate meets all requirements and shows strong potential for growth
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-1">Onboarding Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Provide comprehensive orientation on documentation systems, assign mentor for first 90 days, 
                schedule additional training on specialized therapy modalities
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-1">Compensation Guidance</h4>
              <p className="text-sm text-muted-foreground">
                Suggested salary range aligns with market rates for experience level. 
                Consider performance-based increases after 6-month review.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Flight Risk</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Performance Risk</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Training Requirements</span>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">Moderate</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Cultural Fit</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Integration Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Team Compatibility</h4>
              <p className="text-sm text-muted-foreground">
                Communication style and collaborative approach align well with existing team dynamics
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Mentorship Opportunities</h4>
              <p className="text-sm text-muted-foreground">
                Could benefit from pairing with Dr. Sarah Johnson for clinical supervision and 
                organizational culture integration
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Growth Potential</h4>
              <p className="text-sm text-muted-foreground">
                Shows potential for leadership roles and specialty development within 2-3 years
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
              <span className="text-sm">Complete background check verification</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Prepare formal offer letter</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Schedule pre-boarding orientation</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Assign mentor for first 90 days</span>
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
            AI-Assisted HR Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-0">
          <div className="h-[600px]">
            <CompanionedAIChat />
          </div>
        </TabsContent>
        <TabsContent value="insights" className="mt-0">
          <AIHRInsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffCompanionedAI;
