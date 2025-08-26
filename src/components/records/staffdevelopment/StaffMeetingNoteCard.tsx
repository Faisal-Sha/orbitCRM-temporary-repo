
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Clock, User, Star } from "lucide-react";
import GrowthStatusIndicator from "@/components/Growthstatus";

interface StaffMeetingNoteCardProps {
  note: {
    id: string;
    date: string;
    time: string;
    duration: string;
    type: string;
    author: string;
    status: string;
    managerRating: number;
    staffRating: number;
    preview: string;
    growthStage: "foundation" | "developing" | "established";
    program: string;
  };
  onExpand: () => void;
  isExpanded: boolean;
}

const StaffMeetingNoteCard = ({ note, onExpand, isExpanded }: StaffMeetingNoteCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md cursor-pointer">
      <CardContent className="pt-6">
        <div onClick={onExpand} className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-1">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{note.date}</span>
                  <span className="text-muted-foreground">at {note.time}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {note.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {note.author}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(note.status)}>
                {note.status}
              </Badge>
            </div>
          </div>

          {/* Session Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">{note.type}</Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Growth:</span>
                <GrowthStatusIndicator growthStage={note.growthStage} showText={false} />
              </div>
              <Badge variant="secondary">{note.program}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Manager:</span>
                {renderStars(note.managerRating)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Staff:</span>
                {renderStars(note.staffRating)}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-2">{note.preview}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMeetingNoteCard;
