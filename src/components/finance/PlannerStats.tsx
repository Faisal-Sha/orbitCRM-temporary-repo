
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface PlannerStatsProps {
  summaryStats: {
    totalRevenue: number;
    totalExpenses: number;
    avgClients: number;
    totalServiceHours: number;
    costOfService: number;
    expenditure: number;
    debtTaxDepreciation: number;
  };
}

const PlannerStats = ({ summaryStats }: PlannerStatsProps) => {
  const handleDownloadPDF = () => {
    toast.success("PDF planning report download started");
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Planning Overview</h3>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Number of Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgClients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average monthly clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Service Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalServiceHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total billable hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total planned revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Cost of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.costOfService)}</div>
            <p className="text-xs text-muted-foreground">Direct service costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.expenditure)}</div>
            <p className="text-xs text-muted-foreground">Operating expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Debt, Tax, Depreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.debtTaxDepreciation)}</div>
            <p className="text-xs text-muted-foreground">Non-operating expenses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlannerStats;
