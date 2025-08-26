
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserX, 
  UserPlus, 
  TrendingUp, 
  AlertCircle,
  UserCheck 
} from "lucide-react";

interface DashboardWidgetsProps {
  peopleType: string;
  currentData: any;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ peopleType, currentData }) => {
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "leads":
      case "clients":
      case "active":
        return <Users className="h-8 w-8 text-blue-500" />;
      case "noShows":
      case "discharged":
      case "inactive":
        return <UserX className="h-8 w-8 text-red-500" />;
      case "referrals":
      case "onboarding":
        return <UserPlus className="h-8 w-8 text-green-500" />;
      case "issues":
        return <AlertCircle className="h-8 w-8 text-orange-500" />;
      case "growth":
        return <TrendingUp className="h-8 w-8 text-purple-500" />;
      default:
        return <UserCheck className="h-8 w-8 text-gray-500" />;
    }
  };

  const renderMainWidgets = () => {
    if (peopleType === "leads") {
      const widgets = currentData.widgets as {
        totalLeads: number;
        totalNoShows: number;
        totalReferrals: number;
        avgInterest: string;
      };

      return (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{widgets.totalLeads}</p>
                </div>
                {getWidgetIcon("leads")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No Shows</p>
                  <p className="text-2xl font-bold">{widgets.totalNoShows}</p>
                </div>
                {getWidgetIcon("noShows")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Referrals</p>
                  <p className="text-2xl font-bold">{widgets.totalReferrals}</p>
                </div>
                {getWidgetIcon("referrals")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest %</p>
                  <p className="text-2xl font-bold">{widgets.avgInterest}</p>
                </div>
                {getWidgetIcon("growth")}
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    if (peopleType === "clients") {
      const widgets = currentData.widgets as {
        totalClients: number;
        totalDischarged: number;
        totalIssues: number;
        avgGrowth: string;
      };

      return (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{widgets.totalClients}</p>
                </div>
                {getWidgetIcon("clients")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Discharged</p>
                  <p className="text-2xl font-bold">{widgets.totalDischarged}</p>
                </div>
                {getWidgetIcon("discharged")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{widgets.totalIssues}</p>
                </div>
                {getWidgetIcon("issues")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {widgets.avgGrowth}
                  </Badge>
                </div>
                {getWidgetIcon("growth")}
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    // Staff widgets
    const widgets = currentData.widgets as {
      totalActive: number;
      totalInactive: number;
      totalOnboarding: number;
      avgGrowth: string;
    };

    return (
      <>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold">{widgets.totalActive}</p>
              </div>
              {getWidgetIcon("active")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inactive</p>
                <p className="text-2xl font-bold">{widgets.totalInactive}</p>
              </div>
              {getWidgetIcon("inactive")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Onboarding</p>
                <p className="text-2xl font-bold">{widgets.totalOnboarding}</p>
              </div>
              {getWidgetIcon("onboarding")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {widgets.avgGrowth}
                </Badge>
              </div>
              {getWidgetIcon("growth")}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderNewWidgets = () => {
    if (peopleType === "leads") {
      const widgets = currentData.widgets as {
        newLeads: number;
        newNoShows: number;
        newReferrals: number;
        avgNewInterest: string;
      };
      const trends = currentData.trendIndicators;

      return (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newLeads}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newLeads}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("leads")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New No Shows</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newNoShows}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newNoShows}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("noShows")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Referrals</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newReferrals}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newReferrals}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("referrals")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Interest %</p>
                  <p className="text-2xl font-bold">{widgets.avgNewInterest}</p>
                </div>
                {getWidgetIcon("growth")}
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    if (peopleType === "clients") {
      const widgets = currentData.widgets as {
        newClients: number;
        newDischarged: number;
        newIssues: number;
        avgNewGrowth: string;
      };
      const trends = currentData.trendIndicators;

      return (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Clients</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newClients}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newClients}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("clients")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Discharged</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newDischarged}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newDischarged}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("discharged")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Issues</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{widgets.newIssues}</p>
                    <Badge variant="outline" className="text-xs">
                      {trends.newIssues}
                    </Badge>
                  </div>
                </div>
                {getWidgetIcon("issues")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {widgets.avgNewGrowth}
                  </Badge>
                </div>
                {getWidgetIcon("growth")}
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    // Staff new widgets
    const widgets = currentData.widgets as {
      newStaff: number;
      newDischarged: number;
      newOnboarding: number;
      avgNewGrowth: string;
    };
    const trends = currentData.trendIndicators;

    return (
      <>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Staff</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{widgets.newStaff}</p>
                  <Badge variant="outline" className="text-xs">
                    {trends.newStaff}
                  </Badge>
                </div>
              </div>
              {getWidgetIcon("active")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Discharged</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{widgets.newDischarged}</p>
                  <Badge variant="outline" className="text-xs">
                    {trends.newDischarged}
                  </Badge>
                </div>
              </div>
              {getWidgetIcon("inactive")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Onboarding</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{widgets.newOnboarding}</p>
                  <Badge variant="outline" className="text-xs">
                    {trends.newOnboarding}
                  </Badge>
                </div>
              </div>
              {getWidgetIcon("onboarding")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {widgets.avgNewGrowth}
                </Badge>
              </div>
              {getWidgetIcon("growth")}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMainWidgets()}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderNewWidgets()}
      </div>
    </div>
  );
};

export default DashboardWidgets;
