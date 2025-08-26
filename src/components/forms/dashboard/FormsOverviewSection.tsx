
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FormsDashboardData } from "./data";

interface FormsOverviewSectionProps {
  currentData: FormsDashboardData;
  formSearchFilter: string;
}

const FormsOverviewSection = ({ currentData, formSearchFilter }: FormsOverviewSectionProps) => {
  const filteredTopForms = currentData.topFormsBySubmissions.filter(form =>
    form.formTitle.toLowerCase().includes(formSearchFilter.toLowerCase())
  );

  const COLORS = ['#10b981', '#f59e0b', '#6b7280'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Forms Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forms by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Forms by Status</CardTitle>
            <CardDescription>Distribution of forms by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.formsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {currentData.formsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Forms by Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Forms by Submission Volume</CardTitle>
            <CardDescription>Most popular forms based on submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredTopForms}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="formTitle" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormsOverviewSection;
