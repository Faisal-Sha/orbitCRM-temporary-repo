
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Create from "@/components/marketing/email/Create";
import ManageEmailCampaigns from "@/components/marketing/manage/EmailCampaigns";

const EmailCampaigns = () => {
  const tabContent = (tabName: string) => {
    if (tabName === "Create") {
      return <Create />;
    }
    
    if (tabName === "Manage") {
      return <ManageEmailCampaigns />;
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
      title="Email Campaigns"
      description="Create and manage email marketing campaigns"
    >
      <TabsComponent tabs={tabs} defaultTab="create" />
    </PageContainer>
  );
};

export default EmailCampaigns;
