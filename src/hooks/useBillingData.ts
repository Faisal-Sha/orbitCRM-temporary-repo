
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface ServiceCharge {
  id: string;
  clientName: string;
  serviceProvided: string;
  provider: string;
  dateOfService: string;
  chargeAmount: number;
  status: "unbilled" | "approved" | "paid" | "rejected";
  notes: string;
  rejectionNotes?: string;
  billingCode: string;
  duration: number;
}

export const useBillingData = () => {
  // Generate 30 dummy provider names
  const allProviders = [
    "Dr. Amanda Smith", "Dr. Michael Johnson", "Therapist Sarah Brown", "Counselor David Davis",
    "Dr. Emily Wilson", "Therapist Maria Garcia", "Dr. Robert Martinez", "Counselor Lisa Taylor",
    "Dr. James Anderson", "Therapist Jennifer White", "Dr. Christopher Lee", "Counselor Michelle Clark",
    "Dr. Daniel Harris", "Therapist Nancy Lewis", "Dr. Kevin Walker", "Counselor Rachel Hall",
    "Dr. Steven Allen", "Therapist Patricia Young", "Dr. Mark King", "Counselor Susan Wright",
    "Dr. Paul Lopez", "Therapist Linda Hill", "Dr. Thomas Scott", "Counselor Carol Green",
    "Dr. Richard Adams", "Therapist Helen Baker", "Dr. Charles Nelson", "Counselor Karen Carter",
    "Dr. Joseph Mitchell", "Therapist Betty Roberts"
  ];

  // Generate dummy billing records with 2025 dates and duration-based amounts
  const generateDummyData = (): ServiceCharge[] => {
    const clients = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown", "Emily Davis", "Chris Miller", "Lisa Garcia", "Robert Taylor", "Amanda Martinez", "Kevin Lee", "Nancy White", "Daniel Harris", "Michelle Clark", "Ryan Lewis"];
    const services = ["Individual Therapy Session", "Group Therapy Session", "Assessment Consultation", "Family Therapy Session", "Psychological Testing"];
    const statuses: ("unbilled" | "approved" | "paid" | "rejected")[] = ["unbilled", "approved", "paid", "rejected"];
    const billingCodes = ["90834", "90853", "90791", "90847", "96116"];
    const durations = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    
    return Array.from({ length: 25 }, (_, i) => {
      const duration = durations[i % durations.length];
      const chargeAmount = Math.round((duration / 60) * 120); // $120 per hour base rate
      const status = statuses[i % statuses.length];
      
      return {
        id: (i + 1).toString(),
        clientName: clients[i % clients.length],
        serviceProvided: services[i % services.length],
        provider: allProviders[i % allProviders.length],
        dateOfService: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        chargeAmount,
        status,
        notes: Math.random() > 0.5 ? `Session notes for ${clients[i % clients.length]}` : "",
        rejectionNotes: status === "rejected" && Math.random() > 0.5 ? "Insufficient documentation provided" : undefined,
        billingCode: billingCodes[i % billingCodes.length],
        duration
      };
    });
  };

  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>(generateDummyData());

  const serviceTypes = [
    { name: "Individual Therapy Session", code: "90834", defaultCharge: 150, defaultDuration: 60 },
    { name: "Group Therapy Session", code: "90853", defaultCharge: 75, defaultDuration: 60 },
    { name: "Assessment Consultation", code: "90791", defaultCharge: 200, defaultDuration: 90 },
    { name: "Family Therapy Session", code: "90847", defaultCharge: 180, defaultDuration: 60 },
    { name: "Psychological Testing", code: "96116", defaultCharge: 250, defaultDuration: 120 }
  ];

  const durationOptions = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  // Date filtering logic
  const filterByDateRange = (charges: ServiceCharge[], dateRangeFilter: string, customDateRange: {from?: Date; to?: Date}) => {
    if (dateRangeFilter === "all-time") {
      return charges;
    }

    if (dateRangeFilter === "custom" && customDateRange.from && customDateRange.to) {
      return charges.filter(charge => {
        const chargeDate = new Date(charge.dateOfService);
        return chargeDate >= customDateRange.from! && chargeDate <= customDateRange.to!;
      });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return charges.filter(charge => {
      const chargeDate = new Date(charge.dateOfService);
      
      switch (dateRangeFilter) {
        case "this-month":
          return chargeDate.getFullYear() === currentYear && chargeDate.getMonth() === currentMonth;
        case "last-month":
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return chargeDate.getFullYear() === lastMonthYear && chargeDate.getMonth() === lastMonth;
        case "this-quarter":
          const currentQuarter = Math.floor(currentMonth / 3);
          const quarterStart = currentQuarter * 3;
          const quarterEnd = quarterStart + 2;
          return chargeDate.getFullYear() === currentYear && 
                 chargeDate.getMonth() >= quarterStart && 
                 chargeDate.getMonth() <= quarterEnd;
        case "last-quarter":
          const lastQuarter = Math.floor(currentMonth / 3) - 1;
          const lastQuarterStart = lastQuarter >= 0 ? lastQuarter * 3 : 9;
          const lastQuarterYear = lastQuarter >= 0 ? currentYear : currentYear - 1;
          const lastQuarterEnd = lastQuarterStart + 2;
          return chargeDate.getFullYear() === lastQuarterYear && 
                 chargeDate.getMonth() >= lastQuarterStart && 
                 chargeDate.getMonth() <= lastQuarterEnd;
        case "this-year":
          return chargeDate.getFullYear() === currentYear;
        case "last-year":
          return chargeDate.getFullYear() === currentYear - 1;
        default:
          return true;
      }
    });
  };

  const calculateChargeAmount = (duration: number) => {
    return Math.round((duration / 60) * 120); // $120 per hour base rate
  };

  return {
    serviceCharges,
    setServiceCharges,
    allProviders,
    serviceTypes,
    durationOptions,
    filterByDateRange,
    calculateChargeAmount
  };
};
