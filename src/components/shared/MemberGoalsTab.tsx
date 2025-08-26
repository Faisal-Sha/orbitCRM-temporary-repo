import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LineChart from "@/components/charts/LineChart";
import GoalsMilestonesList from "@/components/personal/goals/GoalsMilestonesList";
import { CheckCircle, Target, TrendingUp, Plus, Award } from "lucide-react";

// Dummy data for major goals
const majorGoals = [
  { id: 1, title: "New job", progress: 75, status: "in-progress" },
  { id: 2, title: "$3,500/mo", progress: 60, status: "in-progress" },
  { id: 3, title: "New house", progress: 25, status: "planning" },
  { id: 4, title: "Disneyland", progress: 90, status: "almost-complete" },
];

// Calculate overall progress
const overallProgress = Math.round(majorGoals.reduce((sum, goal) => sum + goal.progress, 0) / majorGoals.length);

// Dummy data for Goals Progress Evaluation chart
const goalsProgressData = [
  { month: "Jan", "New job": 20, "$3,500/mo": 10, "New house": 5, "Disneyland": 60 },
  { month: "Feb", "New job": 35, "$3,500/mo": 25, "New house": 8, "Disneyland": 70 },
  { month: "Mar", "New job": 50, "$3,500/mo": 40, "New house": 12, "Disneyland": 75 },
  { month: "Apr", "New job": 65, "$3,500/mo": 50, "New house": 18, "Disneyland": 80 },
  { month: "May", "New job": 75, "$3,500/mo": 60, "New house": 25, "Disneyland": 90 },
];

const goalsProgressSeries = [
  { dataKey: "New job", name: "New job", color: "#3B82F6" },
  { dataKey: "$3,500/mo", name: "$3,500/mo", color: "#10B981" },
  { dataKey: "New house", name: "New house", color: "#F59E0B" },
  { dataKey: "Disneyland", name: "Disneyland", color: "#EF4444" },
];

// Dummy data for Mental Health Evaluation chart
const mentalHealthData = [
  { month: "Jan", "Anxiety Level": 7, "Depression Level": 6, "Overall Wellbeing": 4 },
  { month: "Feb", "Anxiety Level": 6, "Depression Level": 5, "Overall Wellbeing": 5 },
  { month: "Mar", "Anxiety Level": 5, "Depression Level": 4, "Overall Wellbeing": 6 },
  { month: "Apr", "Anxiety Level": 4, "Depression Level": 3, "Overall Wellbeing": 7 },
  { month: "May", "Anxiety Level": 3, "Depression Level": 2, "Overall Wellbeing": 8 },
];

const mentalHealthSeries = [
  { dataKey: "Anxiety Level", name: "Anxiety Level", color: "#EF4444" },
  { dataKey: "Depression Level", name: "Depression Level", color: "#F59E0B" },
  { dataKey: "Overall Wellbeing", name: "Overall Wellbeing", color: "#10B981" },
];

// Staff-specific data for staff development goals
const staffGoals = [
  { id: 1, title: "Complete Advanced Therapy Training", progress: 85, status: "in-progress" },
  { id: 2, title: "Obtain Clinical Supervision Hours", progress: 65, status: "in-progress" },
  { id: 3, title: "Develop Specialty in Trauma Therapy", progress: 40, status: "planning" },
  { id: 4, title: "Improve Documentation Efficiency", progress: 90, status: "almost-complete" },
];

// Staff Development Progress chart data
const developmentProgressData = [
  { month: "Jan", "Training": 20, "Supervision": 15, "Specialty": 10, "Documentation": 60 },
  { month: "Feb", "Training": 35, "Supervision": 30, "Specialty": 20, "Documentation": 70 },
  { month: "Mar", "Training": 50, "Supervision": 45, "Specialty": 25, "Documentation": 80 },
  { month: "Apr", "Training": 70, "Supervision": 55, "Specialty": 30, "Documentation": 85 },
  { month: "May", "Training": 85, "Supervision": 65, "Specialty": 40, "Documentation": 90 },
];

const developmentProgressSeries = [
  { dataKey: "Training", name: "Training", color: "#3B82F6" },
  { dataKey: "Supervision", name: "Supervision", color: "#10B981" },
  { dataKey: "Specialty", name: "Specialty", color: "#F59E0B" },
  { dataKey: "Documentation", name: "Documentation", color: "#EF4444" },
];

// Staff Performance Metrics chart data
const performanceData = [
  { month: "Jan", "Clinical Skills": 6, "Communication": 7, "Professional Growth": 5 },
  { month: "Feb", "Clinical Skills": 6.5, "Communication": 7.5, "Professional Growth": 6 },
  { month: "Mar", "Clinical Skills": 7, "Communication": 8, "Professional Growth": 6.5 },
  { month: "Apr", "Clinical Skills": 7.5, "Communication": 8.5, "Professional Growth": 7 },
  { month: "May", "Clinical Skills": 8, "Communication": 9, "Professional Growth": 7.5 },
];

const performanceSeries = [
  { dataKey: "Clinical Skills", name: "Clinical Skills", color: "#3B82F6" },
  { dataKey: "Communication", name: "Communication", color: "#10B981" },
  { dataKey: "Professional Growth", name: "Professional Growth", color: "#8B5CF6" },
];

// Staff development tasks data
const staffDevelopmentTasks = [
  {
    id: "dev-task-1",
    title: "Complete Advanced Therapy Training",
    category: "Training",
    priority: "High" as const,
    status: "In Progress" as const,
    dueDate: new Date(2024, 11, 31),
    sectionId: "development",
    isExpanded: true,
    subtasks: [
      {
        id: "dev-subtask-1-1",
        title: "Attend Module 1: Assessment Techniques",
        category: "Training",
        priority: "High" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 15),
        sectionId: "development",
      },
      {
        id: "dev-subtask-1-2",
        title: "Complete Module 2: Intervention Strategies",
        category: "Training",
        priority: "High" as const,
        status: "In Progress" as const,
        dueDate: new Date(2024, 11, 25),
        sectionId: "development",
      },
      {
        id: "dev-subtask-1-3",
        title: "Final examination and certification",
        category: "Training",
        priority: "High" as const,
        status: "To Do" as const,
        dueDate: new Date(2024, 11, 31),
        sectionId: "development",
      },
    ]
  },
  {
    id: "dev-task-2",
    title: "Obtain Clinical Supervision Hours",
    category: "Supervision",
    priority: "High" as const,
    status: "In Progress" as const,
    dueDate: new Date(2025, 2, 31),
    sectionId: "development",
    isExpanded: false,
    subtasks: [
      {
        id: "dev-subtask-2-1",
        title: "Schedule weekly supervision sessions",
        category: "Supervision",
        priority: "High" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 1),
        sectionId: "development",
      },
      {
        id: "dev-subtask-2-2",
        title: "Document supervision activities",
        category: "Supervision",
        priority: "Medium" as const,
        status: "In Progress" as const,
        dueDate: new Date(2025, 1, 15),
        sectionId: "development",
      },
    ]
  },
];

const staffTaskSections = [
  { id: "development", title: "Development Goals" },
];

// Updated tasks data for Goals & Milestones with subtasks
const dummyTasks = [
  {
    id: "goal-task-1",
    title: "New job",
    category: "Career",
    priority: "High" as const,
    status: "In Progress" as const,
    dueDate: new Date(2024, 11, 31),
    sectionId: "goals",
    isExpanded: true,
    subtasks: [
      {
        id: "goal-subtask-1-1",
        title: "Update resume and LinkedIn profile",
        category: "Career",
        priority: "High" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 15),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-1-2",
        title: "Apply to 5 companies this week",
        category: "Career",
        priority: "High" as const,
        status: "In Progress" as const,
        dueDate: new Date(2024, 11, 20),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-1-3",
        title: "Prepare for interviews",
        category: "Career",
        priority: "Medium" as const,
        status: "To Do" as const,
        dueDate: new Date(2024, 11, 25),
        sectionId: "goals",
      },
    ]
  },
  {
    id: "goal-task-2",
    title: "$3,500/mo",
    category: "Finance",
    priority: "High" as const,
    status: "In Progress" as const,
    dueDate: new Date(2025, 0, 31),
    sectionId: "goals",
    isExpanded: false,
    subtasks: [
      {
        id: "goal-subtask-2-1",
        title: "Negotiate salary increase",
        category: "Finance",
        priority: "High" as const,
        status: "To Do" as const,
        dueDate: new Date(2024, 11, 30),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-2-2",
        title: "Start side freelancing project",
        category: "Finance",
        priority: "Medium" as const,
        status: "In Progress" as const,
        dueDate: new Date(2025, 0, 15),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-2-3",
        title: "Track monthly budget",
        category: "Finance",
        priority: "Medium" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 1),
        sectionId: "goals",
      },
    ]
  },
  {
    id: "goal-task-3",
    title: "New house",
    category: "Housing",
    priority: "Medium" as const,
    status: "To Do" as const,
    dueDate: new Date(2025, 5, 30),
    sectionId: "goals",
    isExpanded: false,
    subtasks: [
      {
        id: "goal-subtask-3-1",
        title: "Save for down payment",
        category: "Finance",
        priority: "High" as const,
        status: "In Progress" as const,
        dueDate: new Date(2025, 2, 31),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-3-2",
        title: "Research neighborhoods",
        category: "Housing",
        priority: "Medium" as const,
        status: "To Do" as const,
        dueDate: new Date(2025, 1, 15),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-3-3",
        title: "Get pre-approved for mortgage",
        category: "Finance",
        priority: "Medium" as const,
        status: "To Do" as const,
        dueDate: new Date(2025, 3, 1),
        sectionId: "goals",
      },
    ]
  },
  {
    id: "goal-task-4",
    title: "Disneyland",
    category: "Travel",
    priority: "Low" as const,
    status: "In Progress" as const,
    dueDate: new Date(2024, 11, 25),
    sectionId: "goals",
    isExpanded: false,
    subtasks: [
      {
        id: "goal-subtask-4-1",
        title: "Book tickets and hotel",
        category: "Travel",
        priority: "High" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 10),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-4-2",
        title: "Plan itinerary",
        category: "Travel",
        priority: "Medium" as const,
        status: "Completed" as const,
        dueDate: new Date(2024, 11, 15),
        sectionId: "goals",
      },
      {
        id: "goal-subtask-4-3",
        title: "Pack for trip",
        category: "Travel",
        priority: "Low" as const,
        status: "To Do" as const,
        dueDate: new Date(2024, 11, 24),
        sectionId: "goals",
      },
    ]
  },
];

const taskSections = [
  { id: "goals", title: "Goals & Milestones" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "almost-complete": return "bg-green-100 text-green-800";
    case "in-progress": return "bg-blue-100 text-blue-800";
    case "planning": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "almost-complete": return <CheckCircle className="h-4 w-4" />;
    case "in-progress": return <TrendingUp className="h-4 w-4" />;
    case "planning": return <Target className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

interface MemberGoalsTabProps {
  userRole?: string;
}

const MemberGoalsTab: React.FC<MemberGoalsTabProps> = ({ userRole = "client_goals" }) => {
  // Determine data based on user role
  const isStaffGoals = userRole === "staff_goals";
  const currentGoals = isStaffGoals ? staffGoals : majorGoals;
  const currentOverallProgress = Math.round(currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / currentGoals.length);
  const currentTasks = isStaffGoals ? staffDevelopmentTasks : dummyTasks;
  const currentSections = isStaffGoals ? staffTaskSections : taskSections;
  
  const [tasks, setTasks] = React.useState(currentTasks);

  const handleGoalUpdate = (updatedGoal: any) => {
    console.log("Goal updated:", updatedGoal);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedGoal.id ? updatedGoal : task
      )
    );
  };

  const handleGoalToggle = (goalId: string) => {
    console.log("Goal toggled:", goalId);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === goalId ? { ...task, isExpanded: !task.isExpanded } : task
      )
    );
  };

  const handleGoalComplete = (goalId: string) => {
    console.log("Goal completed:", goalId);
  };

  const handleAddGoal = () => {
    console.log("Add goal clicked");
  };

  return (
    <div className="space-y-6">
      {/* Program Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {isStaffGoals ? "Development Program" : "Program"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                {isStaffGoals ? "Professional Development" : "Achievement"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isStaffGoals ? "Active staff development program" : "Active enrollment program"}
              </p>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isStaffGoals ? "Development Goals Overview" : "Goals Overview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-bold text-primary">{currentOverallProgress}%</span>
            </div>
            <Progress value={currentOverallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Goals Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>{isStaffGoals ? "Development Goals Timeline" : "Major Goals Timeline"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentGoals.map((goal) => (
              <div key={goal.id} className="space-y-3 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusIcon(goal.status)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isStaffGoals ? "Monthly Development Progress" : "Monthly Goals Progress"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={isStaffGoals ? developmentProgressData : goalsProgressData}
              series={isStaffGoals ? developmentProgressSeries : goalsProgressSeries}
              xAxisDataKey="month"
              yAxisLabel="Progress (%)"
              yAxisDomain={[0, 100]}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isStaffGoals ? "Performance Metrics" : "Mental Health Progress"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={isStaffGoals ? performanceData : mentalHealthData}
              series={isStaffGoals ? performanceSeries : mentalHealthSeries}
              xAxisDataKey="month"
              yAxisLabel={isStaffGoals ? "Rating (1-10)" : "Scale (1-10)"}
              yAxisDomain={[0, 10]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Goals Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isStaffGoals ? "Development Goals Tasks" : "Goals & Milestones Tasks"}
            </CardTitle>
            <Button onClick={handleAddGoal} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <GoalsMilestonesList
            goals={tasks}
            sections={currentSections}
            onGoalUpdate={handleGoalUpdate}
            onGoalToggle={handleGoalToggle}
            onGoalComplete={handleGoalComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberGoalsTab;
