
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Eye, Share } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ShareEmbedModal } from "./ShareEmbedModal";

interface CalendarCardProps {
  calendar: any;
  onToggle: (id: string) => void;
  onEdit: (calendar: any) => void;
  onDelete: (id: string) => void;
  showDeleteId: string | null;
  setShowDeleteId: (id: string | null) => void;
  showShareEmbedId: string | null;
  setShowShareEmbedId: (id: string | null) => void;
}

export function CalendarCard({
  calendar,
  onToggle,
  onEdit,
  onDelete,
  showDeleteId,
  setShowDeleteId,
  showShareEmbedId,
  setShowShareEmbedId,
}: CalendarCardProps) {
  return (
    <div
      className="flex flex-col justify-between items-stretch gap-2 p-5 rounded-xl border shadow-md bg-white min-h-[176px] min-w-[310px] relative group transition hover:shadow-lg"
      style={{
        backgroundColor: "#fff",
        borderColor: "#e5e7eb"
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="w-6 h-6 rounded-full border-2 shrink-0"
          style={{ backgroundColor: calendar.color, borderColor: calendar.color || "#ccc" }}
        />
        <div className="flex-1">
          <span className="font-semibold text-base">{calendar.title}</span>
          <Badge variant="outline" className="text-xs ml-2">{calendar.category}</Badge>
          {!calendar.enabled && (
            <span className="text-xs text-gray-400 ml-1">(disabled)</span>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[28px]">{calendar.description}</div>
      
      {/* Actions Row: Switch on left, all icons in a flex row on the right */}
      <div className="flex mt-2 items-center gap-2 justify-between">
        {/* Switch LEFT */}
        <Switch checked={calendar.enabled} onCheckedChange={() => onToggle(calendar.id)} />
        {/* Actions RIGHT */}
        <div className="flex flex-row gap-2 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full"
                onClick={() => setShowShareEmbedId(calendar.id)}
              >
                <Share size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">
              Share & Embed
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => onEdit(calendar)}
              >
                <Settings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">
              Settings
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => window.open('/schedule/calendar/preview/', "_blank")}
              >
                <Eye size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">
              Preview
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => setShowDeleteId(calendar.id)}
              >
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">
              Delete
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Delete dialog */}
      {showDeleteId === calendar.id && (
        <ConfirmDeleteDialog
          open={true}
          onOpenChange={() => setShowDeleteId(null)}
          onConfirm={() => onDelete(calendar.id)}
        />
      )}
      
      <ShareEmbedModal
        open={showShareEmbedId === calendar.id}
        onClose={() => setShowShareEmbedId(null)}
        calendar={calendar}
      />
    </div>
  );
}
