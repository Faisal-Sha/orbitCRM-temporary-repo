
import { useState, useMemo } from "react";

export interface TransactionData {
  month: string;
  totalRevenue: number;
  monthlyGrowthRate: number;
  operatingExpenses: number;
  totalNetIncome: number;
  grossMargin: number;
  newClients: number;
  totalClients: number;
  numberOfServices: number;
  numberOfProviders: number;
  serviceHoursBilled: number;
  avgHoursPerClient: number;
  avgClientsPerProvider: number;
  avgHoursPerProvider: number;
  assessmentsRevenue: number;
  cpstHoursRevenue: number;
  sudHoursRevenue: number;
  // Cost of Services
  laborServiceProviders: number;
  laborClinicians: number;
  freightPostage: number;
  otherCostServices: number;
  // Operating Expenses
  fractionalExec: number;
  fractionalContractors: number;
  payrollProcessing: number;
  rentUtilities: number;
  professionalFees: number;
  officeSupplies: number;
  advertisingCPST: number;
  advertisingSUD: number;
  insurance: number;
  technologySoftware: number;
  travelEntertainment: number;
  repairsMaintenance: number;
  permitsLicensing: number;
  uncategorizedExpenses: number;
  // Debt, Taxes, Depreciation
  businessBankingFees: number;
  businessDebtInterest: number;
  companyPayableTax: number;
  depreciationExpense: number;
}

export type DateRangeOption = "all-time" | "this-month" | "last-month" | "this-quarter" | "last-quarter" | "this-year" | "last-year" | "custom";
export type TableDateRange = "this-year" | "last-year" | "last-12-months" | "custom";

export const useTransactionsData = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>("all-time");
  const [customDateRange, setCustomDateRange] = useState<{from?: Date; to?: Date}>({});
  
  // Generate dummy data for the last 24 months
  const generateDummyData = (): TransactionData[] => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      // Base values with some variation
      const baseRevenue = 850000 + Math.random() * 150000;
      const baseExpenses = 650000 + Math.random() * 100000;
      
      months.push({
        month: monthName,
        totalRevenue: Math.round(baseRevenue),
        monthlyGrowthRate: Math.round((Math.random() * 10 - 2) * 100) / 100, // -2% to 8%
        operatingExpenses: Math.round(baseExpenses),
        totalNetIncome: Math.round(baseRevenue - baseExpenses),
        grossMargin: Math.round(((baseRevenue - baseExpenses) / baseRevenue) * 100 * 100) / 100,
        newClients: Math.floor(Math.random() * 25) + 15,
        totalClients: Math.floor(Math.random() * 50) + 200,
        numberOfServices: Math.floor(Math.random() * 20) + 25,
        numberOfProviders: Math.floor(Math.random() * 5) + 15,
        serviceHoursBilled: Math.floor(Math.random() * 500) + 2000,
        avgHoursPerClient: Math.round((Math.random() * 5 + 8) * 100) / 100,
        avgClientsPerProvider: Math.round((Math.random() * 5 + 12) * 100) / 100,
        avgHoursPerProvider: Math.round((Math.random() * 50 + 120) * 100) / 100,
        assessmentsRevenue: Math.round(baseRevenue * 0.35),
        cpstHoursRevenue: Math.round(baseRevenue * 0.4),
        sudHoursRevenue: Math.round(baseRevenue * 0.25),
        // Cost of Services
        laborServiceProviders: Math.round(baseExpenses * 0.4),
        laborClinicians: Math.round(baseExpenses * 0.15),
        freightPostage: Math.round(baseExpenses * 0.02),
        otherCostServices: Math.round(baseExpenses * 0.08),
        // Operating Expenses
        fractionalExec: Math.round(baseExpenses * 0.08),
        fractionalContractors: Math.round(baseExpenses * 0.05),
        payrollProcessing: Math.round(baseExpenses * 0.03),
        rentUtilities: Math.round(baseExpenses * 0.06),
        professionalFees: Math.round(baseExpenses * 0.04),
        officeSupplies: Math.round(baseExpenses * 0.02),
        advertisingCPST: Math.round(baseExpenses * 0.03),
        advertisingSUD: Math.round(baseExpenses * 0.025),
        insurance: Math.round(baseExpenses * 0.035),
        technologySoftware: Math.round(baseExpenses * 0.04),
        travelEntertainment: Math.round(baseExpenses * 0.015),
        repairsMaintenance: Math.round(baseExpenses * 0.02),
        permitsLicensing: Math.round(baseExpenses * 0.01),
        uncategorizedExpenses: Math.round(baseExpenses * 0.015),
        // Debt, Taxes, Depreciation
        businessBankingFees: Math.round(baseExpenses * 0.005),
        businessDebtInterest: Math.round(baseExpenses * 0.02),
        companyPayableTax: Math.round(baseExpenses * 0.08),
        depreciationExpense: Math.round(baseExpenses * 0.03),
      });
    }
    
    return months;
  };

  const transactionData = useMemo(() => generateDummyData(), []);

  const filteredData = useMemo(() => {
    if (dateRange === "all-time") return transactionData;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return transactionData.filter((item, index) => {
      const itemDate = new Date(currentYear, currentMonth - (23 - index), 1);
      
      switch (dateRange) {
        case "this-month":
          return index === 23; // Current month
        case "last-month":
          return index === 22; // Previous month
        case "this-quarter":
          return index >= 21; // Last 3 months
        case "last-quarter":
          return index >= 18 && index <= 20; // Previous quarter
        case "this-year":
          return index >= 12; // Last 12 months
        case "last-year":
          return index >= 0 && index <= 11; // Previous 12 months
        case "custom":
          if (!customDateRange.from || !customDateRange.to) return true;
          return itemDate >= customDateRange.from && itemDate <= customDateRange.to;
        default:
          return true;
      }
    });
  }, [transactionData, dateRange, customDateRange]);

  const getTableData = (tableRange: TableDateRange, customRange?: {from?: Date; to?: Date}) => {
    if (tableRange === "custom" && customRange?.from && customRange?.to) {
      // For custom range, return data based on selected months
      const months = Math.max(1, Math.ceil((customRange.to.getTime() - customRange.from.getTime()) / (30 * 24 * 60 * 60 * 1000)));
      return transactionData.slice(-Math.min(months, 24));
    }
    
    switch (tableRange) {
      case "this-year":
        return transactionData.slice(-12); // Last 12 months
      case "last-year":
        return transactionData.slice(-24, -12); // Previous 12 months
      case "last-12-months":
        return transactionData.slice(-12); // Last 12 months
      default:
        return transactionData.slice(-12);
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalExpenses = filteredData.reduce((sum, item) => sum + item.operatingExpenses, 0);
    const totalNetIncome = totalRevenue - totalExpenses;
    const avgClients = filteredData.reduce((sum, item) => sum + item.totalClients, 0) / filteredData.length;
    const totalServiceHours = filteredData.reduce((sum, item) => sum + item.serviceHoursBilled, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      totalNetIncome,
      avgClients: Math.round(avgClients),
      totalServiceHours,
      costOfService: Math.round(totalExpenses * 0.65),
      expenditure: Math.round(totalExpenses * 0.25),
      debtTaxDepreciation: Math.round(totalExpenses * 0.1),
    };
  }, [filteredData]);

  return {
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange,
    filteredData,
    getTableData,
    summaryStats,
  };
};
