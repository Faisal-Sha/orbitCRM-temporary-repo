import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatAlertTooltipData, AlertData } from "@/utils/alertLevelCalculation";

interface AlertIconWithTooltipProps {
  level: "red" | "yellow" | "grey";
  alertData?: AlertData;
}

export const AlertIconWithTooltip = ({ level, alertData }: AlertIconWithTooltipProps) => {
  let icon = null;
  
  // Use real data if available, otherwise show defaults
  const tooltipLines = alertData 
    ? formatAlertTooltipData(alertData)
    : [
        { label: "Appointments", value: "0", color: "" },
        { label: "Rescheduled", value: "0", color: "" },
        { label: "Client", value: "No", color: "" }
      ];
  
  // Icon selection based on level
  if (level === "red") {
    icon = <AlertCircle className="h-4 w-4" color="#ea384c" fill="#ea384c" />;
  } else if (level === "yellow") {
    icon = <AlertTriangle className="h-4 w-4" color="#f59e42" fill="#FEF7CD" />;
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
