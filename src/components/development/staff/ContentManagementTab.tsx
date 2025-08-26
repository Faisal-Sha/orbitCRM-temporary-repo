
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Onboarding from "../Onboarding";
import Training from "../Training";
import Certificates from "../Certificates";

const ContentManagementTab = () => {
  return (
    <div className="app-card space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Build and manage staff development content, training modules, and certification programs
          </p>
        </CardHeader>
      </Card>

      {/* Content Management Tabs */}
      <Tabs defaultValue="onboarding" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="onboarding">Onboarding Builder</TabsTrigger>
          <TabsTrigger value="training">Training Builder</TabsTrigger>
          <TabsTrigger value="certificates">Certificate Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="space-y-6">
          <Onboarding type="staff" />
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Training type="staff" />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Certificates type="staff" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementTab;
