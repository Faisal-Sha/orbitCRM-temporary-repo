
import { useState, useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import GoalsBoardView from "@/components/personal/goals/GoalsBoardView";
import GoalsCalendarView from "@/components/personal/goals/GoalsCalendarView";
import GoalsSection from "@/components/personal/goals/GoalsSection";
import GoalsMilestonesList from "@/components/personal/goals/GoalsMilestonesList";
import GoalsFilter from "@/components/personal/goals/GoalsFilter";
import { Button } from "@/components/ui/button";
import { LayoutList, Kanban, Calendar, Plus } from "lucide-react";
import { generateId } from "@/lib/utils";
import ArchivedGoals from "@/components/personal/goals/ArchivedGoals";

// Goal type definition
interface Goal {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  milestones?: Goal[];
  isExpanded?: boolean;
  sectionId: string;
}

interface GoalSection {
  id: string;
  title: string;
}

// Define goal sections
const goalSections: GoalSection[] = [
  { id: 'goals', title: 'Goals & Milestones' },
];

// Generate some dummy goals
const generateDummyGoals = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: "goal-1",
      title: "Launch personal website",
      category: "Personal",
      priority: "High",
      status: "In Progress",
      dueDate: tomorrow,
      isExpanded: false,
      sectionId: "goals",
      milestones: [
        {
          id: "milestone-1-1",
          title: "Design mockups",
          category: "Personal",
          priority: "Medium",
          status: "Completed",
          dueDate: yesterday,
          sectionId: "goals",
        },
        {
          id: "milestone-1-2",
          title: "Develop frontend",
          category: "Personal",
          priority: "Medium",
          status: "In Progress",
          dueDate: today,
          sectionId: "goals",
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
      isExpanded: false,
      sectionId: "goals",
    },
    {
      id: "goal-3",
      title: "Learn new programming language",
      category: "Research",
      priority: "Low",
      status: "To Do",
      dueDate: nextWeek,
      isExpanded: false,
      sectionId: "goals",
    },
    {
      id: "goal-4",
      title: "Achieve quarterly sales target",
      category: "Work",
      priority: "High",
      status: "Blocked",
      dueDate: yesterday,
      isExpanded: false,
      sectionId: "goals",
    },
    {
      id: "goal-5",
      title: "Organize home office",
      category: "Personal",
      priority: "Low",
      status: "Completed",
      dueDate: yesterday,
      isExpanded: false,
      sectionId: "goals",
    },
    {
      id: "goal-6",
      title: "Build emergency fund",
      category: "Opportunity",
      priority: "High",
      status: "In Progress",
      dueDate: nextWeek,
      isExpanded: false,
      sectionId: "goals",
    }
  ] as Goal[];
};

const Goals = () => {
  // State for goals
  const [goals, setGoals] = useState<Goal[]>(generateDummyGoals());
  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    status: "all",
  });

  // Filter goals based on search and filters
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.category === "all" || 
        goal.category === filters.category;
      
      // Priority filter
      const matchesPriority = filters.priority === "all" || 
        goal.priority === filters.priority;
      
      // Status filter
      const matchesStatus = filters.status === "all" || 
        goal.status === filters.status;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [goals, searchTerm, filters]);

  // Filter goals by section
  const getGoalsBySection = (sectionId: string) => {
    return filteredGoals.filter(goal => goal.sectionId === sectionId);
  };

  // Handle goal toggle (expand/collapse)
  const handleGoalToggle = (goalId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          return { ...goal, isExpanded: !goal.isExpanded };
        }
        
        if (goal.milestones) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === goalId) {
              return { ...milestone, isExpanded: !milestone.isExpanded };
            }
            return milestone;
          });
          
          return { ...goal, milestones: updatedMilestones };
        }
        
        return goal;
      })
    );
  };

  // Handle goal completion
  const handleGoalComplete = (goalId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newStatus = goal.status === "Completed" ? "To Do" : "Completed";
          return { ...goal, status: newStatus };
        }
        
        if (goal.milestones) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === goalId) {
              const newStatus = milestone.status === "Completed" ? "To Do" : "Completed";
              return { ...milestone, status: newStatus as Goal["status"] };
            }
            return milestone;
          });
          
          return { ...goal, milestones: updatedMilestones };
        }
        
        return goal;
      })
    );
  };

  // Handle goal update
  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === updatedGoal.id) {
          return updatedGoal;
        }
        
        if (goal.milestones) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === updatedGoal.id) {
              return updatedGoal;
            }
            return milestone;
          });
          
          return { ...goal, milestones: updatedMilestones };
        }
        
        return goal;
      })
    );
  };

  // Handle add goal
  const handleAddGoal = (sectionId: string, status: Goal["status"] = "To Do") => {
    const newGoal: Goal = {
      id: generateId(),
      title: "New Goal",
      category: "Personal",
      priority: "Medium",
      status: status,
      dueDate: new Date(),
      sectionId: sectionId,
    };
    
    setGoals(prevGoals => [...prevGoals, newGoal]);
  };

  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  // Render content based on view mode
  const renderGoalsContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <GoalsFilter 
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
            <GoalsSection 
              id="goals"
              title="Goals & Milestones"
              goalCount={getGoalsBySection('goals').length}
              onAddGoal={handleAddGoal}
            >
              <GoalsMilestonesList
                goals={filteredGoals}
                sections={goalSections}
                onGoalUpdate={handleGoalUpdate}
                onGoalToggle={handleGoalToggle}
                onGoalComplete={handleGoalComplete}
              />
            </GoalsSection>
          </div>
        )}
        
        {viewMode === "board" && (
          <GoalsBoardView 
            goals={filteredGoals} 
            onAddGoal={(status) => handleAddGoal(goalSections[0].id, status as Goal["status"])}
            onGoalUpdate={handleGoalUpdate}
          />
        )}
        
        {viewMode === "calendar" && (
          <GoalsCalendarView goals={filteredGoals} onGoalUpdate={handleGoalUpdate} />
        )}
      </div>
    );
  };

  const tabContent = (tabName: string) => (
    <div className="app-card">
      {tabName === "My Goals" ? renderGoalsContent() : (
        tabName === "Archived"
          ? <ArchivedGoals />
          : (
            <div>
              <h3 className="app-heading-3 mb-4">{tabName} Content</h3>
              <p>This is the {tabName.toLowerCase()} tab content for Goals.</p>
            </div>
          )
      )}
    </div>
  );

  const tabs = [
    { value: "mygoals", label: "My Goals", content: tabContent("My Goals") },
    { value: "archived", label: "Archived", content: tabContent("Archived") },
  ];

  return (
    <PageContainer
      title="Goals"
      description="Manage and track your personal goals"
    >
      <TabsComponent tabs={tabs} defaultTab="mygoals" />
    </PageContainer>
  );
};

export default Goals;
