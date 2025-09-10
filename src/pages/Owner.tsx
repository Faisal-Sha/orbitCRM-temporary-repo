
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/PageContainer";
import AgencyManagement from "./owner/AgencyManagement";

const Owner = () => {
  return (
    <PageContainer 
      title="Owner Dashboard" 
      description="Manage platform agencies and system-wide settings"
    >
      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-md">
          <TabsTrigger value="organizations">Agencies</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations" className="mt-6">
          <AgencyManagement />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Owner;
