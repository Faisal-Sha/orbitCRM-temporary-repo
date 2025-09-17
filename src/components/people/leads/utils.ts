import { LeadRecord } from "@/hooks/useLeads";
import { LeadData } from "./types";

// Generate dummy interest percentages
const interestOptions = ["70%", "80%", "90%", "95%"];

// Generate dummy inquiry dates (last 30 days)
const generateDummyInquiryDate = (index: number): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  const date = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

export const transformLeadData = (leadRecords: LeadRecord[]): LeadData[] => {
  return leadRecords.map((record, index) => ({
    person_id: record.person_id,    
    id: record.lead_id,
    name: `${record.first_name} ${record.last_name}`.trim() || "Unknown Lead",
    inquiryDate: generateDummyInquiryDate(index),
    interest: interestOptions[Math.floor(Math.random() * interestOptions.length)],
    email: record.email || "No email available",
    phone: record.phone || "No phone available",
  }));
};