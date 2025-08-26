
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Create from "@/components/marketing/sms/Create";
import ManageSMSCampaigns from "@/components/marketing/manage/SMSCampaigns";

const SMSCampaigns = () => {
  const tabContent = (tabName: string) => {
    if (tabName === "Create") {
      return <Create />;
    }
    
    if (tabName === "Manage") {
      return <ManageSMSCampaigns />;
    }
    
    return (
      <div className="app-card">
        <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
        <p>Coming soon</p>
      </div>
    );
  };

  const tabs = [
    { value: "create", label: "Create", content: tabContent("Create") },
    { value: "manage", label: "Manage", content: tabContent("Manage") },
  ];

  return (
    <PageContainer
      title="SMS Campaigns"
      description="Create and manage SMS marketing campaigns"
    >
      <TabsComponent tabs={tabs} defaultTab="create" />
    </PageContainer>
  );
};

export default SMSCampaigns;
