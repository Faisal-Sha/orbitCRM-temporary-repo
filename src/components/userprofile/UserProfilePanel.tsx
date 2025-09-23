import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusLabel } from "@/components/ui/status-label";
import { User, Brain, BarChart3, FileText, MessageSquare, Activity as ActivityIcon } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import GeneralTab from "./GeneralTab";
import PerformanceTab from "./PerformanceTab";
import RecordsTab from "./RecordsTab";
import CommentsTab from "./CommentsTab";
import ActivityTab from "./ActivityTab";
import CompanionedAIChat from "../CompanionedAIChat";

const panelStyle: React.CSSProperties = {
  width: "50vw",
  minWidth: 350,
  maxWidth: "none",
  height: "100vh",
};

interface UserProfilePanelProps {
  open: boolean;
  onClose: () => void;
  user: {
    person_id: string;
    name: string;
    interest?: string;
    status?: string;
    inquiryDate?: string;
    email?: string;
    phone?: string;
  } | null;
}

const tabsConfig = [
  { key: "general", icon: null, label: "General", component: GeneralTab },
  { key: "performance", icon: null, label: "Performance", component: PerformanceTab },
  { key: "records", icon: null, label: "Records", component: RecordsTab },
  { key: "comments", icon: null, label: "Conversations", component: CommentsTab },
  { key: "activity", icon: null, label: "Activity", component: ActivityTab },
  { key: "companionai", icon: null, label: "CompanionedAI", component: ({ user }: { user: any }) => <CompanionedAIChat /> },
];

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ open, onClose, user }) => {
  const [activeTab, setActiveTab] = React.useState(tabsConfig[0].key);
  
  // Use useUserProfile hook to get dynamic status updates
  const { data: profileData } = useUserProfile(user?.person_id);
  
  // Get current status from profile data, fallback to user prop
  const currentStatus = profileData?.personalInfo?.status || user?.status;

  React.useEffect(() => {
    if (!open) setActiveTab(tabsConfig[0].key);
  }, [open]);

  if (!user) return null;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={val => !val && onClose()}>
      <SheetContent
        side="right"
        className="!w-[50vw] max-w-none h-screen border-l flex flex-col p-0 transition-all duration-500 data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
        style={panelStyle}
      >
        {/* User info header */}
        <div className="px-6 pt-6 pb-4 border-b flex items-center gap-4 shrink-0">
          <div className="h-14 w-14 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{user.name}</span>
              <StatusLabel status={currentStatus} />
            </div>
            <span className="text-xs text-muted-foreground">{user.inquiryDate && `Inquiry: ${user.inquiryDate}`}</span>
          </div>
        </div>

        {/* Tabs navigation and content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* TABS LIST WITHOUT ICONS */}
          <div className="px-6 bg-background border-b shrink-0">
            <TabsList className="mt-4 mb-2 h-10 flex w-full overflow-visible gap-1 min-w-0">
              {tabsConfig.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary
                                rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0"
                  style={{
                    flex: "1 1 0",
                  }}
                >
                  {/* removed icon */}
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabsConfig.map((tab) => {
            const TabComponent = tab.component;

            if (tab.key === "general") {
              return (
                <TabsContent
                  key={tab.key}
                  value={tab.key}
                  className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4"
                >
                  <GeneralTab personId={user.person_id} />
                </TabsContent>
              );
            }

            return (
              <TabsContent
                key={tab.key}
                value={tab.key}
                className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4"
              >
                <TabComponent user={user} />
              </TabsContent>
            );
          })}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfilePanel;
