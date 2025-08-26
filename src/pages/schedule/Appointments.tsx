
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ListView from "@/components/appointments/ListView";
import WeekView from "@/components/appointments/WeekView";
import MonthView from "@/components/appointments/MonthView";

const Appointments = () => {
  const tabs = [
    { value: "list", label: "List", content: <ListView /> },
    { value: "week", label: "Week", content: <WeekView /> },
    { value: "month", label: "Month", content: <MonthView /> },
  ];

  return (
    <PageContainer
      title="Appointments"
      description="Schedule and manage client appointments"
    >
      <TabsComponent tabs={tabs} defaultTab="list" />
    </PageContainer>
  );
};

export default Appointments;
