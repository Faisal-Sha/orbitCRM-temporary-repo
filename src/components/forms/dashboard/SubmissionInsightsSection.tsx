
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { FormsDashboardData } from "./data";

interface SubmissionInsightsSectionProps {
  currentData: FormsDashboardData;
  formSearchFilter: string;
}

const SubmissionInsightsSection = ({ currentData, formSearchFilter }: SubmissionInsightsSectionProps) => {
  const filteredSubmissionsByForm = currentData.topFormsBySubmissions.filter(form =>
    form.formTitle.toLowerCase().includes(formSearchFilter.toLowerCase())
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Submission Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Volume Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Volume Over Time</CardTitle>
            <CardDescription>Monthly submission trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.submissionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Submissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Submissions by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions by Source</CardTitle>
            <CardDescription>Where submissions are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.submissionsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, count }) => `${source}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {currentData.submissionsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Quiz Score */}
        <Card>
          <CardHeader>
            <CardTitle>Average Quiz Score</CardTitle>
            <CardDescription>Average score across all quiz forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary">{currentData.averageQuizScore}%</div>
                <p className="text-muted-foreground mt-2">Average score across all quiz submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Submissions by Form */}
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions by Form</CardTitle>
            <CardDescription>Submission count per form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredSubmissionsByForm}
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
                  <Bar dataKey="submissions" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionInsightsSection;
