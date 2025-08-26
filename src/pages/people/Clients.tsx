
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Active from "@/components/people/clients/Active";
import Discharged from "@/components/people/clients/Discharged";
import Issues from "@/components/people/clients/Issues";

const Clients = () => {
  const tabs = [
    { value: "active", label: "Active", content: <Active /> },
    { value: "discharged", label: "Discharged", content: <Discharged /> },
    { value: "issues", label: "Issues", content: <Issues /> },
  ];

  return (
    <PageContainer
      title="Clients"
      description="Manage your current clients"
    >
      <TabsComponent tabs={tabs} defaultTab="active" />
    </PageContainer>
  );
};

export default Clients;
