import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Target, Folder, Tag, Loader2 } from "lucide-react";
import { useState } from "react";
import LabelsConfig from "@/components/settings/datatab/LabelsConfig";
import ProgramsGoalsConfig from "@/components/settings/datatab/ProgramsGoalsConfig";
import DocumentCategoriesConfig from "@/components/settings/datatab/DocumentCategoriesConfig";
import KPIConfig from "@/components/settings/datatab/KPIConfig";
import { useDataLabels } from "@/hooks/useDataLabels";
import { useProgramsGoals } from "@/hooks/useProgramsGoals";

const Data = () => {
  const [showLabels, setShowLabels] = useState(false);
  const [showProgramsGoals, setShowProgramsGoals] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);

  // Hooks
  const { labels, loading: labelsLoading } = useDataLabels();
  const { programs, loading: programsLoading } = useProgramsGoals();

  // Show up to 3 items for preview
  const displayLabels = (labels ?? []).slice(0, 3);
  const displayPrograms = (programs ?? []).slice(0, 3);

  // Routed views (same pattern as User & Roles)
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
      {/* Labels Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Labels ({labelsLoading ? "..." : labels?.length ?? 0})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {labelsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading labels...
            </div>
          ) : (
            <div className="space-y-4">
              {displayLabels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No labels configured yet</p>
                  <p className="text-sm">Click "View All Labels" to get started</p>
                </div>
              ) : (
                displayLabels.map((label) => (
                  <div key={label.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: label.color,
                          color: label.textColor,
                          fontWeight: label.fontWeight,
                        }}
                        className="border-0"
                      >
                        {label.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground capitalize">{label.category}</span>
                    </div>
                  </div>
                ))
              )}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setShowLabels(true)}>
                  View All Labels
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Programs & Goals Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Programs & Goals ({programsLoading ? "..." : programs?.length ?? 0})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {programsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading programs...
            </div>
          ) : (
            <div className="space-y-4">
              {displayPrograms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No programs & goals configured yet</p>
                  <p className="text-sm">Click "View All Programs & Goals" to get started</p>
                </div>
              ) : (
                displayPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{program.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {program.goals.length} goals
                      </p>
                    </div>
                    <Badge variant="outline">{program.goals.length}</Badge>
                  </div>
                ))
              )}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setShowProgramsGoals(true)}>
                  View All Programs & Goals
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI & Doc Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              KPI & Outcome Definitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Define key performance indicators and treatment outcomes
            </p>
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
            <p className="text-sm text-gray-500 mb-4">
              Manage document categories and file types
            </p>
            <Button onClick={() => setShowCategories(true)}>Manage</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Data;
