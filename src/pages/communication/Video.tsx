
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const Video = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>This is the {tabName.toLowerCase()} tab content for Video communications.</p>
    </div>
  );

  const tabs = [
    { value: "scheduled", label: "Scheduled", content: tabContent("Scheduled") },
    { value: "active", label: "Active", content: tabContent("Active") },
    { value: "recordings", label: "Recordings", content: tabContent("Recordings") },
  ];

  return (
    <PageContainer
      title="Video"
      description="Manage video conferences and meetings"
    >
      <TabsComponent tabs={tabs} defaultTab="scheduled" />
    </PageContainer>
  );
};

export default Video;
