
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Target, Clock, Users } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import GeneralTab from "@/components/userprofile/GeneralTab";
import QuestionnaireTab from "./QuestionnaireTab";
import DiagnosisTab from "./DiagnosisTab";
import TreatmentPlanTab from "./TreatmentPlanTab";
import LegalAdminTab from "./LegalAdminTab";

const AssessmentForm = () => {
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get('client') || 'Assessment';

  const CompanionedAITab = () => {
    const [activeSubTab, setActiveSubTab] = useState("chat");

    const AIInsightsTab = () => (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className="font-semibold text-blue-600">Low</p>
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
                  <p className="text-sm text-muted-foreground">Treatment Readiness</p>
                  <p className="font-semibold text-green-600">High</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  <p className="font-semibold text-orange-600">Moderate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Clinical Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Primary Presentation</h4>
                <p className="text-sm text-blue-800">
                  Client presents with moderate depression and anxiety symptoms following recent job loss. 
                  Sleep disturbances and social withdrawal are prominent features. No current safety concerns identified.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Strengths & Protective Factors</h4>
                <p className="text-sm text-green-800">
                  Strong family support system, previous positive therapy response, good insight, 
                  and motivation for treatment. Maintains regular exercise routine.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Diagnostic Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Major Depressive Disorder</span>
                <Badge variant="default" className="bg-red-600">High Confidence</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Generalized Anxiety Disorder</span>
                <Badge variant="secondary">Moderate Confidence</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Adjustment Disorder</span>
                <Badge variant="outline">Consider Differential</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Treatment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold mb-1">Primary Modality</h4>
                <p className="text-sm text-muted-foreground">
                  Cognitive Behavioral Therapy (CBT) - Strong evidence base for depression and anxiety
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold mb-1">Session Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Weekly sessions recommended initially, with potential for bi-weekly after 6-8 sessions
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold mb-1">Additional Considerations</h4>
                <p className="text-sm text-muted-foreground">
                  Consider psychiatric evaluation for medication management; sleep hygiene education priority
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recommended Assessments & Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Baseline Assessments</h4>
                <ul className="text-sm space-y-1">
                  <li>• PHQ-9 (Depression)</li>
                  <li>• GAD-7 (Anxiety)</li>
                  <li>• Columbia Suicide Severity Rating Scale</li>
                  <li>• Pittsburgh Sleep Quality Index</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Follow-up Schedule</h4>
                <ul className="text-sm space-y-1">
                  <li>• Weekly check-ins (first 4 weeks)</li>
                  <li>• Bi-weekly assessments (weeks 5-12)</li>
                  <li>• Monthly reviews thereafter</li>
                  <li>• Crisis protocols established</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Coordination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Care Coordination Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-1">Psychiatry Referral</h4>
                <p className="text-sm text-muted-foreground">
                  Recommended within 2-3 weeks for medication evaluation given symptom severity
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-1">Support Groups</h4>
                <p className="text-sm text-muted-foreground">
                  Job loss support group and depression support group may provide additional benefit
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-1">Family Involvement</h4>
                <p className="text-sm text-muted-foreground">
                  Consider family session to enhance support system and psychoeducation
                </p>
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
              AI-Assisted Clinical Insights
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-0">
            <div className="h-[600px]">
              <CompanionedAIChat />
            </div>
          </TabsContent>
          <TabsContent value="insights" className="mt-0">
            <AIInsightsTab />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const GeneralTabWrapper = () => (
    <GeneralTab user={{}} hideUpcomingAppointments={true} />
  );

  const tabs = [
    { value: "general", label: "General", content: <GeneralTabWrapper /> },
    { value: "questionnaire", label: "Questionnaire", content: <QuestionnaireTab /> },
    { value: "diagnosis", label: "Diagnosis", content: <DiagnosisTab /> },
    { value: "treatment", label: "Treatment Plan", content: <TreatmentPlanTab /> },
    { value: "legal", label: "Legal & Admin", content: <LegalAdminTab /> },
    { value: "ai", label: "CompanionedAI", content: <CompanionedAITab /> },
  ];

  return (
    <div className="min-h-screen overflow-y-auto">
      <PageContainer
        title={clientName}
        description="Assessment details and documentation"
      >
        <div className="overflow-y-auto">
          <TabsComponent tabs={tabs} defaultTab="general" />
        </div>
      </PageContainer>
    </div>
  );
};

export default AssessmentForm;
