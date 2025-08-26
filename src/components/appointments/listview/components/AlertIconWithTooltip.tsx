
import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AlertIconWithTooltipProps {
  level: "red" | "yellow" | "grey";
}

export const AlertIconWithTooltip = ({ level }: AlertIconWithTooltipProps) => {
  let icon = null;
  let tooltipLines = [
    { label: "Appointments", value: "2" },
    { label: "Duplicates", value: "n/a", color: "" },
    { label: "Client", value: "n/a", color: "" }
  ];
  
  if (level === "red") {
    icon = <AlertCircle className="h-4 w-4" color="#ea384c" fill="#ea384c" />;
    tooltipLines = [
      { label: "Appointments", value: "2" },
      { label: "Duplicates", value: "yes", color: "text-red-600" },
      { label: "Client", value: "yes", color: "text-red-600" }
    ];
  } else if (level === "yellow") {
    icon = <AlertTriangle className="h-4 w-4" color="#f59e42" fill="#FEF7CD" />;
    tooltipLines = [
      { label: "Appointments", value: "2" },
      { label: "Duplicates", value: "yes", color: "text-red-600" },
      { label: "Client", value: "n/a", color: "" }
    ];
  } else {
    icon = <AlertCircle className="h-4 w-4" color="#8E9196" fill="#E5E7EB" />;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{icon}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-black rounded-md px-2 py-1 text-xs shadow-sm border" side="top">
          <div className="flex flex-col gap-1">
            {tooltipLines.map((item) => (
              <span key={item.label}>
                <span className="font-medium">{item.label}:</span>{" "}
                <span className={item.color || ""}>{item.value}</span>
              </span>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
