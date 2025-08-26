
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Settings, Trash, MoreVertical, ListTodo, Users, MessageCircle } from "lucide-react";
import { Archive } from "lucide-react";
import { getStatusColor } from "./TeamChatShared";
import ChatSettingsModal from "./ChatSettingsModal";

export interface TeamChatHeaderProps {
  type: "chat" | "spaces" | "tasks";
  data?: any; // group, user, or task
  onMarkDone?: () => void;
  onArchive?: () => void;
}

const TeamChatHeader = ({ type, data, onMarkDone, onArchive }: TeamChatHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  return (
    <div className="border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar / Icon */}
        {type === "chat" && data?.avatar && (
          <div className="relative">
            <img src={data.avatar} alt={data.name} className="w-8 h-8 rounded-full" />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(data.status)}`}
            />
          </div>
        )}
        {type === "spaces" && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
        )}
        {type === "tasks" && data?.isFollowUp && (
          <div className="relative">
            <img src={data.contactAvatar} alt={data.contactName} className="w-8 h-8 rounded-full" />
          </div>
        )}
        {type === "tasks" && !data?.isFollowUp && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <ListTodo className="h-5 w-5 text-primary" />
          </div>
        )}

        {/* Name, description, etc */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">
              {type === "chat"
                ? data?.name
                : type === "spaces"
                  ? data?.name
                  : data?.title}
            </h2>
            {type === "spaces" && (
              <Badge variant="secondary">
                {data?.members} members
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {type === "chat"
              ? data?.lastActive
              : type === "spaces"
                ? data?.description
                : data?.description ||
                  (data?.isFollowUp
                    ? `Follow up with ${data?.contactName}`
                    : "Task details")}
          </p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* For tasks, mark done & archive buttons remain, but no 'Info' icon */}
        {type === "tasks" && (
          <>
            <Button variant="outline" size="sm" onClick={onMarkDone} className="flex items-center gap-1">
              {/* Mark as done icon beside text */}
              <ListTodo className="h-4 w-4" />
              <span>Mark Done</span>
            </Button>
            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent group"
                onClick={() => setShowArchive(true)}
                tabIndex={0}
                aria-label="Archive"
              >
                <Archive className="h-5 w-5 text-gray-700 group-hover:text-primary" />
              </Button>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-50">
                <div className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg">
                  Archive
                </div>
              </div>
            </div>
          </>
        )}

        {/* Only the menu (MoreVertical) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={() => {
                setShowSettings(true);
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {/* You could add a separator if needed */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 focus:text-red-700"
              onSelect={() => setShowDelete(true)}
            >
              <Trash className="h-4 w-4" />
              <span>Delete conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <ChatSettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          type={type}
          data={data}
        />
      )}
      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setShowDelete(false)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Archive Confirmation Modal - consistent to Delete modal */}
      <AlertDialog open={showArchive} onOpenChange={setShowArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this task? You can restore it later from archived tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setShowArchive(false);
                if (onArchive) onArchive();
              }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamChatHeader;
