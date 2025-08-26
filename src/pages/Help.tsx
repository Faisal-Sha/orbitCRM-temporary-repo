
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";

const Help = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>This is the {tabName.toLowerCase()} tab content for Help center.</p>
    </div>
  );

  const tabs = [
    { value: "documentation", label: "Documentation", content: tabContent("Documentation") },
    { value: "faq", label: "FAQ", content: tabContent("FAQ") },
    { value: "contact", label: "Contact Support", content: tabContent("Contact Support") },
  ];

  return (
    <PageContainer
      title="Help"
      description="Find help and support resources"
    >
      <TabsComponent tabs={tabs} defaultTab="documentation" />
    </PageContainer>
  );
};

export default Help;
