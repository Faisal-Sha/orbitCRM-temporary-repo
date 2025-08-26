
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import { Badge } from "@/components/ui/badge";
import StaffProfile from "./StaffProfile";
import StaffProfessional from "./StaffProfessional";
import StaffAlignment from "./StaffAlignment";
import StaffInterview from "./StaffInterview";
import StaffOfferCompliance from "./StaffOfferCompliance";
import StaffOnboardingNotes from "./StaffOnboardingNotes";
import StaffCompanionedAI from "./StaffCompanionedAI";

const OnboardingForm = () => {
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get('client') || 'Staff Onboarding';

  // Dummy data for position and status
  const position = "Clinician";
  const currentStatus = "Interview";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Screening":
        return "bg-yellow-100 text-yellow-800";
      case "Interview":
        return "bg-blue-100 text-blue-800";
      case "Offer Extended":
        return "bg-green-100 text-green-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { value: "profile", label: "Profile", content: <StaffProfile /> },
    { value: "professional", label: "Professional", content: <StaffProfessional /> },
    { value: "alignment", label: "Alignment", content: <StaffAlignment /> },
    { value: "interview", label: "Interview", content: <StaffInterview /> },
    { value: "offer-compliance", label: "Offer & Compliance", content: <StaffOfferCompliance /> },
    { value: "notes", label: "Notes", content: <StaffOnboardingNotes /> },
    { value: "ai", label: "CompanionedAI", content: <StaffCompanionedAI /> },
  ];

  return (
    <div className="min-h-screen overflow-y-auto">
      <PageContainer
        title={clientName}
        description="Staff onboarding details and documentation"
      >
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Applying Position/Role:</span>
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
          <TabsComponent tabs={tabs} defaultTab="profile" />
        </div>
      </PageContainer>
    </div>
  );
};

export default OnboardingForm;
