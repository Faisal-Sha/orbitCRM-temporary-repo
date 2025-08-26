
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const Phone = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>This is the {tabName.toLowerCase()} tab content for Phone communications.</p>
    </div>
  );

  const tabs = [
    { value: "incoming", label: "Incoming", content: tabContent("Incoming") },
    { value: "outgoing", label: "Outgoing", content: tabContent("Outgoing") },
    { value: "missed", label: "Missed", content: tabContent("Missed") },
  ];

  return (
    <PageContainer
      title="Phone"
      description="Manage all phone communications"
    >
      <TabsComponent tabs={tabs} defaultTab="incoming" />
    </PageContainer>
  );
};

export default Phone;
