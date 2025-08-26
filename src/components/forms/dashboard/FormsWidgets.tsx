
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, CheckCircle, Archive } from "lucide-react";
import { FormsDashboardData } from "./data";

interface FormsWidgetsProps {
  currentData: FormsDashboardData;
}

const FormsWidgets = ({ currentData }: FormsWidgetsProps) => {
  const widgets = [
    {
      title: "Total Forms",
      value: currentData.totalForms,
      icon: FileText,
      description: "All forms in system",
      color: "text-blue-600"
    },
    {
      title: "Total Submissions",
      value: currentData.totalSubmissions,
      icon: Send,
      description: "All submissions received",
      color: "text-green-600"
    },
    {
      title: "Active Forms",
      value: currentData.activeForms,
      icon: CheckCircle,
      description: "Currently published",
      color: "text-emerald-600"
    },
    {
      title: "Archived Forms",
      value: currentData.archivedForms,
      icon: Archive,
      description: "No longer active",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            <widget.icon className={`h-4 w-4 ${widget.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{widget.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{widget.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormsWidgets;
