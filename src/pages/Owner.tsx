
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/PageContainer";
import AgencyManagement from "./owner/AgencyManagement";

const Owner = () => {
  return (
    <PageContainer 
      title="Owner Dashboard" 
      description="Manage platform agencies and system-wide settings"
    >
      <Tabs defaultValue="agencies" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-md">
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
        </TabsList>
        <TabsContent value="agencies" className="mt-6">
          <AgencyManagement />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Owner;
