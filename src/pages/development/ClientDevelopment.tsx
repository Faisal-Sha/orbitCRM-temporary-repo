
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ClientsTab from "@/components/development/clients/ClientsTab";
import ContentManagementTab from "@/components/development/clients/ContentManagementTab";

const ClientDevelopment = () => {
  const tabs = [
    { value: "clients", label: "Clients", content: <ClientsTab /> },
    { value: "content-management", label: "Content Management", content: <ContentManagementTab /> },
  ];

  return (
    <PageContainer title="Client Development" description="Supervisor dashboard for managing client development">
      <TabsComponent tabs={tabs} defaultTab="clients" />
    </PageContainer>
  );
};

export default ClientDevelopment;
