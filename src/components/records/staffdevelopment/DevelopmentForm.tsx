
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { Badge } from "@/components/ui/badge";
import StaffMeetingNotes from "./StaffMeetingNotes";
import StaffGoals from "./StaffGoals";
import StaffActionPlan from "./StaffActionPlan";
import StaffSupervisorNotes from "./StaffSupervisorNotes";
import StaffDevelopmentProfile from "./StaffDevelopmentProfile";
import StaffCompanionedAI from "./StaffCompanionedAI";

const DevelopmentForm = () => {
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get('client') || 'Staff Development';

  // Dummy data for position and status
  const position = "Clinician";
  const currentStatus = "Active";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { value: "meeting-notes", label: "Meeting Notes", content: <StaffMeetingNotes /> },
    { value: "goals", label: "Goals", content: <StaffGoals /> },
    { value: "action-plan", label: "Action Plan", content: <StaffActionPlan /> },
    { value: "supervisor-notes", label: "Supervisor Notes", content: <StaffSupervisorNotes /> },
    { value: "profile", label: "Profile", content: <StaffDevelopmentProfile /> },
    { value: "ai", label: "CompanionedAI", content: <StaffCompanionedAI /> },
  ];

  return (
    <div className="min-h-screen overflow-y-auto">
      <PageContainer
        title={clientName}
        description="Staff development details and documentation"
      >
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Position/Role:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {position}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
            <Badge variant="secondary" className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </div>
        </div>
        
        <div className="overflow-y-auto">
          <TabsComponent tabs={tabs} defaultTab="meeting-notes" />
        </div>
      </PageContainer>
    </div>
  );
};

export default DevelopmentForm;
