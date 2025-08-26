
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp
} from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Link } from "react-router-dom";
import { generateDummyTasks, getPriorityColor, getStatusColor, Task } from "./data";

const TasksOverview = () => {
  const tasks = generateDummyTasks();

  // Task calculations
  const activeTasks = tasks.filter(t => !["Completed", "Cancelled"].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === "Completed");
  const overdueTasks = tasks.filter(t => 
    t.dueDate && isBefore(t.dueDate, new Date()) && !["Completed", "Cancelled"].includes(t.status)
  );
  const thisWeekTasks = tasks.filter(t => 
    t.dueDate && 
    isAfter(t.dueDate, new Date()) && 
    isBefore(t.dueDate, addDays(new Date(), 7)) &&
    !["Completed", "Cancelled"].includes(t.status)
  );
  const recentTasks = tasks
    .filter(t => !["Completed", "Cancelled"].includes(t.status))
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);
  const upcomingTasks = tasks
    .filter(t => t.dueDate && !["Completed", "Cancelled"].includes(t.status))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Chart data
  const taskStatusData = [
    { name: "To Do", value: tasks.filter(t => t.status === "To Do").length, color: "#94a3b8" },
    { name: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, color: "#3b82f6" },
    { name: "Blocked", value: tasks.filter(t => t.status === "Blocked").length, color: "#ef4444" },
    { name: "Completed", value: tasks.filter(t => t.status === "Completed").length, color: "#22c55e" }
  ];

  const taskPriorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "High").length, color: "#ef4444" },
    { name: "Medium", value: tasks.filter(t => t.priority === "Medium").length, color: "#f59e0b" },
    { name: "Low", value: tasks.filter(t => t.priority === "Low").length, color: "#22c55e" }
  ];

  const completionTrendData = [
    { month: "Jan", created: 12, completed: 8 },
    { month: "Feb", created: 15, completed: 12 },
    { month: "Mar", created: 18, completed: 16 },
    { month: "Apr", created: 14, completed: 11 },
    { month: "May", created: 20, completed: 18 },
    { month: "Jun", created: 16, completed: 14 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Tasks Overview</h2>
        <Link to="/personal/tasks">
          <Button variant="outline" className="bg-white">View All Tasks</Button>
        </Link>
      </div>
      
      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{activeTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{Math.round((completedTasks.length / tasks.length) * 100)}%</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">+10%</span>
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
                <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
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
                <p className="text-2xl font-bold">{thisWeekTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recently created tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">
                    {task.dueDate ? format(task.dueDate, 'MMM dd') : 'No due date'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks with nearest due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                  </div>
                  <p className={`text-sm ml-2 ${
                    task.dueDate && isBefore(task.dueDate, new Date()) 
                      ? 'text-red-600 font-medium' 
                      : 'text-muted-foreground'
                  }`}>
                    {task.dueDate ? format(task.dueDate, 'MMM dd') : 'No due date'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={taskStatusData}
              series={[{ dataKey: "value", name: "Tasks", color: "#3b82f6", enabled: true }]}
              xAxisDataKey="name"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
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
            <CardTitle>Task Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={taskPriorityData}
              series={[{ dataKey: "value", name: "Tasks", color: "#f59e0b", enabled: true }]}
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

export default TasksOverview;
