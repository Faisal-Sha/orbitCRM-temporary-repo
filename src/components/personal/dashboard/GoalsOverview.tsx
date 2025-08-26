
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp
} from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Link } from "react-router-dom";

// Goal type definition (matching the Goals page structure)
interface Goal {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  createdDate: Date;
  milestones?: Goal[];
}

// Generate dummy goals data
const generateDummyGoals = (): Goal[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  return [
    {
      id: "goal-1",
      title: "Launch personal website",
      category: "Personal",
      priority: "High",
      status: "In Progress",
      dueDate: tomorrow,
      createdDate: lastWeek,
      milestones: [
        {
          id: "milestone-1-1",
          title: "Design mockups",
          category: "Personal",
          priority: "Medium",
          status: "Completed",
          dueDate: yesterday,
          createdDate: lastWeek,
        }
      ]
    },
    {
      id: "goal-2",
      title: "Complete marathon training",
      category: "Health",
      priority: "Medium",
      status: "To Do",
      dueDate: nextWeek,
      createdDate: yesterday,
    },
    {
      id: "goal-3",
      title: "Learn new programming language",
      category: "Learning",
      priority: "Low",
      status: "To Do",
      dueDate: nextWeek,
      createdDate: today,
    },
    {
      id: "goal-4",
      title: "Achieve quarterly sales target",
      category: "Work",
      priority: "High",
      status: "Blocked",
      dueDate: yesterday,
      createdDate: lastWeek,
    },
    {
      id: "goal-5",
      title: "Build emergency fund",
      category: "Finance",
      priority: "High",
      status: "In Progress",
      dueDate: nextWeek,
      createdDate: yesterday,
    },
    {
      id: "goal-6",
      title: "Organize home office",
      category: "Personal",
      priority: "Low",
      status: "Completed",
      dueDate: yesterday,
      createdDate: lastWeek,
    }
  ];
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 border-red-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-100 text-green-800 border-green-200";
    case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Blocked": return "bg-red-100 text-red-800 border-red-200";
    case "To Do": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const GoalsOverview = () => {
  const goals = generateDummyGoals();

  // Goal calculations
  const activeGoals = goals.filter(g => !["Completed", "Cancelled"].includes(g.status));
  const completedGoals = goals.filter(g => g.status === "Completed");
  const overdueGoals = goals.filter(g => 
    g.dueDate && isBefore(g.dueDate, new Date()) && !["Completed", "Cancelled"].includes(g.status)
  );
  const thisWeekGoals = goals.filter(g => 
    g.dueDate && 
    isAfter(g.dueDate, new Date()) && 
    isBefore(g.dueDate, addDays(new Date(), 7)) &&
    !["Completed", "Cancelled"].includes(g.status)
  );
  const recentGoals = goals
    .filter(g => !["Completed", "Cancelled"].includes(g.status))
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);
  const upcomingGoals = goals
    .filter(g => g.dueDate && !["Completed", "Cancelled"].includes(g.status))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Chart data
  const goalStatusData = [
    { name: "To Do", value: goals.filter(g => g.status === "To Do").length, color: "#94a3b8" },
    { name: "In Progress", value: goals.filter(g => g.status === "In Progress").length, color: "#3b82f6" },
    { name: "Blocked", value: goals.filter(g => g.status === "Blocked").length, color: "#ef4444" },
    { name: "Completed", value: goals.filter(g => g.status === "Completed").length, color: "#22c55e" }
  ];

  const goalPriorityData = [
    { name: "High", value: goals.filter(g => g.priority === "High").length, color: "#ef4444" },
    { name: "Medium", value: goals.filter(g => g.priority === "Medium").length, color: "#f59e0b" },
    { name: "Low", value: goals.filter(g => g.priority === "Low").length, color: "#22c55e" }
  ];

  const completionTrendData = [
    { month: "Jan", created: 8, completed: 6 },
    { month: "Feb", created: 10, completed: 8 },
    { month: "Mar", created: 12, completed: 10 },
    { month: "Apr", created: 9, completed: 7 },
    { month: "May", created: 14, completed: 12 },
    { month: "Jun", created: 11, completed: 9 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Goals Overview</h2>
        <Link to="/personal/goals">
          <Button variant="outline" className="bg-white">View All Goals</Button>
        </Link>
      </div>
      
      {/* Goal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{Math.round((completedGoals.length / goals.length) * 100)}%</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">+15%</span>
                  </div>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Goals</p>
                <p className="text-2xl font-bold text-red-600">{overdueGoals.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due This Week</p>
                <p className="text-2xl font-bold">{thisWeekGoals.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Goals</CardTitle>
            <CardDescription>Your most recently created goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                      <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">
                    {goal.dueDate ? format(goal.dueDate, 'MMM dd') : 'No due date'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Goals with nearest due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                      <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                    </div>
                  </div>
                  <p className={`text-sm ml-2 ${
                    goal.dueDate && isBefore(goal.dueDate, new Date()) 
                      ? 'text-red-600 font-medium' 
                      : 'text-muted-foreground'
                  }`}>
                    {goal.dueDate ? format(goal.dueDate, 'MMM dd') : 'No due date'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={goalStatusData}
              series={[{ dataKey: "value", name: "Goals", color: "#3b82f6", enabled: true }]}
              xAxisDataKey="name"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={completionTrendData}
              series={[
                { dataKey: "created", name: "Created", color: "#3b82f6", enabled: true },
                { dataKey: "completed", name: "Completed", color: "#22c55e", enabled: true }
              ]}
              xAxisDataKey="month"
              height={250}
              showSeriesToggle={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={goalPriorityData}
              series={[{ dataKey: "value", name: "Goals", color: "#f59e0b", enabled: true }]}
              xAxisDataKey="name"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsOverview;
