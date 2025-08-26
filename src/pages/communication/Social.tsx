
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const Social = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>
        This is the {tabName} tab content for Social communications. Manage your {tabName.toLowerCase()} interactions and messages here.
      </p>
    </div>
  );

  const tabs = [
    { value: "meta", label: "Meta", content: tabContent("Meta") },
    { value: "google", label: "Google", content: tabContent("Google") },
    { value: "tiktok", label: "TikTok", content: tabContent("TikTok") },
  ];

  return (
    <PageContainer
      title="Social"
      description="Manage all social-related communications"
    >
      <TabsComponent tabs={tabs} defaultTab="meta" />
    </PageContainer>
  );
};

export default Social;
