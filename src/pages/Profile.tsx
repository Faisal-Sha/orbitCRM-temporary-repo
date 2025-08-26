
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const Profile = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>This is the {tabName.toLowerCase()} tab content for Profile settings.</p>
    </div>
  );

  const tabs = [
    { value: "info", label: "Personal Info", content: tabContent("Personal Info") },
    { value: "security", label: "Security", content: tabContent("Security") },
    { value: "preferences", label: "Preferences", content: tabContent("Preferences") },
  ];

  return (
    <PageContainer
      title="Profile"
      description="View and update your profile information"
    >
      <TabsComponent tabs={tabs} defaultTab="info" />
    </PageContainer>
  );
};

export default Profile;
