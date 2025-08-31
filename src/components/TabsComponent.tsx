
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  defaultTab?: string;
}

const TabsComponent = ({ tabs, defaultTab }: TabsComponentProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);
  const unsavedChangesContext = useUnsavedChanges();

  const handleTabChange = (newTabValue: string) => {
    if (newTabValue === activeTab) return;
    
    // If unsaved changes context is available, use intercept navigation
    if (unsavedChangesContext) {
      unsavedChangesContext.interceptNavigation(() => {
        setActiveTab(newTabValue);
      });
    } else {
      // No unsaved changes context, just switch tabs normally
      setActiveTab(newTabValue);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="app-tabs w-full mb-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="app-tab"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
