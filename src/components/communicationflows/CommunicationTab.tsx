
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FlowsBuilder } from "./flowsbuilder";
import { CommunicationTemplates } from "./templates";

interface CommunicationTabProps {
  editing: any;
  setEditing: (editing: any) => void;
  customFields: any[];
  context?: 'calendar' | 'form';
  formData?: any;
  updateFormDataWithHistory?: (data: any, actionType: string, description: string) => void;
}

export function CommunicationTab({
  editing,
  setEditing,
  customFields,
  context = 'calendar',
  formData,
  updateFormDataWithHistory,
}: CommunicationTabProps) {
  const [communicationFlows, setCommunicationFlows] = useState(editing.communicationFlows || []);
  const [communicationTemplates, setCommunicationTemplates] = useState(editing.communicationTemplates || []);

  const updateCommunicationFlows = (flows: any[]) => {
    setCommunicationFlows(flows);
    const newEditing = {
      ...editing,
      communicationFlows: flows
    };
    setEditing(newEditing);
  };

  const updateCommunicationTemplates = (templates: any[]) => {
    setCommunicationTemplates(templates);
    const newEditing = {
      ...editing,
      communicationTemplates: templates
    };
    setEditing(newEditing);
  };

  return (
    <Tabs defaultValue="flows" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="flows">Flows</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="flows" className="mt-0">
        <FlowsBuilder
          flows={communicationFlows}
          setFlows={updateCommunicationFlows}
          templates={communicationTemplates}
          customFields={customFields}
          context={context}
          formData={formData}
          updateFormDataWithHistory={updateFormDataWithHistory}
        />
      </TabsContent>
      
      <TabsContent value="templates" className="mt-0">
        <CommunicationTemplates
          templates={communicationTemplates}
          setTemplates={updateCommunicationTemplates}
          customFields={customFields}
          context={context}
          formData={formData}
          updateFormDataWithHistory={updateFormDataWithHistory}
        />
      </TabsContent>
    </Tabs>
  );
}
