
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Activity
} from "lucide-react";

interface KPIs {
  total: number;
  completed: number;
  completionRate: number;
  avgDuration: number;
}

interface DashboardKPIsProps {
  kpis: KPIs;
  appointmentType: string;
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ kpis, appointmentType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold">{kpis.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {(appointmentType === 'Intakes' || appointmentType === 'Clients') && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointments Completed</p>
                  <p className="text-2xl font-bold">{kpis.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{kpis.completionRate}%</p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">+5%</span>
                    </div>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Duration</p>
              <p className="text-2xl font-bold">{kpis.avgDuration} min</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKPIs;
