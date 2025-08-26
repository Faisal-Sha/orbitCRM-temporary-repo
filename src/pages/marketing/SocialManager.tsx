
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const SocialManager = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>Coming soon</p>
    </div>
  );

  const tabs = [
    { value: "meta", label: "Meta", content: tabContent("Meta") },
    { value: "google", label: "Google", content: tabContent("Google") },
    { value: "tiktok", label: "TikTok", content: tabContent("TikTok") },
  ];

  return (
    <PageContainer
      title="Social Manager"
      description="Manage your social media presence across platforms"
    >
      <TabsComponent tabs={tabs} defaultTab="meta" />
    </PageContainer>
  );
};

export default SocialManager;
