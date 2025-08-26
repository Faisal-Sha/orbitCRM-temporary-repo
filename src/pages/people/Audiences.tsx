
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Groups from "@/components/people/audiences/Groups";
import Segments from "@/components/people/audiences/Segments";
import Imports from "@/components/people/audiences/Imports";

const Audiences = () => {
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <PageContainer
      title="Audiences"
      description="Manage groups, segments, and imports for targeted communication"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="imports">Imports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="space-y-4">
          <Groups />
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4">
          <Segments />
        </TabsContent>
        
        <TabsContent value="imports" className="space-y-4">
          <Imports />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Audiences;
