
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Target, Folder, Tag } from "lucide-react";
import { useState } from "react";
import LabelsConfig from "@/components/settings/datatab/LabelsConfig";
import ProgramsGoalsConfig from "@/components/settings/datatab/ProgramsGoalsConfig";
import DocumentCategoriesConfig from "@/components/settings/datatab/DocumentCategoriesConfig";
import KPIConfig from "@/components/settings/datatab/KPIConfig";

const Data = () => {
  const [showLabels, setShowLabels] = useState(false);
  const [showProgramsGoals, setShowProgramsGoals] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);

  // Navigation handlers
  if (showLabels) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Labels Management</h2>
          <Button variant="outline" onClick={() => setShowLabels(false)}>
            Back to Settings
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Labels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LabelsConfig />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showProgramsGoals) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Programs & Goals Management</h2>
          <Button variant="outline" onClick={() => setShowProgramsGoals(false)}>
            Back to Settings
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Programs & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgramsGoalsConfig />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCategories) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Document Categories Management</h2>
          <Button variant="outline" onClick={() => setShowCategories(false)}>
            Back to Settings
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentCategoriesConfig />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showKPIs) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">KPI Management</h2>
          <Button variant="outline" onClick={() => setShowKPIs(false)}>
            Back to Settings
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              KPI & Outcome Definitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KPIConfig />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Labels
            </CardTitle>
            <Button onClick={() => setShowLabels(true)}>
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge style={{ backgroundColor: '#ef4444', color: 'white' }} className="border-0">
                High Priority
              </Badge>
              <Badge style={{ backgroundColor: '#3b82f6', color: 'white' }} className="border-0">
                In Progress
              </Badge>
              <Badge style={{ backgroundColor: '#f59e0b', color: 'white' }} className="border-0">
                Urgent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Programs & Goals
            </CardTitle>
            <Button onClick={() => setShowProgramsGoals(true)}>
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded">
              <p className="font-medium mb-2">Wellbeing</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Body & Fitness</Badge>
                <Badge variant="outline">Life Balance</Badge>
                <Badge variant="outline">Relationships</Badge>
              </div>
            </div>
            <div className="p-3 border rounded">
              <p className="font-medium mb-2">Stability</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Job</Badge>
                <Badge variant="outline">Money</Badge>
                <Badge variant="outline">Other</Badge>
              </div>
            </div>
            <div className="p-3 border rounded">
              <p className="font-medium mb-2">Achievement</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Business</Badge>
                <Badge variant="outline">Digital Skills</Badge>
                <Badge variant="outline">Higher Education</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              KPI & Outcome Definitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Define key performance indicators and treatment outcomes</p>
            <Button onClick={() => setShowKPIs(true)}>Manage</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Document Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Manage document categories and file types</p>
            <Button onClick={() => setShowCategories(true)}>Manage</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Data;
