
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import LeadsFeedback from "@/components/communication/feedback/LeadsFeedback";
import ClientFeedback from "@/components/communication/feedback/ClientFeedback";
import StaffFeedback from "@/components/communication/feedback/StaffFeedback";

const Feedback = () => {
  const tabs = [
    { value: "leads", label: "Leads Feedback", content: <LeadsFeedback /> },
    { value: "client", label: "Client Feedback", content: <ClientFeedback /> },
    { value: "staff", label: "Staff Feedback", content: <StaffFeedback /> },
  ];

  return (
    <PageContainer
      title="Feedback"
      description="Manage all feedback communications"
    >
      <TabsComponent tabs={tabs} defaultTab="leads" />
    </PageContainer>
  );
};

export default Feedback;
