
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, ListTodo, MessageCircle } from "lucide-react";

// Types: "chat" (personal), "spaces" (group), "tasks"
interface ChatSettingsModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  type: "chat" | "spaces" | "tasks";
  data?: any;
}

const DUMMY_MEMBERS = [
  { id: 1, name: "Amy Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy", type: "manager" },
  { id: 2, name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", type: "participant" },
  { id: 3, name: "Sara Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", type: "participant" },
];

const DUMMY_TASK_CATEGORIES = ["Work", "Personal", "Urgent"];
const DUMMY_PRIORITIES = ["High", "Medium", "Low"];

const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({ open, onOpenChange, type, data }) => {
  // Tab switch (Members, General, Notifications, Details)
  const [tab, setTab] = useState<"members" | "general" | "notifications" | "details">("members");
  const [members, setMembers] = useState(DUMMY_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [groupTitle, setGroupTitle] = useState(data?.name || "");
  const [groupDesc, setGroupDesc] = useState(data?.description || "");
  const [selectedCategory, setSelectedCategory] = useState(DUMMY_TASK_CATEGORIES[0]);
  const [selectedPriority, setSelectedPriority] = useState(DUMMY_PRIORITIES[0]);
  const [dueDate, setDueDate] = useState("");

  // Dummy 1-1 personal members (always show 2, no actions, just label)
  const PERSONAL_DUMMY_MEMBERS = [
    { id: 1, name: "Amy Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy" },
    { id: 2, name: "You", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You" }
  ];

  // Dummy add/remove/invite logic (just UI; no real logic)
  const filteredMembers = memberSearch
    ? members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
    : members;

  // Main content logic for each chat type
  let mainContent: React.ReactNode = null;
  // Tabs to display depend on chat type
  const navTabs =
    type === "tasks"
      ? [
          { key: "details", label: "Task Details" },
          { key: "members", label: "Members" },
          { key: "notifications", label: "Notifications" },
        ]
      : type === "spaces"
        ? [
            { key: "members", label: "Members" },
            { key: "general", label: "General" },
            { key: "notifications", label: "Notifications" },
          ]
        : [
            { key: "members", label: "Members" },
            { key: "notifications", label: "Notifications" },
          ]; // no "general" tab for personal chat

  // Members Tab
  const membersTab = type === "chat" ? (
    <div>
      <h4 className="font-medium mb-4">Participants</h4>
      <div className="space-y-2">
        {PERSONAL_DUMMY_MEMBERS.map(member => (
          <div key={member.id} className="flex items-center gap-3 p-2 rounded bg-accent/40">
            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
            <span>{member.name}</span>
            <span className="text-xs px-2 py-1 rounded bg-muted-foreground/10 text-muted-foreground ml-2">
              Participant
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Manage Members</h4>
        <Button size="sm" variant="secondary">
          Invite
        </Button>
      </div>
      <Input
        placeholder="Search members"
        className="mb-3"
        value={memberSearch}
        onChange={e => setMemberSearch(e.target.value)}
      />
      <div className="space-y-2">
        {(filteredMembers.length ? filteredMembers : []).map(member => (
          <div key={member.id} className="flex items-center justify-between rounded p-2 hover:bg-accent">
            <div className="flex gap-3 items-center">
              <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
              <span>{member.name}</span>
              <Badge variant={member.type === "manager" ? "default" : "secondary"}>
                {member.type === "manager" ? "Manager" : "Participant"}
              </Badge>
            </div>
            <div className="flex gap-1">
              {member.type === "participant" && (
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-100" tabIndex={-1}>
                  Remove
                </Button>
              )}
              {member.type === "participant" ? (
                <Button size="sm" variant="outline" className="ml-2" tabIndex={-1}>
                  Make Manager
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="text-sm text-muted-foreground text-center p-4">No members found</div>
        )}
      </div>
    </div>
  );

  // General Tab (for "spaces" only)
  const generalTab =
    type === "spaces" ? (
      <div>
        <h4 className="font-medium mb-2">General Settings</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Group Title</label>
          <Input
            placeholder="Enter group title"
            value={groupTitle}
            onChange={e => setGroupTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            placeholder="Enter description"
            value={groupDesc}
            onChange={e => setGroupDesc(e.target.value)}
          />
        </div>
      </div>
    ) : null;

  // Notifications Tab - shared
  const notificationsTab = (
    <div>
      <h4 className="font-medium mb-4">Notifications</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Mute notifications</span>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="flex items-center justify-between">
          <span>Push notifications</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span>Email updates</span>
          <input type="checkbox" className="toggle" />
        </div>
      </div>
    </div>
  );

  // Task Details Tab (for tasks)
  const taskDetailsTab =
    type === "tasks" ? (
      <div>
        <h4 className="font-medium mb-2">Task Details</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            placeholder="Task title"
            value={groupTitle}
            onChange={e => setGroupTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {DUMMY_TASK_CATEGORIES.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
          >
            {DUMMY_PRIORITIES.map(pr => (
              <option key={pr}>{pr}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>
    ) : null;

  // Select content based on tab and type
  switch (tab) {
    case "members":
      mainContent = membersTab;
      break;
    case "general":
      mainContent = type === "spaces" ? generalTab : null;
      break;
    case "notifications":
      mainContent = notificationsTab;
      break;
    case "details":
      mainContent = type === "tasks" ? taskDetailsTab : null;
      break;
    default:
      mainContent = null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Settings
          </DialogTitle>
          <DialogDescription>
            Manage your {type === "chat" ? "personal" : type === "spaces" ? "group" : "task"} chat settings
          </DialogDescription>
        </DialogHeader>
        <div className="flex border-b mb-4 space-x-1">
          {navTabs.map(t => (
            <button
              key={t.key}
              className={`px-3 py-2 font-medium text-sm outline-none hover:text-primary ${
                tab === t.key ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setTab(t.key as any)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto max-h-96">{mainContent}</div>
        <DialogFooter className="mt-4 flex flex-row-reverse">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSettingsModal;
