
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/PageContainer";
import OrganizationsManagement from "./owner/OrganizationsManagement";

const Owner = () => {
  return (
    <PageContainer 
      title="Owner Dashboard" 
      description="Manage platform organizations and system-wide settings"
    >
      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-1 max-w-md">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations" className="mt-6">
          <OrganizationsManagement />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Owner;
