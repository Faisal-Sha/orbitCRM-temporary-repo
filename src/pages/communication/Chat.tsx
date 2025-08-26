
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import TeamChat from "@/components/communication/teamchat/TeamChat";

const Chat = () => {
  const tabContent = (tabName: string) => (
    <div className="app-card">
      <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
      <p>This is the {tabName.toLowerCase()} tab content for Chat communications.</p>
    </div>
  );

  const tabs = [
    { value: "personal", label: "Personal", content: <TeamChat defaultTab="chat" /> },
    { value: "group", label: "Group", content: <TeamChat defaultTab="spaces" /> },
    { value: "tasks", label: "Tasks", content: <TeamChat defaultTab="tasks" /> },
  ];

  return (
    <PageContainer
      title="Chat"
      description="Collaborate with your team members"
    >
      <TabsComponent tabs={tabs} defaultTab="personal" />
    </PageContainer>
  );
};

export default Chat;
