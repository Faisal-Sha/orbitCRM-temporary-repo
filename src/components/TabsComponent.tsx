
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (newTab: string, currentTab: string) => Promise<boolean>;
}

const TabsComponent = ({ tabs, defaultTab, onTabChange }: TabsComponentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map tab values to URL fragments
  const getFragmentFromTab = (tab: string) => {
    switch (tab) {
      case 'info': return 'profile-info';
      case 'security': return 'security';
      case 'preferences': return 'preferences';
      default: return tab;
    }
  };

  const getTabFromFragment = (fragment: string) => {
    switch (fragment) {
      case 'profile-info': return 'info';
      case 'security': return 'security';
      case 'preferences': return 'preferences';
      default: return fragment;
    }
  };

  // Initialize active tab from URL fragment or default
  const getCurrentTab = () => {
    const fragment = location.hash.replace('#', '');
    if (fragment) {
      const tab = getTabFromFragment(fragment);
      return tabs.find(t => t.value === tab) ? tab : (defaultTab || tabs[0].value);
    }
    return defaultTab || tabs[0].value;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab);

  // Update active tab when URL fragment changes
  useEffect(() => {
    const newTab = getCurrentTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.hash]);

  const handleTabChange = async (newTab: string) => {
    if (onTabChange) {
      const canSwitch = await onTabChange(newTab, activeTab);
      if (!canSwitch) return;
    }
    
    setActiveTab(newTab);
    const fragment = getFragmentFromTab(newTab);
    navigate(`#${fragment}`, { replace: true });
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
