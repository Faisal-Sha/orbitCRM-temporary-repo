
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface StatsCardProps {
  title: string;
  planned: number;
  actual: number;
  format?: "currency" | "number" | "percentage";
}

const StatsCard = ({ title, planned, actual, format = "currency" }: StatsCardProps) => {
  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const difference = ((actual - planned) / planned) * 100;
  const isPositive = difference > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-muted-foreground">Planned</div>
            <div className="text-lg font-semibold">{formatValue(planned)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Actual</div>
            <div className="text-lg font-semibold">{formatValue(actual)}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {Math.abs(difference).toFixed(1)}% vs planned
        </div>
      </CardContent>
    </Card>
  );
};

interface TransactionsStatsProps {
  summaryStats: {
    totalRevenue: number;
    totalExpenses: number;
    totalNetIncome: number;
    avgClients: number;
    totalServiceHours: number;
    costOfService: number;
    expenditure: number;
    debtTaxDepreciation: number;
  };
}

const TransactionsStats = ({ summaryStats }: TransactionsStatsProps) => {
  const handleDownloadPDF = () => {
    toast.success("PDF report download started");
  };

  // Generate planned values (slightly different from actual for demo)
  const plannedStats = {
    clients: Math.round(summaryStats.avgClients * 0.95),
    serviceHours: Math.round(summaryStats.totalServiceHours * 0.98),
    revenue: Math.round(summaryStats.totalRevenue * 0.92),
    costOfService: Math.round(summaryStats.costOfService * 1.05),
    expenditure: Math.round(summaryStats.expenditure * 1.08),
    debtTaxDepreciation: Math.round(summaryStats.debtTaxDepreciation * 0.95),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Performance Overview</h3>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Number of Clients"
          planned={plannedStats.clients}
          actual={summaryStats.avgClients}
          format="number"
        />
        <StatsCard
          title="Service Hours"
          planned={plannedStats.serviceHours}
          actual={summaryStats.totalServiceHours}
          format="number"
        />
        <StatsCard
          title="Revenue"
          planned={plannedStats.revenue}
          actual={summaryStats.totalRevenue}
          format="currency"
        />
        <StatsCard
          title="Cost of Service"
          planned={plannedStats.costOfService}
          actual={summaryStats.costOfService}
          format="currency"
        />
        <StatsCard
          title="Expenditure"
          planned={plannedStats.expenditure}
          actual={summaryStats.expenditure}
          format="currency"
        />
        <StatsCard
          title="Debt, Tax, Depreciation"
          planned={plannedStats.debtTaxDepreciation}
          actual={summaryStats.debtTaxDepreciation}
          format="currency"
        />
      </div>
    </div>
  );
};

export default TransactionsStats;
