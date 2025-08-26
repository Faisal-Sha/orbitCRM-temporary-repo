import { useState, useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import TaskBoardView from "@/components/personal/tasks/TaskBoardView";
import TaskCalendarView from "@/components/personal/tasks/TaskCalendarView";
import TasksSection from "@/components/personal/tasks/TasksSection";
import PersonalTasksList from "@/components/personal/tasks/PersonalTasksList";
import TeamTasksList from "@/components/personal/tasks/TeamTasksList";
import TasksFilter from "@/components/personal/tasks/TasksFilter";
import { Button } from "@/components/ui/button";
import { LayoutList, Kanban, Calendar, Plus } from "lucide-react";
import { generateId } from "@/lib/utils";
import ArchivedTasks from "@/components/personal/tasks/ArchivedTasks";

// Task type definition
interface Task {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  subtasks?: Task[];
  isExpanded?: boolean;
  sectionId: string;
}

interface TaskSection {
  id: string;
  title: string;
}

// Define task sections
const taskSections: TaskSection[] = [
  { id: 'personal', title: 'Personal Tasks' },
  { id: 'team', title: 'Team Tasks' },
];

// Generate some dummy tasks
const generateDummyTasks = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: "task-1",
      title: "Complete project proposal",
      category: "Work",
      priority: "High",
      status: "In Progress",
      dueDate: tomorrow,
      isExpanded: false,
      sectionId: "personal",
      subtasks: [
        {
          id: "subtask-1-1",
          title: "Research competitors",
          category: "Research",
          priority: "Medium",
          status: "Completed",
          dueDate: yesterday,
          sectionId: "personal",
        },
        {
          id: "subtask-1-2",
          title: "Create outline",
          category: "Work",
          priority: "Medium",
          status: "To Do",
          dueDate: today,
          sectionId: "personal",
        }
      ]
    },
    {
      id: "task-2",
      title: "Weekly team meeting",
      category: "Meeting",
      priority: "Medium",
      status: "To Do",
      dueDate: tomorrow,
      isExpanded: false,
      sectionId: "team",
    },
    {
      id: "task-3",
      title: "Gym session",
      category: "Health",
      priority: "Low",
      status: "To Do",
      dueDate: today,
      isExpanded: false,
      sectionId: "personal",
    },
    {
      id: "task-5",
      title: "Client presentation",
      category: "Meeting",
      priority: "High",
      status: "To Do",
      dueDate: nextWeek,
      isExpanded: false,
      sectionId: "team",
    },
    {
      id: "task-6",
      title: "Read new industry whitepaper",
      category: "Research",
      priority: "Low",
      status: "Completed",
      dueDate: yesterday,
      isExpanded: false,
      sectionId: "personal",
    }
  ] as Task[];
};

const Tasks = () => {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>(generateDummyTasks());
  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    status: "all",
  });

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.category === "all" || 
        task.category === filters.category;
      
      // Priority filter
      const matchesPriority = filters.priority === "all" || 
        task.priority === filters.priority;
      
      // Status filter
      const matchesStatus = filters.status === "all" || 
        task.status === filters.status;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, filters]);

  // Filter tasks by section
  const getTasksBySection = (sectionId: string) => {
    return filteredTasks.filter(task => task.sectionId === sectionId);
  };

  // Handle task toggle (expand/collapse)
  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isExpanded: !task.isExpanded };
        }
        
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask => {
            if (subtask.id === taskId) {
              return { ...subtask, isExpanded: !subtask.isExpanded };
            }
            return subtask;
          });
          
          return { ...task, subtasks: updatedSubtasks };
        }
        
        return task;
      })
    );
  };

  // Handle task completion
  const handleTaskComplete = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === "Completed" ? "To Do" : "Completed";
          return { ...task, status: newStatus };
        }
        
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask => {
            if (subtask.id === taskId) {
              const newStatus = subtask.status === "Completed" ? "To Do" : "Completed";
              return { ...subtask, status: newStatus as Task["status"] };
            }
            return subtask;
          });
          
          return { ...task, subtasks: updatedSubtasks };
        }
        
        return task;
      })
    );
  };

  // Handle task update
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        }
        
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask => {
            if (subtask.id === updatedTask.id) {
              return updatedTask;
            }
            return subtask;
          });
          
          return { ...task, subtasks: updatedSubtasks };
        }
        
        return task;
      })
    );
  };

  // Handle add task
  const handleAddTask = (sectionId: string, status: Task["status"] = "To Do") => {
    const newTask: Task = {
      id: generateId(),
      title: "New Task",
      category: "Personal",
      priority: "Medium",
      status: status,
      dueDate: new Date(),
      sectionId: sectionId,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  // Render content based on view mode
  const renderTasksContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TasksFilter 
            onSearch={setSearchTerm} 
            onFilterChange={handleFilterChange}
          />

          <div className="flex gap-2 self-end">
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "board" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("board")}
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "calendar" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "list" && (
          <div className="space-y-6">
            <TasksSection 
              id="personal"
              title="Personal Tasks"
              taskCount={getTasksBySection('personal').length}
              onAddTask={handleAddTask}
            >
              <PersonalTasksList
                tasks={filteredTasks}
                sections={taskSections}
                onTaskUpdate={handleTaskUpdate}
                onTaskToggle={handleTaskToggle}
                onTaskComplete={handleTaskComplete}
              />
            </TasksSection>

            <TasksSection 
              id="team"
              title="Team Tasks"
              taskCount={getTasksBySection('team').length}
              onAddTask={handleAddTask}
            >
              <TeamTasksList
                tasks={filteredTasks}
                sections={taskSections}
                onTaskUpdate={handleTaskUpdate}
                onTaskToggle={handleTaskToggle}
                onTaskComplete={handleTaskComplete}
              />
            </TasksSection>
          </div>
        )}
        
        {viewMode === "board" && (
          <TaskBoardView 
            tasks={filteredTasks} 
            onAddTask={(status) => handleAddTask(taskSections[0].id, status as Task["status"])}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        
        {viewMode === "calendar" && (
          <TaskCalendarView tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
        )}
      </div>
    );
  };

  const tabContent = (tabName: string) => (
    <div className="app-card">
      {tabName === "My Tasks" ? renderTasksContent() : (
        tabName === "Archived"
          ? <ArchivedTasks />
          : (
            <div>
              <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
              <p>This is the {tabName.toLowerCase()} tab content for Tasks.</p>
            </div>
          )
      )}
    </div>
  );

  const tabs = [
    { value: "mytasks", label: "My Tasks", content: tabContent("My Tasks") },
    { value: "archived", label: "Archived", content: tabContent("Archived") },
  ];

  return (
    <PageContainer
      title="Tasks"
      description="Manage and organize your personal tasks"
    >
      <TabsComponent tabs={tabs} defaultTab="mytasks" />
    </PageContainer>
  );
};

export default Tasks;
