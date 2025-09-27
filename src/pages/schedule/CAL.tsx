import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import CalendarsTab from "@/components/schedule/cal/CalendarsTab";
import AvailabilityTab from "@/components/schedule/cal/AvailabilityTab";

const CAL = () => {
  const tabs = [
    { value: "calendars", label: "Calendars", content: <CalendarsTab /> },
    { value: "availability", label: "Availability", content: <AvailabilityTab /> },
  ];

  return (
    <PageContainer
      title="Calendars"
      description="View and manage your calendars and availability"
    >
      <TabsComponent tabs={tabs} defaultTab="calendars" />
    </PageContainer>
  );
};

export default CAL;