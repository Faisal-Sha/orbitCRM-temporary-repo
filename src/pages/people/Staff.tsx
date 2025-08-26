
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Active from "@/components/people/staff/Active";
import Inactive from "@/components/people/staff/Inactive";

const Staff = () => {
  // Tab definitions: Active and Inactive
  const tabs = [
    { value: "active", label: "Active", content: <Active /> },
    { value: "inactive", label: "Inactive", content: <Inactive /> },
  ];

  return (
    <PageContainer
      title="Staff"
      description="Manage your team members"
    >
      <TabsComponent tabs={tabs} defaultTab="active" />
    </PageContainer>
  );
};

export default Staff;
