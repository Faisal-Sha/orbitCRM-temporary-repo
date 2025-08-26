
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { MessageCircle } from "lucide-react";
import DashboardFilters from './DashboardFilters';
import DashboardKPIs from './DashboardKPIs';
import DashboardCharts from './DashboardCharts';
import DashboardTables from './DashboardTables';
import DashboardPendingAppointments from './DashboardPendingAppointments';
import { generateDummyAppointments, filterAppointments, calculateKPIs } from './data';

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [dateRange, setDateRange] = useState('Today');
  const [appointmentType, setAppointmentType] = useState('Intakes');
  const [selectedProvider, setSelectedProvider] = useState('All Providers');

  const allAppointments = useMemo(() => generateDummyAppointments(), []);

  const filteredAppointments = useMemo(() => {
    return filterAppointments(allAppointments, appointmentType, selectedProvider, dateRange);
  }, [allAppointments, appointmentType, selectedProvider, dateRange]);

  const kpis = useMemo(() => {
    return calculateKPIs(filteredAppointments);
  }, [filteredAppointments]);

  const providers = ['All Providers', 'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. James Wilson', 'Dr. Lisa Thompson'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Dashboard</h1>
          <p className="text-muted-foreground">AI-powered overview of appointments and calendar events</p>
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
            <CardDescription>Get insights about your appointments and schedule</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Global Filters */}
      <DashboardFilters 
        dateRange={dateRange}
        setDateRange={setDateRange}
        appointmentType={appointmentType}
        setAppointmentType={setAppointmentType}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        providers={providers}
      />

      {/* KPI Cards */}
      <DashboardKPIs kpis={kpis} appointmentType={appointmentType} />

      {/* Charts Section */}
      <DashboardCharts 
        appointmentType={appointmentType}
        dateRange={dateRange}
        filteredAppointments={filteredAppointments}
      />

      {/* Provider/Client Performance Tables */}
      <DashboardTables 
        appointmentType={appointmentType}
        filteredAppointments={filteredAppointments}
      />

      {/* Appointments Needing Follow-up */}
      <DashboardPendingAppointments 
        appointmentType={appointmentType}
        filteredAppointments={filteredAppointments}
      />
    </div>
  );
};

export default Dashboard;
