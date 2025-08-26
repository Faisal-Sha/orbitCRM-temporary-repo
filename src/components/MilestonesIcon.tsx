
import React from "react";
import { Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Milestone {
  completed: boolean;
  label: string;
}

export interface MilestonesIconProps {
  milestones: Milestone[];
  className?: string;
  iconSize?: number;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
}

const MilestonesIcon = ({
  milestones,
  className = "",
  iconSize = 4,
  tooltipSide = "top",
  tooltipAlign = "center",
}: MilestonesIconProps) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {milestones.map((milestone, index) => (
      <TooltipProvider key={index} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              {milestone.completed ? (
                <Check className={`h-${iconSize} w-${iconSize} text-green-500/80`} />
              ) : (
                <X className={`h-${iconSize} w-${iconSize} text-red-400/80`} />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent
            side={tooltipSide}
            align={tooltipAlign}
            className="bg-popover text-popover-foreground border"
          >
            {milestone.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ))}
  </div>
);

export default MilestonesIcon;
