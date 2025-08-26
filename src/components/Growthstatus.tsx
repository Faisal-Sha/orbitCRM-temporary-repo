
import React from "react";
import { Star, StarHalf, Stars } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface GrowthStatusIndicatorProps {
  growthStage: "foundation" | "developing" | "established";
  showText?: boolean;
  className?: string;
}

const GrowthStatusIndicator = ({
  growthStage,
  showText = true,
  className = "",
}: GrowthStatusIndicatorProps) => {
  // Map growth stages to their display labels
  const growthLabels = {
    established: "Established",
    foundation: "Foundation",
    developing: "Developing",
  };

  // Map growth stages to their corresponding icons and colors
  const iconMap = {
    established: <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />,
    foundation: <StarHalf className="h-5 w-5 text-blue-500" />,
    developing: <Stars className="h-5 w-5 text-green-500" />,
  };

  const icon = iconMap[growthStage];
  const label = growthLabels[growthStage];

  return (
    <div className={`inline-flex items-center ${className}`}>
      {showText ? (
        <>
          <span className="inline-flex items-center justify-center">
            {icon}
          </span>
          <span className="ml-2 text-sm">{label}</span>
        </>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center justify-center">
                {icon}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-white text-black shadow-sm rounded-md px-2 py-1 text-xs"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default GrowthStatusIndicator;
