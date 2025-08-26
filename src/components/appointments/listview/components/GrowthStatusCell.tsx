
import React from "react";
import GrowthStatusIndicator from "@/components/Growthstatus";

interface GrowthStatusCellProps {
  stage: "foundation" | "developing" | "established";
}

export const GrowthStatusCell = ({ stage }: GrowthStatusCellProps) => (
  <GrowthStatusIndicator growthStage={stage} showText={false} className="ml-1" />
);
