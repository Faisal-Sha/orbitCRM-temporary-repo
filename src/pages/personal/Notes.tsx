import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import PersonalNotes from "@/components/personal/notes/PersonalNotes";
import NotesArchive from "@/components/personal/notes/NotesArchive";

const Notes = () => {
  const tabs = [
    { value: "personal", label: "My Notes", content: <PersonalNotes /> },
    {
      value: "archived",
      label: "Archived",
      // Wrap in app-card for consistent padding with Tasks
      content: (
        <div className="app-card">
          <NotesArchive />
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Notes"
      description="Capture and organize your thoughts and ideas"
    >
      <TabsComponent tabs={tabs} defaultTab="personal" />
    </PageContainer>
  );
};

export default Notes;
