
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LineChart from "@/components/charts/LineChart";
import { Users, TrendingUp, Target, Handshake, Calendar } from "lucide-react";

const LeadCampaignsTab = () => {
  // Dummy data for leads by source
  const leadsBySource = [
    { source: 'Paid', count: 1245, icon: Target, color: 'bg-blue-500' },
    { source: 'Organic', count: 892, icon: TrendingUp, color: 'bg-green-500' },
    { source: 'Referrals', count: 567, icon: Users, color: 'bg-purple-500' },
    { source: 'Partnerships', count: 334, icon: Handshake, color: 'bg-orange-500' },
    { source: 'Events', count: 123, icon: Calendar, color: 'bg-red-500' }
  ];

  // Dummy data for top campaigns by leads
  const topLeadCampaigns = [
    { name: 'Q4 Digital Marketing Push', leads: 425 },
    { name: 'Holiday Special Promotion', leads: 389 },
    { name: 'New Year Lead Generation', leads: 356 },
    { name: 'Social Media Blast', leads: 298 },
    { name: 'Email Newsletter Campaign', leads: 267 },
    { name: 'PPC Google Ads', leads: 234 },
    { name: 'LinkedIn Outreach', leads: 198 },
    { name: 'Webinar Series', leads: 156 },
    { name: 'Content Marketing', leads: 134 },
    { name: 'Influencer Partnership', leads: 89 }
  ];

  // Dummy data for top campaigns by interest
  const topInterestCampaigns = [
    { name: 'Webinar Series', interest: 87.5 },
    { name: 'LinkedIn Outreach', interest: 82.3 },
    { name: 'Content Marketing', interest: 79.1 },
    { name: 'Holiday Special Promotion', interest: 76.8 },
    { name: 'Q4 Digital Marketing Push', interest: 74.2 },
    { name: 'Email Newsletter Campaign', interest: 71.5 },
    { name: 'Influencer Partnership', interest: 69.7 },
    { name: 'New Year Lead Generation', interest: 67.4 },
    { name: 'PPC Google Ads', interest: 65.1 },
    { name: 'Social Media Blast', interest: 62.8 }
  ];

  // Dummy data for monthly charts
  const monthlyMetricsData = [
    { month: 'Jan', totalLeads: 1200, interestRate: 65.2 },
    { month: 'Feb', totalLeads: 1350, interestRate: 67.8 },
    { month: 'Mar', totalLeads: 1180, interestRate: 69.1 },
    { month: 'Apr', totalLeads: 1420, interestRate: 71.5 },
    { month: 'May', totalLeads: 1580, interestRate: 68.9 },
    { month: 'Jun', totalLeads: 1690, interestRate: 74.3 },
    { month: 'Jul', totalLeads: 1520, interestRate: 72.1 },
    { month: 'Aug', totalLeads: 1750, interestRate: 76.8 },
    { month: 'Sep', totalLeads: 1820, interestRate: 78.2 },
    { month: 'Oct', totalLeads: 1920, interestRate: 79.5 },
    { month: 'Nov', totalLeads: 2100, interestRate: 81.3 },
    { month: 'Dec', totalLeads: 2350, interestRate: 83.7 }
  ];

  const monthlySourceData = [
    { month: 'Jan', paid: 450, organic: 320, referrals: 250, partnerships: 120, events: 60 },
    { month: 'Feb', paid: 520, organic: 380, referrals: 280, partnerships: 130, events: 40 },
    { month: 'Mar', paid: 480, organic: 350, referrals: 220, partnerships: 90, events: 40 },
    { month: 'Apr', paid: 580, organic: 420, referrals: 290, partnerships: 100, events: 30 },
    { month: 'May', paid: 640, organic: 480, referrals: 320, partnerships: 110, events: 30 },
    { month: 'Jun', paid: 720, organic: 520, referrals: 280, partnerships: 130, events: 40 },
    { month: 'Jul', paid: 650, organic: 470, referrals: 270, partnerships: 100, events: 30 },
    { month: 'Aug', paid: 750, organic: 540, referrals: 310, partnerships: 120, events: 30 },
    { month: 'Sep', paid: 780, organic: 580, referrals: 320, partnerships: 110, events: 30 },
    { month: 'Oct', paid: 820, organic: 620, referrals: 340, partnerships: 110, events: 30 },
    { month: 'Nov', paid: 900, organic: 680, referrals: 380, partnerships: 120, events: 20 },
    { month: 'Dec', paid: 1020, organic: 750, referrals: 420, partnerships: 140, events: 20 }
  ];

  const metricsChartSeries = [
    { dataKey: 'totalLeads', name: 'Total Leads', color: '#3b82f6' },
    { dataKey: 'interestRate', name: 'Interest %', color: '#10b981' }
  ];

  const sourceChartSeries = [
    { dataKey: 'paid', name: 'Paid', color: '#3b82f6' },
    { dataKey: 'organic', name: 'Organic', color: '#10b981' },
    { dataKey: 'referrals', name: 'Referrals', color: '#8b5cf6' },
    { dataKey: 'partnerships', name: 'Partnerships', color: '#f59e0b' },
    { dataKey: 'events', name: 'Events', color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Lead Campaigns Overview Header */}
      <div>
        <h2 className="text-2xl font-bold">Lead Campaigns Overview</h2>
        <p className="text-muted-foreground">Comprehensive insights into your lead generation campaigns</p>
      </div>

      {/* Leads by Campaign Source */}
      <Card>
        <CardHeader>
          <CardTitle>Leads by Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {leadsBySource.map((source) => (
              <div key={source.source} className="flex items-center p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${source.color} mr-3`}>
                  <source.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{source.source}</p>
                  <p className="text-2xl font-bold">{source.count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Highest Leads Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Highest Leads Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLeadCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{campaign.leads}</p>
                    <p className="text-sm text-muted-foreground">leads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Highest Interest Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Highest Interest Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topInterestCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{campaign.interest}%</p>
                    <p className="text-sm text-muted-foreground">interest rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Leads & Interest % Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Total Leads & Interest Rate Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={monthlyMetricsData}
              series={metricsChartSeries}
              xAxisDataKey="month"
              xAxisLabel="Month"
              yAxisLabel="Count / Percentage"
              height={300}
              chartTitle="Monthly Leads and Interest Rate"
              showSeriesToggle={true}
            />
          </CardContent>
        </Card>

        {/* Leads by Source Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Campaign Source</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={monthlySourceData}
              series={sourceChartSeries}
              xAxisDataKey="month"
              xAxisLabel="Month"
              yAxisLabel="Leads"
              height={300}
              chartTitle="Monthly Leads by Source"
              showSeriesToggle={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadCampaignsTab;
