
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import CalendarManagement from "@/components/appointments/CalendarManagement";
import AvailabilityManagement from "@/components/appointments/AvailabilityManagement";

const Calendar = () => {
  const tabs = [
    { value: "day", label: "Calendars", content: <CalendarManagement /> },
    { value: "week", label: "Availability", content: <AvailabilityManagement /> },
  ];

  return (
    <PageContainer
      title="Calendar"
      description="View and manage your calendar events"
    >
      <TabsComponent tabs={tabs} defaultTab="day" />
    </PageContainer>
  );
};

export default Calendar;
