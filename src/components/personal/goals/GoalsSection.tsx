
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalsSectionProps {
  id: string;
  title: string;
  goalCount: number;
  children: React.ReactNode;
  onAddGoal: (sectionId: string) => void;
}

const sectionBgById: Record<string, string> = {
  personal: "bg-muted",
  team: "bg-muted",
  goals: "bg-muted",
};

const GoalsSection = ({
  id,
  title,
  goalCount,
  children,
  onAddGoal
}: GoalsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 rounded-lg overflow-hidden border border-border shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 transition-colors select-none",
            sectionBgById[id] || "bg-muted"
          )}
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className={cn("text-muted-foreground transition-transform", isOpen ? "rotate-90" : "rotate-0")}>
                <ChevronRight className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <span className="text-sm text-muted-foreground">({goalCount})</span>
            </div>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 bg-white text-muted-foreground hover:text-foreground hover:bg-gray-100 border border-border"
            onClick={() => onAddGoal(id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
        <CollapsibleContent className="pt-2 pb-1 px-2">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GoalsSection;
