
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface CostsProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const Costs: React.FC<CostsProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Total Costs & Expenditure", value: "$1,923,847", change: "+8%", trend: "up", icon: DollarSign },
    { title: "Costs of Services", value: "$1,284,560", change: "+12%", trend: "up", icon: TrendingUp },
    { title: "Operating Expenses", value: "$547,287", change: "+5%", trend: "up", icon: TrendingUp },
    { title: "Debt, Tax, Depreciation", value: "$92,000", change: "-2%", trend: "down", icon: TrendingDown },
  ];

  // Chart data
  const chartData = [
    { 
      month: 'Jan', 
      totalCosts: 142000, 
      costsOfServices: 95000, 
      operatingExpenses: 38000, 
      debtTaxDepreciation: 9000 
    },
    { 
      month: 'Feb', 
      totalCosts: 156000, 
      costsOfServices: 104000, 
      operatingExpenses: 42000, 
      debtTaxDepreciation: 10000 
    },
    { 
      month: 'Mar', 
      totalCosts: 148000, 
      costsOfServices: 99000, 
      operatingExpenses: 40000, 
      debtTaxDepreciation: 9000 
    },
    { 
      month: 'Apr', 
      totalCosts: 164000, 
      costsOfServices: 109000, 
      operatingExpenses: 45000, 
      debtTaxDepreciation: 10000 
    },
    { 
      month: 'May', 
      totalCosts: 170000, 
      costsOfServices: 113000, 
      operatingExpenses: 47000, 
      debtTaxDepreciation: 10000 
    },
    { 
      month: 'Jun', 
      totalCosts: 176000, 
      costsOfServices: 117000, 
      operatingExpenses: 49000, 
      debtTaxDepreciation: 10000 
    }
  ];

  const chartSeries = [
    { dataKey: 'costsOfServices', name: 'Costs of Services', color: '#ef4444' },
    { dataKey: 'operatingExpenses', name: 'Operating Expenses', color: '#f59e0b' },
    { dataKey: 'debtTaxDepreciation', name: 'Debt, Tax, Depreciation', color: '#6366f1' }
  ];

  // Comprehensive table data with proper categorization
  const tableData = [
    { metric: "Total Costs & Expenditure", jan: "$142K", feb: "$156K", mar: "$148K", apr: "$164K", may: "$170K", jun: "$176K", jul: "$182K", aug: "$188K", sep: "$194K", oct: "$200K", nov: "$206K", dec: "$212K" },
    { metric: "--- COSTS OF SERVICES ---", jan: "---", feb: "---", mar: "---", apr: "---", may: "---", jun: "---", jul: "---", aug: "---", sep: "---", oct: "---", nov: "---", dec: "---" },
    { metric: "Costs of Services (category)", jan: "$95K", feb: "$104K", mar: "$99K", apr: "$109K", may: "$113K", jun: "$117K", jul: "$121K", aug: "$125K", sep: "$129K", oct: "$133K", nov: "$137K", dec: "$141K" },
    { metric: "Labor – Service Providers", jan: "$62K", feb: "$68K", mar: "$65K", apr: "$71K", may: "$74K", jun: "$76K", jul: "$79K", aug: "$82K", sep: "$84K", oct: "$87K", nov: "$90K", dec: "$92K" },
    { metric: "Labor – Clinicians", jan: "$28K", feb: "$31K", mar: "$29K", apr: "$32K", may: "$33K", jun: "$35K", jul: "$36K", aug: "$37K", sep: "$39K", oct: "$40K", nov: "$41K", dec: "$43K" },
    { metric: "General – Freight & Postage", jan: "$3K", feb: "$3K", mar: "$3K", apr: "$4K", may: "$4K", jun: "$4K", jul: "$4K", aug: "$4K", sep: "$4K", oct: "$4K", nov: "$4K", dec: "$4K" },
    { metric: "Other costs of services", jan: "$2K", feb: "$2K", mar: "$2K", apr: "$2K", may: "$2K", jun: "$2K", jul: "$2K", aug: "$2K", sep: "$2K", oct: "$2K", nov: "$2K", dec: "$2K" },
    { metric: "--- OPERATING EXPENSES ---", jan: "---", feb: "---", mar: "---", apr: "---", may: "---", jun: "---", jul: "---", aug: "---", sep: "---", oct: "---", nov: "---", dec: "---" },
    { metric: "Operating Expenses (category)", jan: "$38K", feb: "$42K", mar: "$40K", apr: "$45K", may: "$47K", jun: "$49K", jul: "$51K", aug: "$53K", sep: "$55K", oct: "$57K", nov: "$59K", dec: "$61K" },
    { metric: "Fractional Exec", jan: "$8K", feb: "$8K", mar: "$8K", apr: "$9K", may: "$9K", jun: "$9K", jul: "$10K", aug: "$10K", sep: "$10K", oct: "$11K", nov: "$11K", dec: "$11K" },
    { metric: "Fractional Contractors", jan: "$6K", feb: "$7K", mar: "$6K", apr: "$7K", may: "$8K", jun: "$8K", jul: "$8K", aug: "$9K", sep: "$9K", oct: "$9K", nov: "$10K", dec: "$10K" },
    { metric: "Payroll Processing Expenses", jan: "$2K", feb: "$2K", mar: "$2K", apr: "$2K", may: "$2K", jun: "$2K", jul: "$3K", aug: "$3K", sep: "$3K", oct: "$3K", nov: "$3K", dec: "$3K" },
    { metric: "Rent & Utilities", jan: "$12K", feb: "$12K", mar: "$12K", apr: "$13K", may: "$13K", jun: "$13K", jul: "$13K", aug: "$14K", sep: "$14K", oct: "$14K", nov: "$15K", dec: "$15K" },
    { metric: "Professional Fees & Services", jan: "$3K", feb: "$4K", mar: "$3K", apr: "$4K", may: "$4K", jun: "$5K", jul: "$5K", aug: "$5K", sep: "$5K", oct: "$6K", nov: "$6K", dec: "$6K" },
    { metric: "Office Supplies & Expenses", jan: "$1K", feb: "$2K", mar: "$1K", apr: "$2K", may: "$2K", jun: "$2K", jul: "$2K", aug: "$2K", sep: "$2K", oct: "$2K", nov: "$3K", dec: "$3K" },
    { metric: "Advertising – CPST", jan: "$2K", feb: "$3K", mar: "$3K", apr: "$3K", may: "$3K", jun: "$4K", jul: "$4K", aug: "$4K", sep: "$4K", oct: "$4K", nov: "$4K", dec: "$5K" },
    { metric: "Advertising – SUD", jan: "$2K", feb: "$3K", mar: "$3K", apr: "$3K", may: "$3K", jun: "$4K", jul: "$4K", aug: "$4K", sep: "$4K", oct: "$4K", nov: "$4K", dec: "$5K" },
    { metric: "Insurance", jan: "$1K", feb: "$1K", mar: "$1K", apr: "$1K", may: "$1K", jun: "$1K", jul: "$1K", aug: "$1K", sep: "$2K", oct: "$2K", nov: "$2K", dec: "$2K" },
    { metric: "Technology & Software", jan: "$1K", feb: "$1K", mar: "$1K", apr: "$1K", may: "$1K", jun: "$1K", jul: "$1K", aug: "$1K", sep: "$1K", oct: "$1K", nov: "$1K", dec: "$1K" },
    { metric: "Travel & Entertainment", jan: "$0K", feb: "$0K", mar: "$0K", apr: "$0K", may: "$1K", jun: "$1K", jul: "$1K", aug: "$1K", sep: "$1K", oct: "$1K", nov: "$1K", dec: "$1K" },
    { metric: "Repairs & Maintenance", jan: "$0K", feb: "$0K", mar: "$0K", apr: "$1K", may: "$1K", jun: "$1K", jul: "$1K", aug: "$1K", sep: "$1K", oct: "$1K", nov: "$1K", dec: "$1K" },
    { metric: "Permits & Licensing", jan: "$0K", feb: "$0K", mar: "$0K", apr: "$0K", may: "$0K", jun: "$0K", jul: "$0K", aug: "$0K", sep: "$0K", oct: "$1K", nov: "$1K", dec: "$1K" },
    { metric: "Uncategorized Expenses", jan: "$0K", feb: "$1K", mar: "$0K", apr: "$1K", may: "$1K", jun: "$1K", jul: "$1K", aug: "$1K", sep: "$1K", oct: "$1K", nov: "$1K", dec: "$1K" },
    { metric: "--- DEBT, TAXES, DEPRECIATION ---", jan: "---", feb: "---", mar: "---", apr: "---", may: "---", jun: "---", jul: "---", aug: "---", sep: "---", oct: "---", nov: "---", dec: "---" },
    { metric: "Debt, Taxes, Depreciation (category)", jan: "$9K", feb: "$10K", mar: "$9K", apr: "$10K", may: "$10K", jun: "$10K", jul: "$10K", aug: "$10K", sep: "$10K", oct: "$10K", nov: "$10K", dec: "$10K" },
    { metric: "Business Banking Fees", jan: "$0.2K", feb: "$0.3K", mar: "$0.2K", apr: "$0.3K", may: "$0.3K", jun: "$0.3K", jul: "$0.4K", aug: "$0.4K", sep: "$0.4K", oct: "$0.4K", nov: "$0.4K", dec: "$0.4K" },
    { metric: "Business Debt Interest", jan: "$2K", feb: "$2K", mar: "$2K", apr: "$2K", may: "$2K", jun: "$2K", jul: "$2K", aug: "$2K", sep: "$2K", oct: "$2K", nov: "$2K", dec: "$2K" },
    { metric: "Company Payable Tax (paid)", jan: "$4K", feb: "$5K", mar: "$4K", apr: "$5K", may: "$5K", jun: "$5K", jul: "$5K", aug: "$5K", sep: "$5K", oct: "$5K", nov: "$5K", dec: "$5K" },
    { metric: "Depreciation Expense", jan: "$3K", feb: "$3K", mar: "$3K", apr: "$3K", may: "$3K", jun: "$3K", jul: "$3K", aug: "$3K", sep: "$3K", oct: "$3K", nov: "$3K", dec: "$3K" },
  ];

  return (
    <div className="space-y-6">
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetData.map((widget, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <widget.icon className={`h-4 w-4 ${widget.trend === 'up' ? 'text-red-600' : 'text-green-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              <p className={`text-xs ${widget.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                {widget.change} vs. Previous Period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={chartData}
          series={chartSeries}
          xAxisDataKey="month"
          chartTitle="Cost Breakdown by Category"
          height={300}
        />
        <LineChart
          data={chartData}
          series={[{ dataKey: 'totalCosts', name: 'Total Costs', color: '#dc2626' }]}
          xAxisDataKey="month"
          chartTitle="Total Costs Trend"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Costs Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Analysis</CardTitle>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Cost Category</TableHead>
                  <TableHead>Jan</TableHead>
                  <TableHead>Feb</TableHead>
                  <TableHead>Mar</TableHead>
                  <TableHead>Apr</TableHead>
                  <TableHead>May</TableHead>
                  <TableHead>Jun</TableHead>
                  <TableHead>Jul</TableHead>
                  <TableHead>Aug</TableHead>
                  <TableHead>Sep</TableHead>
                  <TableHead>Oct</TableHead>
                  <TableHead>Nov</TableHead>
                  <TableHead>Dec</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index} className={row.metric.includes('---') ? 'bg-muted/50 font-semibold' : ''}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell>{row.jan}</TableCell>
                    <TableCell>{row.feb}</TableCell>
                    <TableCell>{row.mar}</TableCell>
                    <TableCell>{row.apr}</TableCell>
                    <TableCell>{row.may}</TableCell>
                    <TableCell>{row.jun}</TableCell>
                    <TableCell>{row.jul}</TableCell>
                    <TableCell>{row.aug}</TableCell>
                    <TableCell>{row.sep}</TableCell>
                    <TableCell>{row.oct}</TableCell>
                    <TableCell>{row.nov}</TableCell>
                    <TableCell>{row.dec}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Costs;
