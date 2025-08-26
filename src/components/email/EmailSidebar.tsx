
import { Folder, Star, Send, FileText, Archive, Trash, AlertOctagon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const labelColors = [
  { name: "Partnerships", color: "bg-blue-500" },
  { name: "Marketing", color: "bg-green-500" },
];

// Status labels (category requested)
const statusLabels = [
  { name: "Active Client", color: "bg-blue-600" },
  { name: "Discharged", color: "bg-gray-400" },
  { name: "Application", color: "bg-indigo-500" },
  { name: "Verified", color: "bg-emerald-600" },
  { name: "Scheduled", color: "bg-yellow-500" },
  { name: "Partner", color: "bg-pink-600" },
  { name: "Staff", color: "bg-teal-500" },
  { name: "General", color: "bg-gray-300" },
];

const EmailSidebar = ({ onCompose }: { onCompose: () => void }) => {
  return (
    <div className="w-[204.8px] border-r h-full overflow-y-auto bg-muted/20 flex flex-col" /* reduced width from 256px (w-64) by 20% */>
      {/* Compose button */}
      <div className="p-3 pb-0">
        <Button 
          className="w-full mb-4 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold gap-2 transition-colors rounded-lg"
          onClick={onCompose}
        >
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </div>

      {/* Main Folders */}
      <div className="p-3 pt-0">
        <ul className="space-y-1">
          <li className="flex items-center justify-between px-3 py-2 text-sm rounded-md bg-muted/50 font-medium text-primary">
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4" />
              <span>Inbox</span>
            </div>
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">12</span>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </div>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Sent</span>
            </div>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Drafts</span>
            </div>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <Archive className="h-4 w-4" />
              <span>Archived</span>
            </div>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <Trash className="h-4 w-4" />
              <span>Trash</span>
            </div>
          </li>
          <li className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="h-4 w-4" />
              <span>Spam</span>
            </div>
            <span className="bg-muted text-muted-foreground text-xs rounded-full px-2">3</span>
          </li>
        </ul>
      </div>

      {/* Client Issues Section */}
      <div className="p-3 border-t">
        <h3 className="text-xs uppercase font-semibold mb-2 px-3 text-muted-foreground">Client Issues</h3>
        <ul className="space-y-1">
          <li className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <span>Opened</span>
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">4</span>
          </li>
          <li className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50">
            <span>Closed</span>
          </li>
        </ul>
      </div>

      {/* Labels Section */}
      <div className="p-3 border-t">
        <h3 className="text-xs uppercase font-semibold mb-2 px-3 text-muted-foreground">Labels</h3>
        <ul className="space-y-1">
          {labelColors.map(label => (
            <li
              key={label.name}
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${label.color}`}></div>
              <span>{label.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* STATUS Section */}
      <div className="p-3 border-t mt-auto">
        <h3 className="text-xs uppercase font-semibold mb-2 px-3 text-muted-foreground">Status</h3>
        <ul className="space-y-1">
          {statusLabels.map(label => (
            <li
              key={label.name}
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted/50"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${label.color}`}></div>
              <span>{label.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailSidebar;
