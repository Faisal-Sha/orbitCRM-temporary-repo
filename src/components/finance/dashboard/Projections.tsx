
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download, TrendingUp, Users, DollarSign, BarChart3, Target, Calculator, Clock } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";

interface ProjectionsProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const Projections: React.FC<ProjectionsProps> = ({ dateRange, customDateRange }) => {
  const [clientGrowth, setClientGrowth] = useState([20]);
  const [cacReduction, setCacReduction] = useState([10]);
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Dummy data for widgets
  const widgetData = [
    { title: "New Clients (Next 12M)", value: "1,247", change: "+23%", trend: "up", icon: Users },
    { title: "Total Clients (Projected)", value: "2,494", change: "+100%", trend: "up", icon: Users },
    { title: "Marketing Spend (Next 12M)", value: "$324,000", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Revenue Forecast (3M)", value: "$847,500", change: "+18%", trend: "up", icon: TrendingUp },
    { title: "Revenue Forecast (6M)", value: "$1,695,000", change: "+20%", trend: "up", icon: TrendingUp },
    { title: "Revenue Forecast (12M)", value: "$3,540,000", change: "+24%", trend: "up", icon: TrendingUp },
    { title: "Break-even Analysis", value: "14 months", change: "On track", trend: "up", icon: Target },
    { title: "Projected Runway", value: "24 months", change: "+6 months", trend: "up", icon: Clock },
  ];

  // Projection chart data
  const projectionData = [
    { month: 'Jul 24', conservative: 270000, optimistic: 285000, historical: 255000 },
    { month: 'Aug 24', conservative: 285000, optimistic: 305000, historical: 285000 },
    { month: 'Sep 24', conservative: 295000, optimistic: 320000, historical: 290000 },
    { month: 'Oct 24', conservative: 310000, optimistic: 340000, historical: 305000 },
    { month: 'Nov 24', conservative: 325000, optimistic: 360000, historical: 320000 },
    { month: 'Dec 24', conservative: 340000, optimistic: 380000, historical: 335000 },
    { month: 'Jan 25', conservative: 355000, optimistic: 400000, historical: null },
    { month: 'Feb 25', conservative: 370000, optimistic: 425000, historical: null },
    { month: 'Mar 25', conservative: 385000, optimistic: 450000, historical: null },
    { month: 'Apr 25', conservative: 400000, optimistic: 475000, historical: null },
    { month: 'May 25', conservative: 415000, optimistic: 500000, historical: null },
    { month: 'Jun 25', conservative: 430000, optimistic: 525000, historical: null },
  ];

  const clientProjectionData = [
    { month: 'Jul 24', newClients: 89, totalClients: 1247 },
    { month: 'Aug 24', newClients: 94, totalClients: 1341 },
    { month: 'Sep 24', newClients: 98, totalClients: 1439 },
    { month: 'Oct 25', newClients: 102, totalClients: 1541 },
    { month: 'Nov 24', newClients: 106, totalClients: 1647 },
    { month: 'Dec 24', newClients: 110, totalClients: 1757 },
    { month: 'Jan 25', newClients: 115, totalClients: 1872 },
    { month: 'Feb 25', newClients: 120, totalClients: 1992 },
    { month: 'Mar 25', newClients: 125, totalClients: 2117 },
    { month: 'Apr 25', newClients: 130, totalClients: 2247 },
    { month: 'May 25', newClients: 135, totalClients: 2382 },
    { month: 'Jun 25', newClients: 140, totalClients: 2522 },
  ];

  const expenseProjectionData = [
    { month: 'Jul 24', conservative: 182000, optimistic: 195000 },
    { month: 'Aug 24', conservative: 188000, optimistic: 205000 },
    { month: 'Sep 24', conservative: 194000, optimistic: 215000 },
    { month: 'Oct 24', conservative: 200000, optimistic: 225000 },
    { month: 'Nov 24', conservative: 206000, optimistic: 235000 },
    { month: 'Dec 24', conservative: 212000, optimistic: 245000 },
    { month: 'Jan 25', conservative: 218000, optimistic: 255000 },
    { month: 'Feb 25', conservative: 224000, optimistic: 265000 },
    { month: 'Mar 25', conservative: 230000, optimistic: 275000 },
    { month: 'Apr 25', conservative: 236000, optimistic: 285000 },
    { month: 'May 25', conservative: 242000, optimistic: 295000 },
    { month: 'Jun 25', conservative: 248000, optimistic: 305000 },
  ];

  const revenueChartSeries = [
    { dataKey: 'historical', name: 'Historical', color: '#6b7280' },
    { dataKey: 'conservative', name: 'Conservative', color: '#3b82f6' },
    { dataKey: 'optimistic', name: 'Optimistic', color: '#10b981' }
  ];

  const clientChartSeries = [
    { dataKey: 'newClients', name: 'New Clients', color: '#10b981' },
    { dataKey: 'totalClients', name: 'Total Clients', color: '#3b82f6' }
  ];

  const expenseChartSeries = [
    { dataKey: 'conservative', name: 'Conservative', color: '#ef4444' },
    { dataKey: 'optimistic', name: 'Optimistic', color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Modeling Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Modeling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Client Growth Adjustment: +{clientGrowth[0]}%</Label>
              <Slider
                value={clientGrowth}
                onValueChange={setClientGrowth}
                max={50}
                min={-20}
                step={5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>CAC Reduction: -{cacReduction[0]}%</Label>
              <Slider
                value={cacReduction}
                onValueChange={setCacReduction}
                max={30}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="projection-mode"
                checked={isOptimistic}
                onCheckedChange={setIsOptimistic}
              />
              <Label htmlFor="projection-mode">
                {isOptimistic ? 'Optimistic' : 'Conservative'} Projections
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projection Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetData.map((widget, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <widget.icon className={`h-4 w-4 ${widget.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              <p className={`text-xs ${widget.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {widget.change} projected
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={projectionData}
          series={revenueChartSeries}
          xAxisDataKey="month"
          chartTitle="Revenue Forecast - Conservative vs Optimistic"
          height={300}
        />
        <BarChart
          data={clientProjectionData}
          series={clientChartSeries}
          xAxisDataKey="month"
          chartTitle="Client Growth Projections"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={expenseProjectionData}
          series={expenseChartSeries}
          xAxisDataKey="month"
          chartTitle="Expense Forecast"
          height={300}
        />
        <Card>
          <CardHeader>
            <CardTitle>Break-even Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">14 months</div>
                <p className="text-sm text-muted-foreground">to break-even</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Monthly Burn Rate:</span>
                  <span className="font-semibold">$42,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Monthly Revenue (Month 14):</span>
                  <span className="font-semibold">$385,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Required Client Base:</span>
                  <span className="font-semibold">1,872 clients</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Projections Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Forward-Looking Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Forward-Looking Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li>• Optimize CAC through targeted marketing channels</li>
                <li>• Increase client retention to improve LTV</li>
                <li>• Scale service delivery efficiently</li>
                <li>• Expand service offerings to existing client base</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Risk Factors</h4>
              <ul className="space-y-2 text-sm">
                <li>• Market saturation in current service areas</li>
                <li>• Regulatory changes affecting reimbursement rates</li>
                <li>• Competition increasing acquisition costs</li>
                <li>• Economic downturn affecting client spending</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projections;
