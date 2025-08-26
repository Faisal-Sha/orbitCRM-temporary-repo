
import React from "react";

interface TypeLabelProps {
  type: string;
}

export const TypeLabel = ({ type }: TypeLabelProps) => {
  const colors: Record<string, string> = {
    intakes: "bg-green-100 text-green-900",
    followups: "bg-orange-100 text-orange-900",
    clients: "bg-blue-100 text-blue-900",
    team: "bg-purple-100 text-purple-900",
    personal: "bg-pink-100 text-pink-900"
  };
  
  const labels: Record<string, string> = {
    intakes: "Intake",
    followups: "Follow Up",
    clients: "Client",
    team: "Team",
    personal: "Personal"
  };
  
  if (type === "all") return null;
  
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[type] || "bg-gray-100 text-gray-900"}`}>
      {labels[type] || type}
    </span>
  );
};
