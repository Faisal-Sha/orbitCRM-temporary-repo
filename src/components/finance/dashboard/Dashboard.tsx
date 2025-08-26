
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import DateRangePicker from "@/components/finance/DateRangePicker";
import ExecutivePanel from "./ExecutivePanel";
import PartnerReports from "./PartnerReports";
import MarketingMetrics from "./MarketingMetrics";
import RevenueAnalytics from "./RevenueAnalytics";
import Costs from "./Costs";
import ProfitLoss from "./ProfitLoss";
import Projections from "./Projections";

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [dateRange, setDateRange] = useState("all-time");
  const [activeTab, setActiveTab] = useState("executive");
  const [customDateRange, setCustomDateRange] = useState<{from?: Date; to?: Date}>({});

  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setCustomDateRange({ from, to });
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
          <p className="text-muted-foreground">AI-powered overview of your financial data</p>
        </div>
        <Button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`flex items-center gap-2 ${
            showAIChat 
              ? "bg-white text-primary border border-primary hover:bg-gray-50" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {showAIChat ? "Close Chat" : "CompanionedAI"}
        </Button>
      </div>

      {/* AI Chat Section */}
      {showAIChat && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get financial insights and analytics</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date Range:</label>
              {dateRange === "custom" ? (
                <DateRangePicker onDateRangeChange={handleDateRangeChange} />
              ) : (
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="executive" className="text-xs">Executive</TabsTrigger>
          <TabsTrigger value="partner" className="text-xs">Partner</TabsTrigger>
          <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
          <TabsTrigger value="costs" className="text-xs">Costs</TabsTrigger>
          <TabsTrigger value="pl" className="text-xs">P&L</TabsTrigger>
          <TabsTrigger value="projections" className="text-xs">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="executive">
          <ExecutivePanel 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="partner">
          <PartnerReports 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingMetrics 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalytics 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="costs">
          <Costs 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="pl">
          <ProfitLoss 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>

        <TabsContent value="projections">
          <Projections 
            dateRange={dateRange}
            customDateRange={customDateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
