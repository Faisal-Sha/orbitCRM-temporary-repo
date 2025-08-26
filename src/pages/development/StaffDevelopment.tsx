
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import StaffTab from "@/components/development/staff/StaffTab";
import ContentManagementTab from "@/components/development/staff/ContentManagementTab";

const StaffDevelopment = () => {
  const tabs = [
    { value: "staff", label: "Staff", content: <StaffTab /> },
    { value: "content", label: "Content Management", content: <ContentManagementTab /> },
  ];

  return (
    <PageContainer title="Staff Development" description="Staff development tools and resources">
      <TabsComponent tabs={tabs} defaultTab="staff" />
    </PageContainer>
  );
};

export default StaffDevelopment;
