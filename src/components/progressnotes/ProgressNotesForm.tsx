import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import AIInsights from "./AIInsights";
import ProgressNotesTab from "./ProgressNotesTab";
import GoalsTab from "./GoalsTab";
import ActionPlanTab from "./ActionPlanTab";
import GeneralTab from "@/components/userprofile/GeneralTab";
import PerformanceTab from "@/components/userprofile/PerformanceTab";
import RecordsTab from "@/components/userprofile/RecordsTab";
import CommentsTab from "@/components/userprofile/CommentsTab";
import ActivityTab from "@/components/userprofile/ActivityTab";
import TreatmentPlanTab from "./TreatmentPlanTab";
import PersonalNotesTab from "./PersonalNotesTab";
import SupervisionNotesTab from "./SupervisionNotesTab";

const ProgressNotesForm = () => {
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get('client') || 'Progress Notes';

  const CompanionedAITab = () => {
    const [activeSubTab, setActiveSubTab] = useState("chat");

    return (
      <div className="app-card">
        <Tabs defaultValue={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="app-tabs w-full mb-6">
            <TabsTrigger value="chat" className="app-tab">
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="app-tab">
              AI-Assisted Provider Insights
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-0">
            <div className="h-[600px]">
              <CompanionedAIChat />
            </div>
          </TabsContent>
          <TabsContent value="insights" className="mt-0">
            <AIInsights />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const ProfileTabWrapper = () => {
    const [activeProfileTab, setActiveProfileTab] = useState("general");

    return (
      <div className="app-card">
        <Tabs defaultValue={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
          <TabsList className="app-tabs w-full mb-6">
            <TabsTrigger value="general" className="app-tab">
              General
            </TabsTrigger>
            <TabsTrigger value="performance" className="app-tab">
              Performance
            </TabsTrigger>
            <TabsTrigger value="records" className="app-tab">
              Records
            </TabsTrigger>
            <TabsTrigger value="conversations" className="app-tab">
              Conversations
            </TabsTrigger>
            <TabsTrigger value="activity" className="app-tab">
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-0">
            <GeneralTab user={{}} hideUpcomingAppointments={true} showApplicationInfo={false} />
          </TabsContent>
          <TabsContent value="performance" className="mt-0">
            <PerformanceTab user={{}} />
          </TabsContent>
          <TabsContent value="records" className="mt-0">
            <RecordsTab user={{}} />
          </TabsContent>
          <TabsContent value="conversations" className="mt-0">
            <CommentsTab user={{}} />
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <ActivityTab user={{ name: clientName }} />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const tabs = [
    { value: "progress", label: "Progress Notes", content: <ProgressNotesTab /> },
    { value: "goals", label: "Goals", content: <GoalsTab /> },
    { value: "action-plan", label: "Action Plan", content: <ActionPlanTab /> },
    { value: "treatment", label: "Treatment Plan", content: <TreatmentPlanTab /> },
    { value: "personal", label: "Personal Notes", content: <PersonalNotesTab /> },
    { value: "supervision", label: "Supervision Notes", content: <SupervisionNotesTab /> },
    { value: "profile", label: "Profile", content: <ProfileTabWrapper /> },
    { value: "ai", label: "CompanionedAI", content: <CompanionedAITab /> },
  ];

  return (
    <div className="min-h-screen overflow-y-auto">
      <PageContainer
        title={clientName}
        description="Progress notes and documentation"
      >
        <div className="overflow-y-auto">
          <TabsComponent tabs={tabs} defaultTab="progress" />
        </div>
      </PageContainer>
    </div>
  );
};

export default ProgressNotesForm;
