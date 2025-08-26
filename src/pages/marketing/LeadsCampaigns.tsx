
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ActiveCampaignsTab from "@/components/marketing/leads/ActiveCampaignsTab";
import ArchivedCampaignsTab from "@/components/marketing/leads/ArchivedCampaignsTab";

const LeadsCampaigns = () => {
  const tabContent = (tabName: string) => {
    if (tabName === "Active") {
      return <ActiveCampaignsTab />;
    }
    
    if (tabName === "Archived") {
      return <ArchivedCampaignsTab />;
    }
    
    return (
      <div className="app-card">
        <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
        <p>Coming soon</p>
      </div>
    );
  };

  const tabs = [
    { value: "active", label: "Active", content: tabContent("Active") },
    { value: "archived", label: "Archived", content: tabContent("Archived") },
  ];

  return (
    <PageContainer
      title="Leads Campaigns"
      description="Manage your active and archived leads campaigns"
    >
      <TabsComponent tabs={tabs} defaultTab="active" />
    </PageContainer>
  );
};

export default LeadsCampaigns;
